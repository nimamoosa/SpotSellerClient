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

export type CooperationSalesClientType = {
  available_users: AvailableUsersType[];
  available_courses: AvailableCourses[];
  settings: CooperationSalesSetting;
};

/** ------------------------------ */

export type UserInfoCooperationType = {
  userId: number;
  username: string;
  name: string;
};

export type SalesCooperationType = "success" | "cancel" | "in_progress";

export type SalesCooperation = {
  paymentId: string;
  courseId: string;
  userId: number;
  name: string;
  type: SalesCooperationType;
  profit_share: number;
  pay: boolean;
  time: Date;
};

export type SalesLinkCooperationType = {
  courseId: string;
  user_info: UserInfoCooperationType;
  link: string;
  sales: SalesCooperation[];
};

export type CooperationSales = {
  sale_links: SalesLinkCooperationType[];
};
