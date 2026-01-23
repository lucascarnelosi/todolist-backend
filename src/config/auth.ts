export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key',
  },
};