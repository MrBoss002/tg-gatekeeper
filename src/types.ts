export interface GatekeeperOptions {
  /**
   * List of channel usernames (e.g., ["@ChannelOne", "@ChannelTwo"])
   * Or a comma-separated string from process.env.REQUIRED_CHANNELS
   */
  channels: string[] | string;
  
  /**
   * Custom message shown when user is not subscribed
   */
  customMessage?: string;
  
  /**
   * Auto-deletion timeout for group warning messages (in seconds).
   * Default: 30 seconds. Set to 0 to disable auto-delete.
   */
  autoDeleteSeconds?: number;

  /**
   * Text for the verification button.
   * Default: "✅ I Have Joined"
   */
  verifyButtonText?: string;
}

export interface CheckResult {
  isSubscribed: boolean;
  missingChannels: string[];
}
