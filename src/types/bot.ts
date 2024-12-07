export type BotType = {
  token: string;
  botId: string;
  setting: {
    status: boolean;
  };
};

export type BotInfoType = {
  can_connect_to_business: boolean;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  first_name: string;
  has_main_web_app: boolean;
  id: number;
  is_bot: boolean;
  supports_inline_queries: boolean;
  username: string;
  about: string;
  description: string;
};
