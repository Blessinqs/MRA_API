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
 *             type: object
 *             required: [tac, osName, osVersion, macAddress]
 *             properties:
 *               tac:
 *                 type: string
 *                 example: "4U43-RV5F-5SIJ-9KXQ"
 *                 pattern: "^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$"
 *                 description: Terminal Activation Code (XXXX-XXXX-XXXX-XXXX format)
 *               osName:
 *                 type: string
 *                 example: "Microsoft Windows 11 Pro"
 *                 description: Operating system name
 *               osVersion:
 *                 type: string
 *                 example: "10.0.2266"
 *                 description: OS version number
 *               osBuild:
 *                 type: string
 *                 example: "Multiprocessor Free"
 *                 nullable: true
 *                 description: OS build information
 *               macAddress:
 *                 type: string
 *                 example: "00:15:5d:61:59:38"
 *                 pattern: "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
 *                 description: Device MAC address (XX:XX:XX:XX:XX:XX format)
 *               productID:
 *                 type: string
 *                 example: "00330-50000-00000-AAOEM"
 *                 nullable: true
 *                 description: System product ID
 *               productVersion:
 *                 type: string
 *                 example: "10.0.2266.5189"
 *                 nullable: true
 *                 description: System product version
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
 *               type: object
 *               properties:
 *                 remark:
 *                   type: string
 *                   example: "4U43-RV5F-5SIJ-9KXQ"              
 *                   description: Terminal Activation Succcess
 *                 success:
 *                   type: boolean
 *                   example: true              
 *                   description: True or false
 *             example:
 *               success: true
 *               remark: "Terminal Activated"
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
