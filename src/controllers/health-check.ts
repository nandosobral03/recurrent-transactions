import { Request, Response } from "express";
import { pool } from "../db";
import { logInformation } from "../services/logging";
import { LogType } from "../models/log.model";

export const getHealthCheck = async (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    "database-connection": "OK",
    timestamp: Date.now(),
  };
  try {
    const databaseStatus = await checkDatabase();
    healthcheck["database-connection"] = databaseStatus;

    logInformation({
      message: `Successful system health check performed`,
      type: LogType.INFO,
      timestamp: new Date().toISOString(),
    });
    //

    res.send(healthcheck);
  } catch (e: any) {
    logInformation({
      message: `Error while performing system health check`,
      type: LogType.ERROR,
      timestamp: new Date().toISOString(),
    });
    res.status(503).send(healthcheck);
  }
};

const checkDatabase = async () => {
  try {
    const p = pool;
    const client = await p.connect();
    const migrationCount = await client.query(
      "SELECT EXISTS(SELECT FROM pg_tables WHERE tablename  = 'pgmigrations')"
    );
    if (!migrationCount.rows[0] || !migrationCount.rows[0].exists) {
      return "NO MIGRATIONS";
    }
    client.release();
    return "OK";
  } catch (err) {
    return "FAIL";
  }
};

