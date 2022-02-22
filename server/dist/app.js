"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
const expressWs = require('express-ws')(app);
const PORT = 8080;
app.use(cors_1.default({
    credentials: true,
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
var components = {
    ws: null
};
// Health check at "/"
app.get('/', (req, res) => {
    res.status(200).send('all in check!');
});
const s = http_1.default.createServer(app);
//@ts-ignore
app.ws('/login', (ws, req) => {
    components.ws = ws;
    ws.on('close', () => {
        console.log('WebSocket was closed');
    });
});
app.use(express_1.default.json());
app.listen(PORT, () => { `Listen to PORT ${PORT}`; });
//# sourceMappingURL=app.js.map