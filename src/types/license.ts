export type LicenseSchemaType = {
  userId: number;
  name: string;
  phone_number: string;
  course_id: string;
  course_name: string;
  license_key: string;
  time_created: string;
};

export type LicenseType = LicenseSchemaType[] | null;
