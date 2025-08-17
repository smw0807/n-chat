import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  BCRYPT_SALT: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
