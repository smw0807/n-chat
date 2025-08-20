import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  LOG_LEVEL: Joi.string().required(),
  BCRYPT_SALT: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  // CORS
  CORS_ORIGIN: Joi.string().required(),
  CORS_METHODS: Joi.string().required(),
  CORS_ALLOWED_HEADERS: Joi.string().required(),
  // POSTGRES
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  // GOOGLE
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URI: Joi.string().required(),
  // KAKAO
  KAKAO_API_URL: Joi.string().required(),
  KAKAO_REST_API_KEY: Joi.string().required(),
  KAKAO_REDIRECT_URI: Joi.string().required(),
});
