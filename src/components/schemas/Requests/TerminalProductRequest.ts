import Joi from 'joi';

export const TerminalProductSchema = Joi.object({
  tin: Joi.string().min(6).required(),
  siteId: Joi.string().allow('').required()
});