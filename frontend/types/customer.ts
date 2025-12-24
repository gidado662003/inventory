export interface Customer {
  _id: string;
  customerName: string;
  phone?: string;
  amountOwed?: number;
  itemsOwed?: OwedItem[];
  owedGroups?: OwedGroup[];
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

export interface OwedItem {
  _id?: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  amountPaid?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwedGroupItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface OwedGroup {
  _id: string;
  items: OwedGroupItem[];
  total: number;
  amountPaid: number;
  outstanding: number;
  createdAt?: string;
  updatedAt?: string;
}
