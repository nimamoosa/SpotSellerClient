export type CourseType = {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  sales_reports: {
    sale: number;
    canceled: number;
  };
  media_url: string;
  active: boolean;
  discount_code: string;
  amount: string;
};
