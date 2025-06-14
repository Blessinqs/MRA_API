"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuth = exports.getAuths = exports.upadteFullAuth = exports.updateAuth = exports.createTerminalAuths = exports.createAuths = exports.getAuthConfigs = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAuthConfigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let latest = yield axios_1.default.post(`${process.env.MRA_URL}/api/v1/configuration/get-latest-configs`);
        if (latest.status == 200) {
            res.status(200).json(Object.assign(Object.assign({}, latest.data), { messge: "Success!" }));
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
exports.getAuthConfigs = getAuthConfigs;
const createAuths = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'John Mike' }]);
});
exports.createAuths = createAuths;
const createTerminalAuths = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let terminal = yield axios_1.default.post(`${process.env.MRA_URL}/api/v1/onboarding/activate-terminal`, {
            terminalActivationCode: "WRCN-67VB-PQWS-YC4X",
            environment: {
                platform: {
                    "osName": "Microsoft Windows 11 Pro",
                    "osVersion": "10.0.22631 Build 22631",
                    "osBuild": "22631.5189",
                    "macAddress": "38:fc:98:12:0f:b6"
                },
                pos: {
                    "productID": "00330-50000-00000-AAOEM",
                    "productVersion": "10.0.22631.5189"
                }
            }
        });
        console.log(terminal);
        res.status(200).json(Object.assign({}, terminal.data));
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
exports.createTerminalAuths = createTerminalAuths;
const updateAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'John Mike' }]);
});
exports.updateAuth = updateAuth;
const upadteFullAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'John Mike' }]);
});
exports.upadteFullAuth = upadteFullAuth;
const getAuths = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let terminal = yield axios_1.default.post(`https://dev-eis-api.mra.mw/api/v1/onboarding/activate-terminal`, {
            terminalActivationCode: "WRCN-67VB-PQWS-YC4X",
            environment: {
                platform: {
                    "osName": "Microsoft Windows 11 Pro",
                    "osVersion": "10.0.22631 Build 22631",
                    "osBuild": "22631.5189",
                    "macAddress": "38:fc:98:12:0f:b6"
                },
                pos: {
                    "productID": "00330-50000-00000-AAOEM",
                    "productVersion": "10.0.22631.5189"
                }
            }
        });
        console.log(terminal);
        res.status(200).json(Object.assign({}, terminal.data));
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
exports.getAuths = getAuths;
const deleteAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'John Mike' }]);
});
exports.deleteAuth = deleteAuth;
//# sourceMappingURL=authControllers.js.map