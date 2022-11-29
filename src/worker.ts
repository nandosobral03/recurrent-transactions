import { SQS } from "aws-sdk";
import { CategoryMessageModel, isInstanceOfCategoryMessageModel } from "./models/queue.model";
import categoryRepository from "./repositories/category.repositories";
import nodeCron from "node-cron";
import recurrentRepository from "./repositories/recurrent.repository";

export const initializeQueue = async () => {
    const sqs = new SQS(
        {
          region: process.env.AWS_REGION as string,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          sessionToken: process.env.AWS_SESSION_TOKEN as string
        }
      );
    const QUEUE_URL = process.env.CATEGORY_QUEUE_URL as string;
    while(true){
        const result = await sqs.receiveMessage({
            QueueUrl: QUEUE_URL,
            WaitTimeSeconds: 20,
            MaxNumberOfMessages: 10,
        }).promise();
        if (result.Messages) {
            for (const message of result.Messages) {
                try{
                    const body = JSON.parse(message.Body as string);
                    console.log(body)
                    if(isInstanceOfCategoryMessageModel(body)){
                        await parseMessage(body);
                        const deleteParams = {
                            QueueUrl: QUEUE_URL,
                            ReceiptHandle: message.ReceiptHandle as string
                        };
                        await sqs.deleteMessage(deleteParams).promise();
                    }
                }
                catch(err){
                    console.log("Error parsing message", err);
                }
            }
        }
    }
}


export const initializeCorrutine = async () => {
    nodeCron.schedule("*/1 * * * *", async () => {
        await sendDailyTransactions();
        console.log("Sent daily transactions");
    });
}

const parseMessage = async (message: CategoryMessageModel) => {
    switch(message.action){
        case "CREATE":
            await categoryRepository.createCategory(message.id, message.family);
            break;
        case "DELETE":
            await categoryRepository.deleteCategory(message.id, message.family);
            break;
        default:
            break;
    }
}

const sendDailyTransactions = async () => {
    await recurrentRepository.sendDailyTransactions();
}