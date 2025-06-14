import Joi from 'joi';

export const TerminalProductStatusSchema = Joi.object({
  tin: Joi.string().min(6).required(),
  productId: Joi.string().allow('').required()
});