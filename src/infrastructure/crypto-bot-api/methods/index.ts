import { createInvoiceCBApiRequest } from './create-invoice';

export const cbApi = {
  createInvoice: createInvoiceCBApiRequest,
};

export type { CreateInvoiceCBApiParams, CreateInvoiceCBApiResponse } from './create-invoice';
