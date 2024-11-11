import { cbaAxiosInstance } from '../axios-instance';
import { CBApiAsset } from '../types';

export type CreateInvoiceCBApiParams = {
  asset: CBApiAsset;
  amount: string;
  description?: string;
  hidden_message?: string;
  allow_comments?: boolean;
  paid_btn_name?: 'viewItem' | 'openChannel' | 'openBot' | 'callback';
  paid_btn_url?: string;
  payload?: string;
  allow_anonymous?: boolean;
  expires_in?: number;
};

export type CreateInvoiceCBApiResponse = {
  invoice_id: number;
  status: 'active' | 'paid' | 'expired';
  hash: string;
  asset: string;
  created_at: string;
  amount: string;
  pay_url: string;
  allow_comments: boolean;
  expiration_date?: string;
  description: string;
  paid_at?: string;
  allow_anonymous: boolean;
  mini_app_invoice_url: string;
};

export const createInvoiceCBApiRequest = (params: CreateInvoiceCBApiParams) => {
  return cbaAxiosInstance.post<never, CreateInvoiceCBApiResponse>('createInvoice', params);
};
