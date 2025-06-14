import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const verifyRestApi = async (req:any, res:any, next:NextFunction) => {
  try {
    let token = req.header("Authorization");
    let apiKey = req.headers['x-api-key']
    if (!token) {
      return res.status(401).json({ 
        success: false,
        remark:"Empty Access token",
        error: {
          authorization: false,
          message: "Authorization failed"
        }
      });
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
      req.accessToken = token;
      //req.secretKey = apiKey;
      next();
    }
  } catch (err:any) {
   return res.status(500).json({ error: err.message });
  }
}