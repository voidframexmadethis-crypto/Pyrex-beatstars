export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  PERSONAL_PAYPAL_EMAIL: process.env.PERSONAL_PAYPAL_EMAIL || 'krypside@gmail.com',
  CREATOMATE_API_KEY: process.env.CREATOMATE_API_KEY || 'test_61a2b3c4d5e6f7g8',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'AKIAIOSFODNEXAMI',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET || 'krypside-tracks-storage',
  S3_BUCKET: process.env.S3_BUCKET || 'krypside-tracks-storage',
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || 'DEV_KRYPSIDE_SECRE',
  STORAGE_MODE: 'LOCAL_VAULT',
  VAULT_PATH: './vault_storage',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:p'
};

