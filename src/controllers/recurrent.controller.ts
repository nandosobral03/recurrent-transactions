import { Request, Response } from "express"
import moment from "moment";
import { instanceOfHttpError } from "../models/errors.model";
import { LogType } from "../models/log.model";
import { instanceOfRecurrentTransaction } from "../models/recurrent.model";
import { JWTModel } from "../models/user.model";
import { logInformation } from "../services/logging";
import recurrentService from "../services/recurrent";

export const getRecurrentTransactions = async (req: Request, res: Response) => {
  const { family, email } = getTokenFromRequest(req);
  const offset = req.query.offset as string;
  const limit = req.query.limit as string;
    try{
        const response = await recurrentService.getRecurrentTransactions(family, offset, limit);
        logInformation({
            message: `Successful retrieval of recurrent transactions`,
            type: LogType.INFO,
            timestamp: new Date().toISOString(),
            actor: email,
            family: family,
          });
        res.status(200).send(response);
    }
    catch(err){
        if (instanceOfHttpError(err)){
            logInformation({
                message: `Invalid recurrent transactions retrieval attempt`,
                type: LogType.ERROR,
                timestamp: new Date().toISOString(),
                actor: email,
                family: family,
              });
            res.status(err.status).send({message: err.message});
        }
        else{
            logInformation({
                message: `Error retrieving recurrent transactions`,
                type: LogType.ERROR,
                timestamp: new Date().toISOString(),
                actor: email,
                family: family,
              });
            res.status(500).send({message: "Internal server error"});
        }
    }
}

export const createRecurrentTransaction = async (req: Request, res: Response) => {
    const { family, email } = getTokenFromRequest(req);
    const body = req.body;
    body.user = email;
    if (!moment(req.body.next_date, "MM/DD/YYYY", true).isValid()) {
        res.status(400).send({message:"Invalid date format, format should be MM/DD/YYYY"});
        return;
    }
    if(!moment(req.body.next_date, "MM/DD/YYYY", true).isSameOrAfter(moment(), "day")){
        res.status(400).send({message:"Invalid date, date should be in the future"});
        return;
    }
    //round date to start of day
    req.body.next_date = moment(req.body.next_date, "MM/DD/YYYY").startOf("day").format("MM/DD/YYYY");

    if(instanceOfRecurrentTransaction(body)){
        try{
            const response = await recurrentService.createRecurrentTransaction(family, body);
            logInformation({
                message: `Successful creation of recurrent transaction`,
                type: LogType.INFO,
                timestamp: new Date().toISOString(),
                actor: email,
                family: family,
              });
            res.status(201).send(response);
        }
        catch(err){
            if (instanceOfHttpError(err)){
                logInformation({
                    message: `Invalid recurrent transaction creation attempt`,
                    type: LogType.ERROR,
                    timestamp: new Date().toISOString(),
                    actor: email,
                    family: family,
                  });
                res.status(err.status).send({message: err.message});
            }
            else{
                logInformation({
                    message: `Error creation recurrent transaction`,
                    type: LogType.ERROR,
                    timestamp: new Date().toISOString(),
                    actor: email,
                    family: family,
                  });
                res.status(500).send({message: "Internal server error"});
            }
        }
    }else{
        res.status(400).send({message: "Invalid request body"});
    }
    
}

export const updateRecurrentTransaction = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { family, email } = getTokenFromRequest(req);
    const body = req.body;
    body.user = email;
    if (!moment(req.body.next_date, "MM/DD/YYYY", true).isValid()) {
        res.status(400).send({message:"Invalid date format, format should be MM/DD/YYYY"});
        return;
    }
    if(!moment(req.body.next_date, "MM/DD/YYYY", true).isSameOrAfter(moment(), "day")){
        res.status(400).send({message: "Invalid date, date should be in the future"});
        return;
    }

    req.body.next_date = moment(req.body.next_date, "MM/DD/YYYY").startOf("day").format("MM/DD/YYYY");

    if(instanceOfRecurrentTransaction(body)){
        try{
            const response = await recurrentService.updateRecurrentTransaction(id, family, body);
            logInformation({
                message: `Successful update of recurrent transaction`,
                type: LogType.INFO,
                timestamp: new Date().toISOString(),
                actor: email,
                family: family,
              });
            res.status(200).send(response);
        }
        catch(err){
            if (instanceOfHttpError(err)){
                logInformation({
                    message: `Invalid recurrent transaction update attempt`,
                    type: LogType.ERROR,
                    timestamp: new Date().toISOString(),
                    actor: email,
                    family: family,
                  });
                res.status(err.status).send({message:err.message});
            }
            else{
                logInformation({
                    message: `Error updating recurrent transaction`,
                    type: LogType.ERROR,
                    timestamp: new Date().toISOString(),
                    actor: email,
                    family: family,
                  });
                res.status(500).send({message: "Internal server error"});
            }
        }
    }else{
        res.status(400).send({message: "Invalid request body"});
    }
}

export const deleteRecurrentTransaction = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { family, email } = getTokenFromRequest(req);
    try{
        const response = await recurrentService.deleteRecurrentTransaction(id, family);
        logInformation({
            message: `Successful deletion of recurrent transactions`,
            type: LogType.INFO,
            timestamp: new Date().toISOString(),
            actor: email,
            family: family,
          });
        res.status(200).send(response);
    }
    catch(err){
        if (instanceOfHttpError(err)){
            logInformation({
                message: `Invalid recurrent transaction deletion attempt`,
                type: LogType.ERROR,
                timestamp: new Date().toISOString(),
                actor: email,
                family: family,
              });
            res.status(err.status).send({message: err.message});
        }
        else{
            logInformation({
                message: `Error deleting recurrent transaction`,
                type: LogType.ERROR,
                timestamp: new Date().toISOString(),
                actor: email,
                family: family,
              });
            res.status(500).send({message: "Internal server error"});
        }
    }
}

const getTokenFromRequest = (req: Request) => {
    const tokenString = req.headers["authorization"];
    const token = JSON.parse(tokenString!) as JWTModel;
    return token;
  };
  