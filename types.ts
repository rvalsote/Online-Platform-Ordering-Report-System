
export interface OrderItem {
  description: string;
  variation?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  sku?: string;
}

export interface OrderData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  grandTotal: number;
  currency: string;
  trackingNumber?: string;
  carrier?: string;
  weight?: string;
}

export type Platform = 'Shopee' | 'Lazada' | 'Tiktok';

export type AppView = 'landing' | 'platform-selection' | 'upload' | 'dashboard' | 'waybill' | 'aggregate' | 'invoice';
