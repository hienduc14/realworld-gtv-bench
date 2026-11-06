import generateToken from './token.utils';

export const refreshToken = (id: number): string => generateToken(id);

export default refreshToken;
