export const VALIDATORS = process.env.NODE_ENV === 'development' ? [
  'http://localhost:8082',
] : [
  'https://val1.near-tips.com',
  'https://val2.near-tips.com',
];

export const BOT_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:8083' : 'https://api.near-tips.com';