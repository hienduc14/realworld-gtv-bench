import * as jwt from 'jsonwebtoken';

const generateToken = (user: { id: number; username: string }): string =>
  jwt.sign({ user: { id: user.id, username: user.username } }, process.env.JWT_SECRET || 'superSecret', {
    expiresIn: '60d',
  });

export default generateToken;
