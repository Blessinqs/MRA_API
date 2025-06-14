import { Router } from 'express';
import { createTerminal, getBlockedTerminal, getLatestConfigs, getProducts, getProductStatus, getunBlockedMessagesStatus, pingServer, terminalConfirmation } from '../controllers/terminalControllers';
//import { verifyRestApi } from '../middleware/tokenVerifier';

const router = Router();

/**
 * @swagger
 * /api/terminal:
 *   post:
 *     tags: [Terminal]
 *     summary: Activate a new terminal
 *     description: Register and activate a new terminal with activation code and environment details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TerminalRequest'
 *           example:
 *             tac: "4U43-RV5F-5SIJ-9KXQ"
 *             osName: "Microsoft Windows 11 Pro"
 *             osVersion: "10.0.2266"
 *             osBuild: "Multiprocessor Free"
 *             macAddress: "00:15:5d:61:59:38"
 *             productID: "00330-50000-00000-AAOEM"
 *             productVersion: "10.0.2266.5189"
 *     responses:
 *       200:
 *         description: Terminal activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TerminalActivationResponse'
 *             example:
 *               success: true
 *               remark: "Terminal Activated, pending for confirmation request"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */

router.post('/', createTerminal);

//router.get('/latest', verifyRestApi ,getLatestConfigs);

//router.patch('/confirmation/:terminalId', verifyRestApi,terminalConfirmation);

//router.get('/block-status/:terminalId', verifyRestApi ,getBlockedTerminal);

//router.get('/unblock-status/:terminalId', verifyRestApi,getunBlockedMessagesStatus);

//router.get('/products/:tin/:siteId', verifyRestApi,getProducts);

//router.get('/products-status/:tin/:productId', verifyRestApi,getProductStatus);

//router.get('/server-check', verifyRestApi,pingServer);

export default router;
