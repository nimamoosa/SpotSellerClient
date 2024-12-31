export type AvailableUsersType = {
  userId: Number;
  name: String;
  required: true;
};

export type AvailableCourses = {
  courseId: string;
  share: number;
  share_for_users: {
    userId: number;
    share: number;
  }[];
};

export type CooperationSalesType = {
  type: "for_all_user" | "for_user";
  available_users: AvailableUsersType[];
  available_courses: AvailableCourses[];
  settings: {
    status: boolean;
  };
};
