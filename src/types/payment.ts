export type PaymentMethodType = Array<"cart_by_cart" | "wallet" | "zarinpal">;

export type PaymentsType = {
  type: string;
  field: string;
  date: Date;
};

export type PaymentClientType = {
  payment_methods: PaymentMethodType;
  payments: PaymentsType[];
  createdAt: string;
  updatedAt: string;
} | null;
