import { Request,Response,NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { JWTModel } from "../models/user.model";


export const permit = (permittedTypes:string[]) => {
  // return a middleware
  return (req:Request, res:Response, next:NextFunction) => {
    const tokenString = req.headers['authorization'];
    const token = JSON.parse(tokenString!) as JWTModel;
    const type = token.type;
    if (permittedTypes.includes(type)) {
      next();
      return;
    }
    res.status(403).send({ message: 'Forbidden' });
  };
}



