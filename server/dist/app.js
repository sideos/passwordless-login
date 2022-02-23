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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const redis_1 = require("./redis");
const login_1 = require("./endpoints/login");
const app = (0, express_1.default)();
const expressWs = require('express-ws')(app);
const requestRouter = express_1.default.Router();
app.use("/request", requestRouter);
(0, login_1.setupRequest)(requestRouter, config_1.components);
const PORT = 8084;
app.use((0, cors_1.default)({
    credentials: true,
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
config_1.components.redis = { setItem: redis_1.setItem, getItem: redis_1.getItem };
// Health check at "/"
app.get('/', (req, res) => {
    res.status(200).send('all in check!');
});
const s = http_1.default.createServer(app);
//@ts-ignore
app.ws('/api/login', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    config_1.components.ws = ws;
    try {
        console.log('here');
        const response = yield (0, login_1.createRequest)(config_1.components);
        ws.send(JSON.stringify(response.data));
    }
    catch (e) {
        ws.send({ err: 1, message: e });
    }
    ws.on('close', () => {
        console.log('WebSocket was closed');
    });
}));
app.use(express_1.default.json());
app.listen(PORT, () => { `Listen to PORT ${PORT}`; });
//# sourceMappingURL=app.js.map