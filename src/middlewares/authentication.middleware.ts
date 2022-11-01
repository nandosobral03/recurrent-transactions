import { Request,Response,NextFunction } from "express";
import * as jwt from 'jsonwebtoken';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    const secret = process.env.JWT_SECRET || '';
    if (token) {
        jwt.verify(token, secret, (err:any, decoded:any) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                req.headers.authorization = JSON.stringify(decoded);
                if(decoded.exp * 1000 < Date.now()){
                    res.status(401).send({ message: 'Token has expired' });
                }else{
                    next();
                }
            }
        });
    } else {
        res.status(401).send({ message: 'No token provided' });
    }
}

