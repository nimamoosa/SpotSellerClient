export type CourseType = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  sales_reports: {
    sale: number;
    canceled: number;
  };
  media_url: string;
  active: boolean;
  discount: {
    code: string;
    amount: number;
  };
  amount: number;
};
