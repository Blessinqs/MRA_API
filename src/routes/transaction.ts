import { Router } from 'express';
import { createOfflineTransaction, createTransaction, getOfflineTransactions, getTransactions } from '../controllers/transactionControllers';
import { verifyRestApi } from '../middleware/tokenVerifier';

const router = Router();
 /**
 * @swagger
 * /api/transaction:
 *   post:
 *     tags: [Invoices]
 *     summary: Create a new invoice
 *     description: Creates a new invoice with main details and line items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoiceMain, invoiceLineItems]
 *             properties:
 *               invoiceMain:
 *                 type: object
 *                 required: [tac, date, offline, count, paymentMethod]
 *                 properties:
 *                   tac:
 *                     type: string
 *                     example: "WRCN-67VB-PQWS-YC4X"
 *                     pattern: "^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$"
 *                     description: Tax Authentication Code (XXXX-XXXX-XXXX-XXXX format)
 *                   buyerName:
 *                     type: string
 *                     example: ""
 *                     description: Name of the buyer
 *                   date:
 *                     type: string
 *                     example: "12-06-2025"
 *                     pattern: "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-([0-9]{4})$"
 *                     description: Invoice date in DD-MM-YYYY format
 *                   buyerTIN:
 *                     type: string
 *                     example: ""
 *                     description: Buyer's Tax Identification Number
 *                   offline:
 *                     type: boolean
 *                     example: true
 *                     description: Whether the invoice is offline
 *                   count:
 *                     type: string
 *                     example: "4"
 *                     description: Invoice count or number
 *                   paymentMethod:
 *                     type: string
 *                     example: "CASH"
 *                     enum: [CASH, CARD, TRANSFER, OTHER]
 *                     description: Payment method used
 *               invoiceLineItems:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [productCode, description, unitPrice, quantity, total, totalVAT, taxRateId, isProduct]
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                       description: Line item ID
 *                     productCode:
 *                       type: string
 *                       example: "154"
 *                       description: Product or service code
 *                     description:
 *                       type: string
 *                       example: "This was created"
 *                       description: Description of the item
 *                     unitPrice:
 *                       type: number
 *                       format: float
 *                       example: 1
 *                       description: Unit price of the item
 *                     quantity:
 *                       type: number
 *                       format: float
 *                       example: 1
 *                       description: Quantity of the item
 *                     discount:
 *                       type: number
 *                       format: float
 *                       example: 0
 *                       description: Discount applied to the item
 *                     total:
 *                       type: number
 *                       format: float
 *                       example: 3000.00
 *                       description: Total amount for the item
 *                     totalVAT:
 *                       type: number
 *                       format: float
 *                       example: 2444.27
 *                       description: Total VAT amount for the item
 *                     taxRateId:
 *                       type: string
 *                       example: "A"
 *                       description: Tax rate identifier
 *                     isProduct:
 *                       type: boolean
 *                       example: false
 *                       description: Whether the item is a product (false for services)
 *           example:
 *             invoiceMain:
 *               tac: "WRCN-67VB-PQWS-YC4X"
 *               buyerName: ""
 *               date: "12-06-2025"
 *               buyerTIN: ""
 *               offline: true
 *               count: "4"
 *               paymentMethod: "CASH"
 *             invoiceLineItems:
 *               - id: 2
 *                 productCode: "154"
 *                 description: "This was created"
 *                 unitPrice: 1
 *                 quantity: 1
 *                 discount: 0
 *                 total: 3000.00
 *                 totalVAT: 2444.27
 *                 taxRateId: "A"
 *                 isProduct: false
 *     responses:
 *       200:
 *         description: Transaction successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *                properties:
 *                   remark:
 *                     type: string
 *                     example: "Processed Successfully"
 *                     description: Description of the item
 *                   offlineSignature:
 *                     type: string
 *                     example: null
 *                     description: Description of the item
 *                   validationURL:
 *                     type: string
 *                     example: "https://eservices.mra.mw/doc/v/?vc=96251612300229&c=6590539c64da44ed9c1e9d6a4074510b"
 *                     description: url link 
 *             example:
 *               remark: "Processed Successfully"
 *               offlineSignature: null
 *               validationURL: "https://eservices.mra.mw/doc/v/?vc=96251612300229&c=6590539c64da44ed9c1e9d6a4074510b"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */

router.post('/', createTransaction);

/**
 * /api/transaction/offline:
 *   post:
 *     tags: [Invoice]
 *     summary: Create a new invoice offline
 *     description: Submit a complete tax invoice with header, line items, and summary
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceRequest'
 *           example:
 *             count: 1
 *             buyerName: ""
 *             buyerTIN: ""
 *             paymentMethod: ""
 *             invoiceLineItems:
 *               - id: 2
 *                 productCode: "154"
 *                 description: "This was created"
 *                 unitPrice: 1
 *                 quantity: 1
 *                 discount: 0
 *                 total: 3000.00
 *                 totalVAT: 2444.27
 *                 taxRateId: "A"
 *                 isProduct: false
 *     responses:
 *       200:
 *         description: Transaction successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfflineResponse'
 *             example:
 *               remark: "Processed successfully"
 *               validationURL: "https://eservices.mra.mw/doc/v/?vc=96251612300229&c=6590539c64da44ed9c1e9d6a4074510b"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */

//router.post('/offline', createOfflineTransaction);

/**
 *
 * /api/transaction/last-online:
 *   get:
 *     tags: [Invoice]
 *     summary: Create a new invoice online
 *     description: Submit a complete tax invoice with all required details
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceResponse'
 *               example:
 *                 success: true
 *                 remark: "Invoice created successfully"
 *                 data:
 *                   invoiceHeader:
 *                     invoiceNumber: "INV-2025-1001"
 *                     invoiceDateTime: "2025-06-08T20:54:18.886Z"
 *                     sellerTIN: "TIN123456789"
 *                     buyerTIN: "TIN987654321"
 *                     buyerName: "ABC Corporation"
 *                     siteId: "SITE-001"
 *                     globalConfigVersion: 1
 *                     taxpayerConfigVersion: 1
 *                     terminalConfigVersion: 1
 *                     isReliefSupply: false
 *                     paymentMethod: "CARD"
 *                   invoiceLineItems:
 *                     - id: 1
 *                       productCode: "PROD-001"
 *                       description: "Premium Widget X2000"
 *                       unitPrice: 99.99
 *                       quantity: 2
 *                       discount: 10.0
 *                       total: 189.98
 *                       totalVAT: 28.5
 *                       taxRateId: "VAT-STANDARD"
 *                       isProduct: true
 *                   invoiceSummary:
 *                     taxBreakDown:
 *                       - rateId: "VAT-STANDARD"
 *                         taxableAmount: 189.98
 *                         taxAmount: 28.5
 *                     totalVAT: 28.5
 *                     offlineSignature: "SIG-7a8b9c0d1e2f3g4h"
 *                     invoiceTotal: 218.48
 *                   dateSubmitted: "2025-06-08T20:54:18.886Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get('/last-online', verifyRestApi ,getTransactions);

/**
 * 
 * /api/transaction/last-offline:
 *   get:
 *     tags: [Invoice Transactions]
 *     summary: Get invoice offline
 *     description: Submit a complete tax invoice with all required details
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfflineInvoiceResponse'
 *               example:
 *                 success: true
 *                 remark: "Invoice created successfully"
 *                 data:
 *                   invoiceHeader:
 *                     invoiceNumber: "INV-2025-1001"
 *                     invoiceDateTime: "2025-06-08T20:54:18.886Z"
 *                     sellerTIN: "TIN123456789"
 *                     buyerTIN: "TIN987654321"
 *                     buyerName: "ABC Corporation"
 *                     siteId: "SITE-001"
 *                     globalConfigVersion: 1
 *                     taxpayerConfigVersion: 1
 *                     terminalConfigVersion: 1
 *                     isReliefSupply: false
 *                     paymentMethod: "CARD"
 *                   invoiceLineItems:
 *                     - id: 1
 *                       productCode: "PROD-001"
 *                       description: "Premium Widget X2000"
 *                       unitPrice: 99.99
 *                       quantity: 2
 *                       discount: 10.0
 *                       total: 189.98
 *                       totalVAT: 28.5
 *                       taxRateId: "VAT-STANDARD"
 *                       isProduct: true
 *                   invoiceSummary:
 *                     taxBreakDown:
 *                       - rateId: "VAT-STANDARD"
 *                         taxableAmount: 189.98
 *                         taxAmount: 28.5
 *                     totalVAT: 28.5
 *                     offlineSignature: "SIG-7a8b9c0d1e2f3g4h"
 *                     invoiceTotal: 218.48
 *                   dateSubmitted: "2025-06-08T20:54:18.886Z"
 *       400:
 *         description: Bad Server request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get('/last-offline', verifyRestApi,getOfflineTransactions);


export default router;
