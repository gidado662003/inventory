export interface Customer {
  _id: string;
  customerName: string;
  phone?: string;
  amountOwed?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCustomerRequest {
  customerName: string;
  phone: string;
}

export interface CustomerFormData {
  customerName: string;
  phone: string;
}
