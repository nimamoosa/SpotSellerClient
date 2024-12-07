export type RegisteredUsersWalletType = {
  wallet_id: number;
  wallet_balance: number;
};

export type RegisteredUsersSettingsType = {
  is_banned: boolean;
};

export type RegisteredUsersType = {
  userId: number;
  token: string;
  phone_number: string;
  name: string;
  points: number;
  wallet: RegisteredUsersWalletType;
  settings: RegisteredUsersSettingsType;
  time_join: string;
};
