// env.ts
export default () => ({
  // Add your own properties here however you'd like
  port: parseInt(process.env.PORT, 10) || 3000,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
});
