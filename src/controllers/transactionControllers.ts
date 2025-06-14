import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { computeHmacSha512, hostUrl, httpsAgentHeaders } from '../utils/services';
import { generateInvoiceNumber } from '../utils/generator';
import { SaleInvoiceSchema } from '../components/schemas/Requests/SaleRequest';
import { v4 as uuidv4 } from 'uuid';
import { ClientTaxPayerDetail, OfflineTransactionLimit, Terminal, TerminalCredential, TerminalGlobalConfigDetail } from '../models/Models';
import { blockingMessage } from '../middleware/blockingStatus';
import { getLatestConfigurations } from '../middleware/getLatestConfigurations';

export const createTransaction = async (req:any, res:any) => {
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
        const today:Date = new Date(`${value.invoiceMain.date}`);
        let totalVatAmount:string = "0.00";
        let invoiceTotalAmount:string = "0.00";
        const clientConfig:any = await ClientTaxPayerDetail.findOne({
            where:{
                terminal_activation_code: value.invoiceMain.tac
            }
        })

        const gConfig:any = await TerminalGlobalConfigDetail.findOne({
            where:{
                terminal_activation_code: value.invoiceMain.tac
            }
        })
        const terminalConfig:any = await Terminal.findOne({
            where: {
                activation_code: value.invoiceMain.tac
            },
            include:{
                model: OfflineTransactionLimit
            }
        })

        const credentials:any = await TerminalCredential.findOne({
            where:{
                terminal_activation_code: value.invoiceMain.tac
            }
        })
        
        const taxBreakDownList:any = [];
        for(const tax of value.invoiceLineItems){
            taxBreakDownList.push({
                "rateId": tax.taxRateId,
                "taxableAmount": tax.total,
                "taxAmount": tax.totalVAT
            })
        }

        for(let item of value.invoiceLineItems){
            invoiceTotalAmount = parseFloat(invoiceTotalAmount) + item.total;
        }
        
        for(let vat of taxBreakDownList){
            totalVatAmount = parseFloat(totalVatAmount) + vat.taxAmount;
        }
        let invoiceNum = `${generateInvoiceNumber(clientConfig.code,terminalConfig.position,today,value.invoiceMain.count)}`;
        let hmacOffline:string = '';
        if(value.invoiceMain.offline){
            hmacOffline = computeHmacSha512(`${invoiceNum}${value.invoiceMain.count}${today}`, `${credentials.secret_key}`);
        }
        const body = {
            "invoiceHeader": {
                "invoiceNumber": invoiceNum,
                "invoiceDateTime": today,                                                                                                                                                                                                                                  
                "sellerTIN": `${clientConfig.tin}`,
                "buyerTIN": value.invoiceMain.buyerTIN ? `${value.invoiceMain.buyerTIN}` : "",
                "buyerName": value.invoiceMain.buyerName ? `${value.invoiceMain.buyerName}` : "",
                "buyerAuthorizationCode": "",
                "siteId": `${terminalConfig.site_id}`,
                "globalConfigVersion": gConfig.version_no,
                "taxpayerConfigVersion": clientConfig.version_no,
                "terminalConfigVersion": terminalConfig.version_no,
                "isReliefSupply": false,
                "vat5CertificateDetails": {
                    "id": 0,
                    "projectNumber":  "",
                    "certificateNumber": "",
                    "quantity": 0
                },
                "paymentMethod": value.invoiceMain.paymentMethod ? `${value.invoiceMain.paymentMethod}` : ""
            },
            "invoiceLineItems": [
                ...value.invoiceLineItems
            ],
            "invoiceSummary": {
                "taxBreakDown": [
                    ...taxBreakDownList
                ],
                "totalVAT": totalVatAmount,
                "offlineSignature": value.invoiceMain.offline ? `${hmacOffline}` : null,
                "invoiceTotal": invoiceTotalAmount
            }
        }
        const response = await fetch(`${hostUrl}/api/v1/sales/submit-sales-transaction`, {
            method: 'POST',
            ...httpsAgentHeaders(credentials.access_token),
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if(data.data){
            if(data.data["shouldBlockTerminal"]){
                let bloked = await blockingMessage(res,credentials.access_token)
                if(bloked){
                return res.status(403).json({
                        success: false,
                        remark: bloked.remark,
                        blockMessage: bloked.data.blockingReason
                    });
                }
            }
            if(data.data["shouldDownloadLatestConfig"]){
                if(data.data){
                    res.status(200).json({
                        validationUrl: data.data.validationURL,
                        offlineSignature:  value.invoiceMain.offline ? `${hmacOffline}` : null,
                        success: true
                    })
                }else{
                    res.status(400).json({
                        success: false,
                        ...data
                    });
                }
            }
            }else{
                res.status(400).json({
                    success: false,
                    remark: data.remark
                });
            }
    } catch (error:any) {
        res.status(500).json({
            error: error
        })
    }
}

export const createOfflineTransaction = async (req: any, res: Response) => {
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
        const today = new Date(`${value.invoiceMain.date}`);
        let totalVatAmount:string = "0.00";
        let invoiceTotalAmount:string = "0.00";
        for(let item of value.invoiceLineItems){
            invoiceTotalAmount = parseFloat(invoiceTotalAmount) + item.total;
        }
        for(let vat of value.invoiceSummary.taxBreakDown){
            totalVatAmount = parseFloat(totalVatAmount) + vat.taxAmount;
        }
        const invoiceNum =  `${generateInvoiceNumber(value.invoiceMainHeader.taxpayerId,value.invoiceMainHeader.position,today,value.invoiceMainHeader.count)}`;
        let hmacOffline = computeHmacSha512(`${invoiceNum}${value.invoiceMainHeader.count}${today}`, `${value.invoiceMainHeader.secret}`);

        const body = {
            "invoiceHeader": {
                "invoiceNumber": invoiceNum,
                "invoiceDateTime": today,                                                                                                                                                                                                                                  
                "sellerTIN": `${value.invoiceMainHeader.sellerTIN}`,
                "buyerTIN": value.invoiceMainHeader.buyerTIN ? `${value.invoiceMainHeader.buyerTIN}` : "",
                "buyerName": value.invoiceMainHeader.buyerName ? `${value.invoiceMainHeader.buyerName}` : "",
                "buyerAuthorizationCode": value.invoiceMainHeader.buyerAuthorizationCode ? `${value.invoiceMainHeader.buyerAuthorizationCode}` : "",
                "siteId": `${value.invoiceMainHeader.siteId}`,
                "globalConfigVersion": value.globalConfigVersion,
                "taxpayerConfigVersion": value.taxpayerConfigVersion,
                "terminalConfigVersion": value.terminalConfigVersion,
                "isReliefSupply": value.invoiceMainHeader.isReliefSupply,
                "vat5CertificateDetails": {
                     "id": !value.invoiceMainHeader.vat5CertificateDetails || value.invoiceMainHeader.vat5CertificateDetails.id ?  value.invoiceMainHeader.vat5CertificateDetails.id : 0,
                     "projectNumber": !value.invoiceMainHeader.vat5CertificateDetails || value.invoiceMainHeader.vat5CertificateDetails.projectNumber ? `${value.invoiceMainHeader.vat5CertificateDetails.projectNumber}` : "",
                     "certificateNumber": !value.invoiceMainHeader.vat5CertificateDetails || value.invoiceMainHeader.vat5CertificateDetails.certificateNumber ? `${value.invoiceMainHeader.vat5CertificateDetails.certificateNumber}` : "",
                     "quantity": !value.invoiceMainHeader.vat5CertificateDetails || value.invoiceMainHeader.vat5CertificateDetails.quantity ? value.invoiceMainHeader.vat5CertificateDetails.quantity : 0
                },
                "paymentMethod": value.invoiceMainHeader.paymentMethod ? `${value.invoiceMainHeader.paymentMethod}` : ""
            },
            "invoiceLineItems": [
                ...value.invoiceLineItems
            ],
            "invoiceSummary": {
                "taxBreakDown": [
                    ...value.invoiceSummary["taxBreakDown"]
                ],
                "totalVAT": totalVatAmount,
                "invoiceTotal": invoiceTotalAmount,
                "offlineSignature": `${hmacOffline}`
            }
        }

        const response = await fetch(`${hostUrl}/api/v1/sales/submit-sales-transaction`, {
            method: 'POST',
            ...httpsAgentHeaders(req.accessToken),
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        if(data.data){
            res.status(200).json({
                success: true,
                remark: data.remark,
                validationUrl: data.data.validationURL,
                availableLatestConfig: data.data["shouldDownloadLatestConfig"],
                shouldBlockTerminal: data.data["shouldBlockTerminal"],
                signature: `${hmacOffline}`
            })
        }else{
            res.status(400).json({
                success: false,
                ...data
            });
        }

    } catch (error:any) {
        res.status(500).json({
            error: error
        })
    }
}

export const getTransactions = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/sales/last-submitted-online-transaction`, {
            method: 'POST',
            ...httpsAgentHeaders(req.accessToken)
        });
        const data = await response.json();

        if(data.data){
            res.status(200).json({
                success: true,
                remark: data.remark,
                "data":{
                    ...data.data
                }
            })
        }else{
            res.status(400).json({
                success: false,
                ...data
            });
        }

    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}


export const getOfflineTransactions = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/sales/last-submitted-offline-transaction`, {
            method: 'POST',
            ...httpsAgentHeaders(req.accessToken)
        });

        const data = await response.json();
        if(data.data){
            res.status(200).json({
                success: true,
                remark: data.remark,
                "data":{
                    ...data.data
                }
            })
        }else{
             res.status(400).json({
                success: false,
                ...data
            });
        }
    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}

