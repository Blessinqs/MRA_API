"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_1 = __importDefault(require("./swagger"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const port = 4000;
(0, swagger_1.default)(app, port);
app.listen(port, () => {
    app.use("/api", auth_1.default);
    app.use("/auth", auth_1.default);
    return console.log(`Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map