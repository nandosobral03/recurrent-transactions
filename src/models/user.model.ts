export interface JWTModel{
    email: string;
    name: string;
    family: string;
    type: "ADMIN" | "USER";
}