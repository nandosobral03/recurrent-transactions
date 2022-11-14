import { Validation } from "../models/validations.model";

export function validateValue(
  value: { min?: number; max?: number },
  field: string,
  data: number
): Validation {
  let message = `${field} must be between ${value.min} and ${value.max}`;
  if (value.min && !value.max) {
    message = `${field} must be at least ${value.min}`;
  }
  return {
    field: field,
    result:
      (!value.min || data >= value.min) && (!value.max || data <= value.max),
    errorMsg: message,
  };
}
