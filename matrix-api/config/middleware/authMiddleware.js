import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedException, ForbiddenException } from '../exceptions/index.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedException('Token de autenticação não fornecido'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ForbiddenException('Token inválido ou expirado'));
  }
};

export default authenticate;
