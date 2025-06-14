import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { agentHttps, computeHmacSha512, hostUrl, httpsAgentHeaders, reqHeaders } from "../utils/services";
dotenv.config();
import fetch from 'node-fetch';
import { Terminal } from '../models/Models';
export const terminalConfirmationHandler = async (res:any, token:string, tac:string, secret:string,terminalId:string) => {
  try {
    const computedHash = computeHmacSha512(`${tac}`,`${secret}`);
    
    if(computedHash){
        const responseConfirm = await fetch(`${hostUrl}/api/v1/onboarding/terminal-activated-confirmation`, {
            method: 'POST',
            body: JSON.stringify({
                terminalId: `${terminalId}`
            }),
            headers:{...reqHeaders(token), 'x-signature': `${computedHash}`},
            agent: agentHttps
        })
        const dataConfirm = await responseConfirm.json();
        ///console.log(dataConfirm)
        if(dataConfirm.data){
            const updateTerminal = await Terminal.update({
                is_activated: true
            },{
                where:{
                    activation_code: `${tac}`
                }
            })
            if(updateTerminal){
                return dataConfirm.data
            }
        }else{
            res.status(400).json({
                success: false,
                remark: dataConfirm.remark
            })
        }
    }
  } catch (err:any) {
     res.status(500).json({ error: err.message });
  }
}