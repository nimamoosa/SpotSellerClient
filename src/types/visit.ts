export type BotVisitUsersType = {
  userId: number;
  name: string;
};

export type TransactionUsersType = {
  userId: number;
  name: string;
  amount: string;
  type: "success" | "cancel" | "in_progress";
};

export type BotVisitType = {
  users: BotVisitUsersType[];
  date: string;
};

export type TransactionType = {
  users: TransactionUsersType[];
  date: string;
};
