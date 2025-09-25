
import IConfig from "./common/IConfig.interface";
import { env, oneOf, indexStrOrFalse, readKeyPair } from "./helpers/Env";

const authKeys = readKeyPair({
  publicFileEnv: 'AUTH_PUBLIC_KEY_FILE',
  privateFileEnv: 'AUTH_PRIVATE_KEY_FILE',
  publicB64Env: 'AUTH_PUBLIC_KEY_B64',
  privateB64Env: 'AUTH_PRIVATE_KEY_B64',
});

const refreshKeys = readKeyPair({
  publicFileEnv: 'REFRESH_PUBLIC_KEY_FILE',
  privateFileEnv: 'REFRESH_PRIVATE_KEY_FILE',
  publicB64Env: 'REFRESH_PUBLIC_KEY_B64',
  privateB64Env: 'REFRESH_PRIVATE_KEY_B64',
});

const Config: IConfig = {
  server: {
    backend: {
      host: env.str('BACKEND_HOST', 'localhost'),
      port: env.int('BACKEND_PORT', 10000),
      static: {
        path: env.str('STATIC_PATH', './static'),
        route: env.str('STATIC_ROUTE', '/assets'),
        cacheControl: env.bool('STATIC_CACHE_CONTROL', true),
        dotfiles: oneOf('STATIC_DOTFILES', ['deny','allow'] as const, 'deny'),
        etag: env.bool('STATIC_ETAG', true),
        index: indexStrOrFalse('STATIC_INDEX', false), // "false" => false, else string
        maxAge: env.int('STATIC_MAXAGE', 36000),
      },
    },
    frontend: {
      host: env.str('FRONTEND_HOST', 'localhost'),
      port: env.int('FRONTEND_PORT', 3000),
    },
  },

  logging: {
    path: env.str('LOG_PATH', './logs'),
    filename: env.str('LOG_FILE', 'access.log'),
    format:
      ':date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-lenght] bytes\t:response-time ms',
  },

  database: {
    host: env.str('DB_HOST', 'localhost'),
    port: env.int('DB_PORT', 3306),
    user: env.str('DB_USER'),
    password: env.str('DB_PASS'),
    database: env.str('DB_NAME'),
    charset: oneOf('DB_CHARSET', ['utf8','utf8mb4','ascii'] as const, 'utf8'),
    timezone: oneOf('DB_TZ', ['+01:00','+09:00','-07:00'] as const, '+01:00'),
    supportBigNumbers: env.bool('DB_SUPPORT_BIG_NUMBERS', true),
  },

  fileUploads: {
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024,
    tempFileDirectory: "../temp/",
    destinationDirectoryRoot: "uploads/",
    photos: {
      allowedTypes: ["png", "jpg"],
      allowedExtensions: [".png", ".jpg"],
      width: { min: 320, max: 1920 },
      height: { min: 240, max: 1080 },
      resize: [
        {
          prefix: "small-",
          width: 160,
          height: 120,
          fit: "cover",
          defaultBackground: { r: 0, g: 0, b: 0, alpha: 1 },
        },
        {
          prefix: "medium-",
          width: 640,
          height: 480,
          fit: "cover",
          defaultBackground: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      ],
    },
  },

  mail: {
    service: env.str('MAIL_SERVICE', 'Outlook365'),
    auth: {
      email: env.str('MAIL_EMAIL'),
      pass: env.str('MAIL_PASS'),
    },
  },

  auth: {
    administrator: {
      issuer: env.str('AUTH_ADMIN_ISSUER', 'Piivt'),
      algorithm: env.str('AUTH_ADMIN_ALGO', 'RS256') as IConfig['auth']['administrator']['algorithm'],
      tokens: {
        auth: {
          duration: env.int('AUTH_TOKEN_DURATION', 60 * 15),
          keys: authKeys,
        },
        refresh: {
          duration: env.int('REFRESH_TOKEN_DURATION', 60 * 60 * 6),
          keys: refreshKeys,
        },
      },
    },
    allowAllRoutesWithoutAuthTokens: env.bool('ALLOW_ALL_ROUTES_WITHOUT_AUTH', false),
  },
};

export default Config;
