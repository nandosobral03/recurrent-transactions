import { Validation } from "../models/validations.model";

export function validatePattern( pattern: RegExp,field:string, data:string): Validation {
    return {
        field: field,
        result: pattern.test(data),
        errorMsg: `Invalid ${field}` 
    }
}

export function validateLength(length:{min?:number, max?:number}, field:string, data:string): Validation {
let message = `${field} must be between ${length.min} and ${length.max} characters`;
if(length.min && !length.max) {
    message = `${field} must be at least ${length.min} characters`;
} else if(!length.min && length.max) {
    message = `${field} must be at most ${length.max} characters`;
}
return {
        field: field,
        result: (!length.min ||data.length >= length.min) && (!length.max || data.length <= length.max),
        errorMsg: message
    }
}

export function validateValue(value:{min?:number, max?:number}, field:string, data:number): Validation {
let message = `${field} must be between ${value.min} and ${value.max}`;
if(value.min && !value.max) {
    message = `${field} must be at least ${value.min}`;
}
else if(!value.min && value.max) {
    message = `${field} must be at most ${value.max}`;
}
return {
    field: field,
    result: (!value.min || data >= value.min) && (!value.max || data <= value.max),
    errorMsg: message
}
}