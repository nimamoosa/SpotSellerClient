export type AuthType = {
  userId: number;
  botId: number;
  name: string;
  provider: string;
  auth_filed: string;
  remember: boolean;
  subscription: string;
  points: string;
  wallet: {
    wallet_id: string;
    wallet_balance: number;
  };
  setting: {
    is_banned: boolean;
    is_muted: boolean;
    is_suspended: {
      is: boolean;
      reason: string;
      util: Date;
    };
  };
  site: {
    is_site: boolean;
    site_link: string;
    authorization_key: string;
  };
};
