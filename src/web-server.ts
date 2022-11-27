import * as dotenv from 'dotenv';
import express from 'express';
import recurrent_routes from './routes/recurrent.routes';
import * as authentication from './middlewares/authentication.middleware';
import * as authorization from './middlewares/authorization.middleware';
import rTracer from 'cls-rtracer';

import cors from 'cors';

import { createHttpTerminator} from 'http-terminator';
import http from 'http';
import { getHealthCheck } from './controllers/health-check';

const initialize = async () => {
    dotenv.config();
    const app = express();
    const port = process.env.PORT;
    app.use(rTracer.expressMiddleware({
      useHeader: true,
      headerName: 'X-Trace-Id',
      echoHeader: true,
    }))
    app.use(cors())
    app.use(express.json())
    app.use('/recurrent', authentication.verifyJWT);
    app.use('/recurrent', authorization.permit(['ADMIN']));
    app.use("/recurrent",  recurrent_routes);
    app.get('/health', getHealthCheck);

    const server = http.createServer(app);
    const httpTerminator = createHttpTerminator({ server, gracefulTerminationTimeout: 1000 });

    process.on('SIGINT', async () => {
      console.info('SIGINT signal received.');
      console.log('Closing http server.');
      await httpTerminator.terminate();
    }
    );
    
    process.on('SIGTERM', async () => {
      console.info('SIGTERM signal received.');
      console.log('Closing http server.');
      await httpTerminator.terminate();
    });

    server.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });

   
};



module.exports = { initialize };
