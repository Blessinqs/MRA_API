import Joi from 'joi';

// Schema for invoiceHeader
const invoiceHeaderSchema = Joi.object({
  tac: Joi.string().required(),
  buyerTIN: Joi.string().allow('').optional(),
  buyerName: Joi.string().allow('').optional(),
  count: Joi.number().required(),
  offline: Joi.boolean().required(),
  date: Joi.string().allow('').optional(),
  paymentMethod: Joi.string().allow('').optional()
});

// Schema for line items
const lineItemSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  productCode: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  unitPrice: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
  discount: Joi.number().min(0).allow(0),
  total: Joi.number().min(0).required(),
  totalVAT: Joi.number().min(0).required(),
  taxRateId: Joi.string().required(),
  isProduct: Joi.boolean().required()
});

// Main invoice schema
export const SaleInvoiceSchema = Joi.object({
  invoiceMain: invoiceHeaderSchema.required(),
  invoiceLineItems: Joi.array().items(lineItemSchema).min(1).required(),
});