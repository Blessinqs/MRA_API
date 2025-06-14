import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { hostUrl, httpsAgentHeaders } from "../utils/services";
dotenv.config();

export const blockingMessage = async (res:any, token:string) => {
  try {
    const response = await fetch(`${hostUrl}/api/v1/utilities/ping`, {
        method: 'POST',
        ...httpsAgentHeaders(token)
    });
    const data = await response.json();

    if(data.data){
        return data;
    }else{
        return res.status(400).json({
            success: false,
            ...data
        })
    }

  } catch (err:any) {
   return res.status(500).json({ error: err.message });
  }
}