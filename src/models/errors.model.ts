export interface httpError {
    status: number;
    message: string;
}

export function instanceOfHttpError(object: any): object is httpError {
    return 'status' in object && 'message' in object;
}
