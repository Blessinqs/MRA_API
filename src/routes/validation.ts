import { Router } from 'express';
import { tinValidation } from '../controllers/validationControllers';

const router = Router();

/**
 * 
 * /api/validation/vat5-certificate:
 *   post:
 *     tags: [Validation]
 *     summary: Create or update VAT5 certificate
 *     description: Submit VAT5 certificate details for relief supply
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VAT5CertificateRequest'
 *     responses:
 *       200:
 *         description: Certificate processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 success: true
 *                 message: "Certificate registered successfully"
 *                 data:
 *                   certificateId: "CERT-12345"
 *                   status: "APPROVED"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 error: "ValidationError"
 *                 message: "Invalid request data"
 *                 details:
 *                   - field: "quantity"
 *                     error: "Must be a positive number"
 *       500:
 *         description: Server error
 */

//router.post('/vat5-certificate');

/**
 * @swagger
 * /api/validation/tin:
 *   post:
 *     tags: [Validation ]
 *     summary: Check Tin if is valid
 *     description: Submit tin to check if it is valid
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaxpayerRegistrationRequest'
 *           example:
 *             tin: "20202020"
 *             taxpayerName: "SAMPLE TRADER"
 *             emailAddress: "trial@trial.com"
 *             phoneNumber: "09932728372"
 *     responses:
 *       201:
 *         description: Taxpayer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *             example:
 *               statusCode: 1
 *               remark: "Taxpayer registered successfully"
 *               data:
 *                 taxpayerId: "TAX-20202020"
 *                 registrationDate: "2024-05-21T10:15:30Z"
 *               errors: []
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *             example:
 *               statusCode: 0
 *               remark: "Validation failed"
 *               data: null
 *               errors:
 *                 - errorCode: 400
 *                   fieldName: "emailAddress"
 *                   errorMessage: "Invalid email format"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post('/tin', tinValidation);



export default router;