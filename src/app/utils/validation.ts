import HttpException from '../models/http-exception.model';

// Single throw site for every validator, so a change to the HttpException
// constructor only needs to be applied here.
const fail = (field: string, message: string): never => {
  throw new HttpException(422, { errors: { [field]: [message] } });
};

// Counts Unicode code points rather than UTF-16 units, so accented or emoji
// characters count as one character each.
const charLength = (value: string): number => Array.from(value).length;

const validateLength = (
  field: string,
  value: unknown,
  min: number,
  max: number
): void => {
  if (typeof value !== 'string') {
    fail(field, 'must be a string');
  }

  const length = charLength(value as string);

  if (length < min) {
    fail(
      field,
      min <= 1
        ? "can't be blank"
        : `is too short (minimum is ${min} characters)`
    );
  }

  if (length > max) {
    fail(field, `is too long (maximum is ${max} characters)`);
  }
};

export const validateTitle = (title: unknown): void => {
  validateLength('title', title, 1, 200);
};

export const validateCommentBody = (body: unknown): void => {
  validateLength('body', body, 1, 1000);
};

export const validatePassword = (password: unknown): void => {
  validateLength('password', password, 8, Number.POSITIVE_INFINITY);

  if (!/\d/.test(password as string)) {
    fail('password', 'must contain at least one digit');
  }
};
