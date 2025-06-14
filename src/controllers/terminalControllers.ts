import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { httpsAgentHeaders, computeHmacSha512, hostUrl, reqHeaders, agentHttps } from '../utils/services';
import { TerminalActivationSchema } from '../components/schemas/Requests/TerminalRequest';
import { TerminalConfirmationSchema } from '../components/schemas/Requests/TerminalConfirmRequest';
import { ActivatedTaxRate, ClientTaxPayerDetail, OfflineTransactionLimit, TaxRate, Terminal, TerminalCredential, TerminalGlobalConfigDetail } from '../models/Models';
import { terminalConfirmationHandler } from '../middleware/confirmTerminal';

export const getLatestConfigs = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/configuration/get-latest-configs`, {
            method: 'POST',
            ...httpsAgentHeaders(req.accessToken)
        });
        const data = await response.json();
        if(data.data){
            res.status(200).json({
                success: true,
                "globalConfiguration": {
                    "id": data.configuration.globalConfiguration["id"],
                    "versionNo": data.configuration.globalConfiguration["versionNo"],
                    "taxrates": [
                        ...data.configuration.globalConfiguration["taxrates"]
                    ]
                },
                "terminalConfiguration": {
                    "versionNo": data.configuration.terminalConfiguration['versionNo'],
                    "isActiveTerminal": data.configuration.terminalConfiguration['isActiveTerminal'],
                    "siteId": data.configuration.terminalConfiguration.terminalSite['siteId'],
                    "offlineMaxAgeHrs": data.configuration.terminalConfiguration.offlineLimit['maxTransactionAgeInHours'],
                    "offlineMaxCummulativeAmount": data.configuration.terminalConfiguration.offlineLimit['maxCummulativeAmount']
                },
                "taxpayerConfiguration": {
                    "versionNo": data.configuration.taxpayerConfiguration['versionNo'],
                    "tin": data.configuration.taxpayerConfiguration['tin'],
                    "isVATRegistered": data.configuration.taxpayerConfiguration['isVATRegistered'],
                    "activatedTaxRateIds": data.configuration.taxpayerConfiguration["activatedTaxRateIds"],
                    "activatedTaxrates": data.configuration.taxpayerConfiguration["activatedTaxrates"]
                }
            });
        }else{
            res.status(400).json({
                success: false,
                ...data
            });
        }

    } catch (error:any) {
        res.status(500).json({
            error: error
        });
    }
}

export const getBlockedTerminal = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/utilities/get-terminal-blocking-message`, {
            method: 'POST',
            body: JSON.stringify({
                terminalId: `${req.params.terminalId}`,
            }),
            ...httpsAgentHeaders(req.accessToken)
        });
        const data = await response.json();
       
       if(data.data){
        res.status(200).json({
            ...data,
            success: true
        });
       }else{
        res.status(400).json({
            ...data,
            success: false
        });
       }
    } catch (error:any) {
        res.status(500).json({
            error: error
        });
    }
}

export const getProducts = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/utilities/get-terminal-site-products`, {
            method: 'POST',
            body: JSON.stringify({
                tin: `${req.params.tin}`,
                siteId: `${req.params.siteId}`
            }),
            ...httpsAgentHeaders(req.accessToken)
        });
        
        const data = await response.json();
       
        res.status(200).json({
            ...data,
            success: true
        });

    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const createTerminal = async (req: any, res: Response) => {
    try {
        const { error, value } = TerminalActivationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(403).json({
                success: false,
                errors: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path
                }))
            });
        }

        const response = await fetch(`${hostUrl}/api/v1/onboarding/activate-terminal`, {
            method: 'POST',
            ...httpsAgentHeaders("HashToken"),
            body: JSON.stringify({
                terminalActivationCode: `${value.tac}`,
                environment: {
                    platform: {
                        "osName": `${value.osName}`,
                        "osVersion": `${value.osVersion}`,
                        "osBuild": `${value.osBuild}`,
                        "macAddress": `${value.macAddress}`
                    },
                    pos: {
                        "productID": `${value.productID}`,
                        "productVersion": `${value.productVersion}`
                    }
                }
            }),
        });
        const dataResponse = await response.json();
        
        if(dataResponse.data){
            const { data } = dataResponse;
            let offlineMax:any = await OfflineTransactionLimit.create({
                max_amount: `${dataResponse.data.configuration.terminalConfiguration.offlineLimit["maxTransactionAgeInHours"]}`,
                max_age_hrs: `${dataResponse.data.configuration.terminalConfiguration.offlineLimit["maxCummulativeAmount"]}`
            })
            if(offlineMax){
                   
                await Terminal.create({
                    id: `${data.activatedTerminal.terminalId}`,
                    activation_code: `${value.tac}`,
                    position: data.activatedTerminal.terminalPosition,
                    os_version: value.osVersion,
                    os_name: value.osName,
                    os_build: value.osBuild,
                    product_version: value.productVersion,
                    product_id: value.productID,
                    version_no: data.configuration.terminalConfiguration.versionNo,
                    terminal_label: data.configuration.terminalConfiguration.terminalLabel,
                    site_id: data.configuration.terminalConfiguration.terminalSite.siteId,
                    is_activated: data.configuration.terminalConfiguration.isActiveTerminal,
                    trading_name: data.configuration.terminalConfiguration.tradingName,
                    email_address: data.configuration.terminalConfiguration.emailAddress,
                    phone_no: data.configuration.terminalConfiguration.phoneNumber,
                    is_blocked: false,
                    activated_at: new Date(`${data.activatedTerminal.activationDate}`),
                    offline_trans_max_id: offlineMax.id
                });

                let globalConfig:any = await TerminalGlobalConfigDetail.create({
                    id: data.configuration.globalConfiguration["id"],
                    version_no: data.configuration.globalConfiguration["versionNo"],
                    terminal_activation_code: `${value.tac}` 
                })

                for(let rate of data.configuration.globalConfiguration["taxrates"]){
                    await TaxRate.create({
                        id: rate.id,
                        name: rate.name,
                        charge_mode: rate.chargeMode,
                        rate: `${rate.rate}`,
                        terminal_global_config_id: globalConfig.id,
                        terminal_activation_code: `${value.tac}` 
                    })
                }

                let terminalCredentials:any = await TerminalCredential.create({
                    access_token: data.activatedTerminal.terminalCredentials["jwtToken"],
                    secret_key: data.activatedTerminal.terminalCredentials["secretKey"],
                    terminal_activation_code: `${value.tac}`
                })

                let clientConfig:any = await ClientTaxPayerDetail.create({
                    code: data.activatedTerminal.taxpayerId,
                    tax_office_code: data.configuration.taxpayerConfiguration["taxOfficeCode"],
                    version_no: data.configuration.taxpayerConfiguration["versionNo"],
                    is_vat_registered: data.configuration.taxpayerConfiguration["isVATRegistered"],
                    tin: data.configuration.taxpayerConfiguration["tin"],
                    terminal_activation_code: `${value.tac}`
                })

                for (let active of data.configuration.taxpayerConfiguration.activatedTaxRateIds){
                    await ActivatedTaxRate.create({
                        tax_rate_id: active,
                        is_tax_activated: true,
                        client_tax_payer_id: clientConfig.id,
                        terminal_activation_code: `${value.tac}`
                    })
                }
                let confirm:any = await terminalConfirmationHandler(res, terminalCredentials.access_token,value.tac,data.activatedTerminal.terminalCredentials["secretKey"],data.activatedTerminal.terminalId)
                console.log(confirm)
                if(confirm){
                    res.status(200).json({
                        success: true,
                        remark: "Terminal Activated Successfully",
                    })
                }
            }
        }else{
            res.status(400).json({
                success: false,
                remark: "Terminal Activation Failed"
            });
        }
    } catch (error:any) {
        res.status(500).json({
            error: error
        });
    }
}

export const terminalConfirmation = async (req: any, res: Response) => {
    try {
        const { error, value } = TerminalConfirmationSchema.validate(req.body, { abortEarly: false });
                
        if (error) {
            res.status(403).json({
                success: false,
                errors: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path
                }))
            });
        }
       const computedHash = computeHmacSha512(`${value.tac}`,`${value.secret}`);
       if(computedHash){
            const response = await fetch(`${hostUrl}/api/v1/onboarding/terminal-activated-confirmation`, {
                method: 'POST',
                body: JSON.stringify({
                    terminalId: `${req.params.terminalId}`
                }),
                headers:{...reqHeaders(req.accessToken), 'x-signature': `${computedHash}`},
                agent: agentHttps
            })
            const data = await response.json();
            if(data.data){
                res.status(200).json({
                    statusCode: data.statusCode,
                    remark: 'Terminal fully activated and ready for use!',
                    data: true,
                    success: true
                })
            }else{
                res.status(400).json({
                    ...data,
                    success: false
                })
            }
       }else{
            res.status(400).json({
                success: false,
                errors: [{
                    message: "HMAC Hash Computation Failed",
                    path: "Hash Error"
                }]
            });
       }

    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const getBlockMessagesStatus = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/utilities/product-status`, {
            method: 'POST',
            body: JSON.stringify({
                tin: `${req.params.tin}`,
                productId: `${req.params.productId}`
            }),
            ...httpsAgentHeaders(req.accessToken)
        });
        
        const data = await response.json();
        if(data.data){
            res.status(200).json({
                ...data,
                success: true
            });
        }else{
            res.status(400).json({
                    ...data,
                    success: false
            });
        }
        
    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const getunBlockedMessagesStatus = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/utilities/get-terminal-blocking-message`, {
            method: 'POST',
            body: JSON.stringify({
                terminalId: `${req.params.terminalId}`
            }),
            ...httpsAgentHeaders(req.accessToken)
        });
        
        const data = await response.json();
        if(data.data){
            res.status(200).json({
                ...data,
                success: true
            });
        }else{
            res.status(400).json({
                ...data,
                success: false
            });
        }

    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const getProductStatus = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/utilities/product-status`, {
            method: 'POST',
            body: JSON.stringify({
                tin: `${req.params.tin}`,
                productId: `${req.params.productId}`
            }),
            ...httpsAgentHeaders(req.accessToken)
        });
        
        const data = await response.json();
        if(data.data){
            res.status(200).json({
                ...data,
                success: true
            });
        }else{
            res.status(400).json({
                ...data,
                success: false
            });
        }

    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const pingServer = async (req: any, res: Response) => {
    try {
        const response = await fetch(`${hostUrl}/api/v1/utilities/ping`, {
            method: 'POST',
            ...httpsAgentHeaders(req.accessToken)
        });
        
        const data = await response.json();
        if(data.data){
            res.status(200).json({
                success: true,
                statusCode: 1,
                remark: "Ping Successful",
                data:{
                    responded: true,
                    responseAt: data.data.serverDate,
                },
            });
        }else{
            res.status(400).json({
                ...data,
                success: false
            });
        }
    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}
