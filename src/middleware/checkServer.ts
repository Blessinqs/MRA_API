import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { hostUrl, httpsAgentHeaders } from "../utils/services";
import { Terminal, TerminalCredential } from "../models/Models";
import { SaleInvoiceSchema } from "../components/schemas/Requests/SaleRequest";
dotenv.config();

export const serverChecker = async (req:any, res:any, next:NextFunction) => {
  try {
    const { error, value } = SaleInvoiceSchema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(403).json({
            success: false,
            errors: error.details.map(detail => ({
                message: detail.message,
                path: detail.path
            }))
        });
    }
    let terminalData:any = await TerminalCredential.findOne({
        where: {
            terminal_activation_code: value.invoiceMain.tac
        }
    })

    if (terminalData) {
        const response = await fetch(`${hostUrl}/api/v1/utilities/ping`, {
            method: 'POST',
            ...httpsAgentHeaders(terminalData.access_token)
        });
        next();
    }
  } catch (err:any) {
   return res.status(500).json({ error: err.message });
  }
}