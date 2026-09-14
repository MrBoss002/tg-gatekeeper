import { GatekeeperOptions, CheckResult } from "./types";

/**
 * Universal Gatekeeper Engine for Telegram Bots
 */
export class Gatekeeper {
  private channels: string[];
  private customMessage: string;
  private autoDeleteSeconds: number;
  private verifyButtonText: string;

  constructor(options: GatekeeperOptions) {
    if (typeof options.channels === "string") {
      this.channels = options.channels.split(",").map((ch) => ch.trim());
    } else {
      this.channels = options.channels || [];
    }

    this.customMessage =
      options.customMessage ||
      "⚠️ **Access Denied!**\n\nYou must join our channel(s) before sending messages or using this bot.";
    this.autoDeleteSeconds = options.autoDeleteSeconds ?? 30;
    this.verifyButtonText = options.verifyButtonText || "✅ I Have Joined";
  }

  /**
   * Formats channel inputs into clean @usernames
   */
  public getChannels(): string[] {
    return this.channels.map((ch) => (ch.startsWith("@") ? ch : `@${ch}`));
  }

  /**
   * Helper function to check member status via Telegram API (`getChatMember`)
   */
  public async checkSubscription(
    telegramApiCall: (channel: string, userId: number) => Promise<any>,
    userId: number
  ): Promise<CheckResult> {
    const missingChannels: string[] = [];
    const validStatuses = ["creator", "administrator", "member"];

    for (const channel of this.getChannels()) {
      try {
        const member = await telegramApiCall(channel, userId);
        if (!member || !validStatuses.includes(member.status)) {
          missingChannels.push(channel);
        }
      } catch (error) {
        // If bot is not admin in target channel or username is invalid
        missingChannels.push(channel);
      }
    }

    return {
      isSubscribed: missingChannels.length === 0,
      missingChannels,
    };
  }

  /**
   * Generates inline keyboard markup for missing channels + verify button
   */
  public buildInlineKeyboard(missingChannels: string[]) {
    const inlineKeyboard = missingChannels.map((channel) => [
      {
        text: `📢 Join ${channel}`,
        url: `https://t.me/${channel.replace("@", "")}`,
      },
    ]);

    // Add verification callback button
    inlineKeyboard.push([
      {
        text: this.verifyButtonText,
        callback_data: "gatekeeper_verify",
      },
    ]);

    return { inline_keyboard: inlineKeyboard };
  }

  /**
   * Middleware handler for gramY framework
   */
  public grammyMiddleware() {
    return async (ctx: any, next: () => Promise<void>) => {
      // Ignore automated channel/service updates or bots
      if (!ctx.from || ctx.from.is_bot) return next();

      const userId = ctx.from.id;
      const isGroup = ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";

      // Handle Verification Callback Button Click
      if (ctx.callbackQuery && ctx.callbackQuery.data === "gatekeeper_verify") {
        const result = await this.checkSubscription(
          (ch, uid) => ctx.api.getChatMember(ch, uid),
          userId
        );

        if (result.isSubscribed) {
          await ctx.answerCallbackQuery({
            text: "🎉 Thank you for joining! You can now use the bot and chat freely.",
            show_alert: true,
          });
          try {
            await ctx.deleteMessage();
          } catch (e) {
            /* ignore if already deleted */
          }
        } else {
          const missingStr = result.missingChannels.join(", ");
          await ctx.answerCallbackQuery({
            text: `⚠️ You still need to join: ${missingStr}`,
            show_alert: true,
          });
        }
        return;
      }

      // Check user status on standard messages / commands
      const check = await this.checkSubscription(
        (ch, uid) => ctx.api.getChatMember(ch, uid),
        userId
      );

      if (check.isSubscribed) {
        return next();
      }

      // User is NOT subscribed:
      if (isGroup && ctx.message) {
        // 1. Delete user's message in group
        try {
          await ctx.deleteMessage();
        } catch (err) {
          console.warn("Gatekeeper Warning: Bot lacks delete permission in this group.");
        }
      }

      // 2. Send warning message with join buttons
      const sentMsg = await ctx.reply(this.customMessage, {
        parse_mode: "Markdown",
        reply_markup: this.buildInlineKeyboard(check.missingChannels),
      });

      // 3. Auto-delete warning message after configured time (default 30s) in groups
      if (isGroup && this.autoDeleteSeconds > 0 && sentMsg?.message_id) {
        setTimeout(async () => {
          try {
            await ctx.api.deleteMessage(ctx.chat.id, sentMsg.message_id);
          } catch (e) {
            /* Message already deleted by verify click or manual deletion */
          }
        }, this.autoDeleteSeconds * 1000);
      }
    };
  }
}

/**
 * Convenience wrapper function for 1-line middleware usage
 */
export function gatekeeper(options: GatekeeperOptions) {
  const instance = new Gatekeeper(options);
  return instance.grammyMiddleware();
}
