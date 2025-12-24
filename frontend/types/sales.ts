export interface Item {
  _id: string;
  name: string;
  salePrice: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  salePrice: number;
  quantity: number;
  paymentType: string;
  customer: string;
}

export interface SaleData {
  items: CartItem[];
  customerName: string;
  amountPaid: number;
}

export interface SalesSummary {
  cash: number;
  transfer: number;
  outstanding: number;
  partial: number;
  total: number;
  totalSales: number;
}

export type PaymentType = "Cash" | "Transfer" | "Partial/Unpaid";

export interface PaymentOption {
  type: PaymentType;
  icon: string;
  color: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    type: "Cash",
    icon: "💵",
    color: "bg-green-100 text-green-800",
  },
  {
    type: "Transfer",
    icon: "📱",
    color: "bg-blue-100 text-blue-800",
  },
  // {
  //   type: "Unpaid",
  //   icon: "📝",
  //   color: "bg-yellow-100 text-yellow-800",
  // },
  {
    type: "Partial/Unpaid",
    icon: "💰",
    color: "bg-purple-100 text-purple-800",
  },
];
