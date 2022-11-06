import { SQS } from "aws-sdk";
import { EntryCreateModel } from "./models/entry.model";
import { EntryMessageModel } from "./models/queue.model";

const RECURRENT_QUEUE_URL = process.env.RECURRENT_QUEUE_URL as string;
const sqs = new SQS();

export const createTransaction = async (entry: EntryCreateModel) => {
    const params = {
        MessageBody: JSON.stringify(entry),
        QueueUrl: RECURRENT_QUEUE_URL,
        DelaySeconds: 0
    };
    try {
        const result = await sqs.sendMessage(params).promise();
        console.log(result);
    }
    catch (err: any) {
        console.log(err);
    }
}




export default {
    createTransaction
}