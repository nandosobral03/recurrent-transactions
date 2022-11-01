import { Request, Response } from "express"
import moment from "moment";
import { instanceOfHttpError } from "../models/errors.model";
import { instanceOfRecurrentTransaction } from "../models/recurrent.model";
import { JWTModel } from "../models/user.model";
import recurrentService from "../services/recurrent";

export const getRecurrentTransactions = async (req: Request, res: Response) => {
  const { family } = getTokenFromRequest(req);
  const offset = req.query.offset as string;
  const limit = req.query.limit as string;
    try{
        const response = await recurrentService.getRecurrentTransactions(family, offset, limit);
        res.status(200).json(response);
    }
    catch(err){
        if (instanceOfHttpError(err)){
            res.status(err.status).json(err.message);
        }
        else{
            res.status(500).json("Internal Server Error");
        }
    }
}

export const createRecurrentTransaction = async (req: Request, res: Response) => {
    const { family, email } = getTokenFromRequest(req);
    const body = req.body;
    body.user = email;
    if (!moment(req.body.next_date, "MM/DD/YYYY", true).isValid()) {
        res.status(400).send("Invalid date format, format should be MM/DD/YYYY");
        return;
    }
    if(!moment(req.body.next_date, "MM/DD/YYYY", true).isSameOrAfter(moment(), "day")){
        res.status(400).send("Date should be after today");
        return;
    }
    //round date to start of day
    req.body.next_date = moment(req.body.next_date, "MM/DD/YYYY").startOf("day").format("MM/DD/YYYY");

    if(instanceOfRecurrentTransaction(body)){
        try{
            const response = await recurrentService.createRecurrentTransaction(family, body);
            res.status(201).json(response);
        }
        catch(err){
            if (instanceOfHttpError(err)){
                res.status(err.status).json(err.message);
            }
            else{
                res.status(500).json("Internal Server Error");
            }
        }
    }else{
        res.status(400).json("Invalid request body");
    }
    
}

export const updateRecurrentTransaction = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { family, email } = getTokenFromRequest(req);
    const body = req.body;
    body.user = email;
    if (!moment(req.body.next_date, "MM/DD/YYYY", true).isValid()) {
        res.status(400).send("Invalid date format, format should be MM/DD/YYYY");
        return;
    }
    if(!moment(req.body.next_date, "MM/DD/YYYY", true).isSameOrAfter(moment(), "day")){
        res.status(400).send("Date should be after today");
        return;
    }

    req.body.next_date = moment(req.body.next_date, "MM/DD/YYYY").startOf("day").format("MM/DD/YYYY");

    if(instanceOfRecurrentTransaction(body)){
        try{
            const response = await recurrentService.updateRecurrentTransaction(id, family, body);
            res.status(200).json(response);
        }
        catch(err){
            if (instanceOfHttpError(err)){
                res.status(err.status).json(err.message);
            }
            else{
                res.status(500).json("Internal Server Error");
            }
        }
    }else{
        res.status(400).json("Invalid request body");
    }
}

export const deleteRecurrentTransaction = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { family } = getTokenFromRequest(req);
    try{
        const response = await recurrentService.deleteRecurrentTransaction(id, family);
        res.status(200).json(response);
    }
    catch(err){
        if (instanceOfHttpError(err)){
            res.status(err.status).json(err.message);
        }
        else{
            res.status(500).json("Internal Server Error");
        }
    }
}

const getTokenFromRequest = (req: Request) => {
    const tokenString = req.headers["authorization"];
    const token = JSON.parse(tokenString!) as JWTModel;
    return token;
  };
  