import { Log } from "../models/log.model"

export const logInformation = async (data: Log) => {
    var actor = ""
    if(data.actor) actor = ` by user ${data.actor}`;
    var family = ""
    if(data.family) family = ` in family ${data.family}`;
    console.log(`[${data.type}] ${data.timestamp} - ${data.message}` + actor + family);
}