const environment = {
  jwt: {
    issuer: process.env.DOMAIN,
    expire: JSON.parse(process.env.JWT_EXPIRE),
    secret: process.env.JWT_SECRET,
    secretActivate: process.env.JWT_SECRET_ACTIVATE,
    secretPasswordForgot: process.env.JWT_SECRET_PASSWORD_FORGOT,
    expirePasswordForgot: JSON.parse(process.env.JWT_EXPIRE_PASSWORD_FORGOT),
    algorithm: process.env.JWT_ALGORITHM,
  },
  express: {
    appName: 'iTec Recycle',
    env: process.env.NODE_ENV,
    host: process.env.HOST,
    domain: process.env.DOMAIN,
    resources: process.env.RESOURCES,
    port: process.env.PORT,
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  supportInfo: {
    email: process.env.SUPPORT_INFO_EMAIL,
  },
  smtp: {
    provider: process.env.SMTP_PROVIDER,
    host: process.env.SMTP_HOST,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    port: process.env.SMTP_PORT,
    secure: JSON.parse(process.env.SMTP_SECURE),
  },
};

module.exports = {
  environment,
};
