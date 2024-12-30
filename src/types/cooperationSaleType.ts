export type AvailableUsersType = {
  userId: Number;
  name: String;
  required: true;
};

export type CooperationSalesType = {
  type: "for_all_user" | "for_user";
  available_users: AvailableUsersType;
};
