import crypto from 'crypto'
import https from 'https';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const computeHmacSha512 =(plainText:string, secretKey:string)=> {
    const hmac = crypto.createHmac('sha512', secretKey);
    hmac.update(plainText);
    return hmac.digest('base64');
}

export const app = express();
export const port = process.env.PORT || "4000";

export const options = {
    origin: '*',
}

export class StringBuilder {
  private _lines: string[] = [];

  write(numb:number,line: string = ""): void {
    this._lines.splice(numb, 0, line);
  }

  writeln(line: string = ""): void {
    this._lines.push(line);
    this._lines.push("\n");
  }

  toString(): string {
    return this._lines.join("");
  }
}

export const agentHttps = new https.Agent({ // this block added for the workaround
  rejectUnauthorized: false,
  keepAlive: true
})

export const reqHeaders=(token:string) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const httpsAgentHeaders=(token:string) => {
  return {
    headers: {
        ...reqHeaders(token)
    },
    agent: agentHttps
  }
}

export const hostUrl = `${process.env.MRA_URL}`