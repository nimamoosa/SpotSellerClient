export type AvailableUsersType = {
  userId: Number;
  name: String;
};

export type AvailableCourses = {
  courseId: string;
  share: number;
  share_for_users: {
    userId: number;
    share: number;
  }[];
};

export type CooperationSalesSetting = {
  status: boolean;
};

export type CooperationSales = {
  paymentId: string;
  userId: number;
  courseId: string;
  amount: number;
  status: "success" | "cancel";
};

export type CooperationSalesType = {
  available_users: AvailableUsersType[];
  available_courses: AvailableCourses[];
  sales: CooperationSales[];
  settings: CooperationSalesSetting;
};
