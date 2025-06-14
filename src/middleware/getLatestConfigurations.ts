import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { hostUrl, httpsAgentHeaders } from "../utils/services";
import { ActivatedTaxRate, ClientTaxPayerDetail, OfflineTransactionLimit, Terminal, TerminalGlobalConfigDetail } from '../models/Models';
dotenv.config();

export const getLatestConfigurations = async (res:any, token:string, tac:string) => {
  try {
    const response = await fetch(`${hostUrl}/api/v1/configuration/get-latest-configs`, {
        method: 'POST',
        ...httpsAgentHeaders(token)
    });
    const data = await response.json();

    let teminalDetails:any = await Terminal.findOne({
        where:{
            activation_code: `${tac}`
        }
    });
    
    let gConfig:any = await TerminalGlobalConfigDetail.update({
        version_no: data.configuration.globalConfiguration["versionNo"],
    },{
        where:{
            terminal_activation_code: `${tac}`
        }
    })

    let clientConfig:any = await ClientTaxPayerDetail.findOne({
        where:{
            terminal_activation_code: `${tac}`
        }
    })

    let terminalConfig:any = await OfflineTransactionLimit.update({
       "max_amount": data.configuration.terminalConfiguration.offlineLimit['maxTransactionAgeInHours'],
       "max_age_hrs": data.configuration.terminalConfiguration.offlineLimit['maxCummulativeAmount']
    },{
        where: {
            id: teminalDetails.offline_trans_max_id
        }
    });

    for(const tax of data.configuration.taxpayerConfiguration["activatedTaxRateIds"]){
        if(tax){
            let check = await ActivatedTaxRate.findOne({
                where: {
                    tax_rate_id: tax
                }
            })
            if(!check){
                await ActivatedTaxRate.create({
                    tax_rate_id: tax,
                    is_tax_activated: true,
                    client_tax_payer_id: '',
                    terminal_activation_code: `${tac}`
                })
            }
        }
    }

  } catch (err:any) {
   return res.status(500).json({ error: err.message });
  }
}