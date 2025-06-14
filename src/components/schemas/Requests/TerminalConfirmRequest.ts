import Joi from 'joi';

export const TerminalConfirmationSchema = Joi.object({
  tac: Joi.string().min(12).required(),
  secret: Joi.string().min(12).required()
});