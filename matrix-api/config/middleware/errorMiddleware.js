import { AppError } from '../exceptions/AppError.js';

export const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
      ...(isDevelopment ? { stack: err.stack } : {})
    });
  }

  console.error('[Unhandled API Exception]:', err);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(isDevelopment ? { stack: err.stack } : {})
  });
};

export default errorHandler;
