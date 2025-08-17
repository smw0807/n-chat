import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  bcryptSalt: process.env.BCRYPT_SALT,
  tokenSecret: process.env.TOKEN_SECRET,
}));
