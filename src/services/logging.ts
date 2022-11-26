import { Log } from "../models/log.model"
import rTracer from "cls-rtracer"
export const logInformation = async (data: Log) => {
    let actor = ""
    if(data.actor) actor = ` by user ${data.actor}`;
    let family = ""
    if(data.family) family = ` in family ${data.family}`;

    let trace = rTracer.id() as string ? `[trace: ${rTracer.id() as string}]` : "";
    console.log(`[${data.type}] ${trace} ${data.timestamp} - ${data.message}` + actor + family);
}