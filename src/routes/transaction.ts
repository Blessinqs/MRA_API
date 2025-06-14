import { Router } from 'express';
import { createOfflineTransaction, createTransaction, getOfflineTransactions, getTransactions } from '../controllers/transactionControllers';
import { verifyRestApi } from '../middleware/tokenVerifier';

const router = Router();

/**
 * @swagger
 * /api/transaction:
 *   post:
 *     tags: [Invoice]
 *     summary: Create a new invoice online
 *     description: Submit a complete tax invoice with header, line items, and summary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceRequest'
 *           example:
 *             buyerName: ""
 *             buyerTIN: ""
 *             count: 1
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
 *               $ref: '#/components/schemas/InvoiceResponse'
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
 * @swagger
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

router.post('/offline', createOfflineTransaction);

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