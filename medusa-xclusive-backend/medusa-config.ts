import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

const dynamicModules = {};

const stripeApiKey = process.env.STRIPE_API_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const isStripeConfigured = Boolean(stripeApiKey) && Boolean(stripeWebhookSecret);

if (isStripeConfigured) {
  dynamicModules[Modules.PAYMENT] = {
    resolve: '@medusajs/medusa/payment',
    options: {
      providers: [
        {
          resolve: '@medusajs/medusa/payment-stripe',
          id: 'stripe',
          options: {
            apiKey: stripeApiKey,
            webhook_secret: stripeWebhookSecret, // Corrected to snake_case as per some plugin versions
            capture: true,
          },
        },
      ],
    },
  };
}

const modules = {
  [Modules.FILE]: {
    resolve: '@medusajs/medusa/file',
    options: { /* Your S3 config... */ },
  },
  [Modules.NOTIFICATION]: {
    resolve: '@medusajs/medusa/notification',
    options: { /* Your Resend config... */ },
  },
  [Modules.CACHE]: {
    resolve: '@medusajs/medusa/cache-redis',
    options: { redisUrl: process.env.REDIS_URL },
  },
  [Modules.EVENT_BUS]: {
    resolve: '@medusajs/medusa/event-bus-redis',
    options: { redisUrl: process.env.REDIS_URL },
  },
  [Modules.WORKFLOW_ENGINE]: {
    resolve: '@medusajs/medusa/workflow-engine-redis',
    options: { redis: { url: process.env.REDIS_URL } },
  },
};

// Define the configuration in the format TypeScript expects
const config = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as 'shared' | 'worker' | 'server',
    http: {
      storeCors: process.env.STORE_CORS || '',
      adminCors: process.env.ADMIN_CORS || '',
      authCors: process.env.AUTH_CORS || '',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: {
    backendUrl: process.env.BACKEND_URL || 'https://xclusive-medusa-production.up.railway.app',
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
  },
  modules: {
    ...modules,
    ...dynamicModules,
  },
});

// Manually add the snake_case properties that the runtime server needs for CORS
(config.projectConfig as any).store_cors = process.env.STORE_CORS || '';
(config.projectConfig as any).admin_cors = process.env.ADMIN_CORS || '';
(config.projectConfig as any).auth_cors = process.env.AUTH_CORS || '';

// Export the final, modified config
module.exports = config;