import { ValidationException } from '../exceptions/index.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  const dataToValidate = req[source] || {};
  const result = schema.safeParse(dataToValidate);

  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const formattedErrors = issues.map((issue) => ({
      field: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path || ''),
      message: issue.message
    }));

    return next(new ValidationException('Dados inválidos na requisição', formattedErrors));
  }

  req[source] = result.data;
  next();
};

export const validateParams = (schema) => validate(schema, 'params');
export const validateQuery = (schema) => validate(schema, 'query');
export const validateBody = (schema) => validate(schema, 'body');

export default validate;
