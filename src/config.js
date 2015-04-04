export const HTTP_PORT    = process.env.PORT || '3000';

export const MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/db1';

export const JWT_SECRET = 'shhhhhhared-secret';
export const TOKEN_EXPIRATION = 60;
export const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;
