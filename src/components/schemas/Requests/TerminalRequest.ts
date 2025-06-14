import Joi from 'joi';

const platformSchema = Joi.object({
  osName: Joi.string().required(),
  osVersion: Joi.string().required(),
  osBuild: Joi.string().required(),
  macAddress: Joi.string()
    .pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
    .required()
    .messages({
      'string.pattern.base': 'macAddress must be a valid MAC address format (e.g., "38:fc:98:12:0f:b6")'
    })
});

const posSchema = Joi.object({
  productID: Joi.string().required(),
  productVersion: Joi.string().allow('')
});

const environmentSchema = Joi.object({
  platform: platformSchema.required(),
  pos: posSchema.required()
});

export const TerminalActivationSchema = Joi.object({
  tac: Joi.string()
    .pattern(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'terminalActivationCode must be in the format "XXXX-XXXX-XXXX-XXXX" where X is uppercase letter or digit'
    }),
  osName: Joi.string().required(),
  osVersion: Joi.string().required(),
  osBuild: Joi.string().required(),
  macAddress: Joi.string()
    .pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
    .required()
    .messages({
      'string.pattern.base': 'macAddress must be a valid MAC address format (e.g., "38:fc:98:12:0f:b6")'
    }),
  productID: Joi.string().required(),
  productVersion: Joi.string().allow('')
});