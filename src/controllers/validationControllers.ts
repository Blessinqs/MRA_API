import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { httpsAgentHeaders, hostUrl} from '../utils/services';
//import { ProjectSchema } from '../components/schemas/Requests/ProjectVatRequest';
import { TinValidationSchema } from '../components/schemas/Requests/TinValidationRequest';

export const tinValidation = async (req: Request, res: Response) => {
    try {
        const { error, value } = TinValidationSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
                res.status(400).json({
                success: false,
                errors: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path
                }))
            });
        }

        const response = await fetch(`${hostUrl}/api/v1/utilities/is-valid-tin`, {
            method: 'POST',
            ...httpsAgentHeaders,
            body: JSON.stringify(value)
        });

        const data = await response.json();

        if(data){
            res.status(200).json({
                ...data,
                message: "Success"
            })
        }
    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
    }
}

