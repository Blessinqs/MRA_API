"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Create a Auth.
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The Auth ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The Auth's name.
 *                       example: Leanne Graham
*/
router.post('/', authControllers_1.createAuths);
router.post('/terminal', authControllers_1.createTerminalAuths);
/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Retrieve a single Auth.
 *     description: Retrieve a single Auth. Can be used to populate a Auth profile when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the Auth to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         ...
 */
router.patch('/latest-configs/:id', authControllers_1.getAuthConfigs);
router.get('/', authControllers_1.getAuths);
/**
 * @swagger
 * /auth/{id}:
 *   patch:
 *     summary: Partially update a Auth
 *     tags: [Auths]
 *     description: Update specific fields of a Auth. Only include the fields you want to update.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the Auth to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The Auth's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The Auth's email
 *             example:
 *               name: Updated Name
 *               email: updated@example.com
 *     responses:
 *       200:
 *         description: Auth was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Auth not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authControllers_1.updateAuth);
/**
 * @swagger
 * /auth/{id}:
 *   put:
 *     summary: Replace an existing Auth
 *     tags: [Auths]
 *     description: Replace all Auth data with the provided data. All fields must be included.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the Auth to replace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Auth was replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Auth not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authControllers_1.upadteFullAuth);
/**
 * @swagger
 * /auth/{id}:
 *   delete:
 *     summary: Delete a Auth
 *     tags: [Auths]
 *     description: Delete a Auth by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the Auth to delete
 *     responses:
 *       204:
 *         description: Auth was deleted successfully
 *       404:
 *         description: Auth not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authControllers_1.deleteAuth);
exports.default = router;
//# sourceMappingURL=auth.js.map