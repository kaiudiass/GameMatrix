import { AppError } from './AppError.js';

export class ValidationException extends AppError {
  constructor(message = 'Dados inválidos na requisição', errors = []) {
    super(message, 400, errors);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 401);
  }
}

export class ForbiddenException extends AppError {
  constructor(message = 'Acesso proibido') {
    super(message, 403);
  }
}

export class NotFoundException extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class ConflictException extends AppError {
  constructor(message = 'Conflito de dados no sistema') {
    super(message, 409);
  }
}

export {
  AppError
};

export default {
  AppError,
  ValidationException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException
};
