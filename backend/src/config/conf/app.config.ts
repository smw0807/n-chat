import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  appName: process.env.APP_NAME,
  appPort: process.env.APP_PORT,
}));
