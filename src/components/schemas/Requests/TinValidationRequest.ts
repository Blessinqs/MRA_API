import Joi from 'joi';

export const TinValidationSchema = Joi.object({
  tpin: Joi.string().min(6).required(),
  taxpayerName: Joi.string().required(),
  emailAddress: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
});

// "tpin": "20202020",
// "taxpayerName": "SAMPLE TRADER",
// "emailAddress": "trial@trial.com",
// "phoneNumber": "09932728372"