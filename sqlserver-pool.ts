// sqlserver-pool.ts
import config from './config.js';
import { execFile } from 'node:child_process';

interface SQLServerResult {
  [key: string]: any;
}

const sqlConfig = config.database?.sqlserver;

if (!sqlConfig) throw new Error("sqlserver config tidak ditemukan di env.yaml");

const maxBuffer: number = (sqlConfig?.maxbuffer ?? 10) * 1024 * 1024; // MB -> byte

export class SQL2000Pool {
  private pythonPath: string;
  private bridgePath: string;

  constructor(pythonPath: string = "python", bridgePath: string = "sqlserver.py") {
    this.pythonPath = pythonPath;
    this.bridgePath = bridgePath;
  }

  query(sqlQuery: string): Promise<SQLServerResult[]> {
    return new Promise((resolve, reject) => {
      execFile(
        this.pythonPath,
        [this.bridgePath, sqlQuery],
        { maxBuffer },
        (error, stdout, stderr) => {
          if (error) return reject(error);
          if (stderr) return reject(new Error(stderr));

          try {
            const data = JSON.parse(stdout);
            if (data.error) return reject(new Error(data.error));
            resolve(data.result as SQLServerResult[]);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }
}

export const sql2000Pool = new SQL2000Pool();
