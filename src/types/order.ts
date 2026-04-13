export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  productTranslations: any[]; // có thể refine sau
  skuPrice: number;
  image: string;
  skuValue: string;
  skuId: number;
  orderId: number;
  quantity: number;
  createdAt: string;
};

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING_PICKUP"
  | "COMPLETED"
  | "CANCELLED"; // thêm nếu có

export type Order = {
  id: number;
  userId: number;
  status: OrderStatus;
  shopId: number;
  paymentId: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type OrdersResponse = {
  data: Order[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Receiver = {
  name: string;
  phone: string;
  address: string;
};

export type SepayWebhook = {
  id: number; // ID giao dịch trên SePay
  gateway: string; // tên ngân hàng (MBBank, Vietcombank,...)
  transactionDate: string; // "YYYY-MM-DD HH:mm:ss"
  accountNumber: string; // số tài khoản nhận
  code: string | null; // mã cấu hình (có thể null)
  content: string; // nội dung chuyển khoản (VD: DH3)
  transferType: "in" | "out"; // tiền vào / ra
  transferAmount: number; // số tiền giao dịch
  accumulated: number; // số dư sau giao dịch
  subAccount: string | null; // tài khoản phụ
  referenceCode: string; // mã tham chiếu SMS
  description: string; // nội dung đầy đủ SMS
};