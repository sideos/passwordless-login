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
exports.setupRequest = exports.createRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const PROFILE_INFO = 26;
const createRequest = (components) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.SSI_SERVER_V2 + '/v2/createrequestvc', {
            templateid: PROFILE_INFO,
            dataset: {},
            domain: process.env.PASSWORDLESS_LOGIN_SERVER + "/request/consumerequest",
            challenge: "challenge"
        }, { headers: {
                'Content-Type': 'application/json',
                'X-Token': process.env.ACCESS_TOKEN
            } });
        let key = (0, uuid_1.v4)();
        components.redis.setItem(key, response.data.data.jwt);
        return { data: { error: 0, jwt: process.env.PASSWORDLESS_LOGIN_SERVER + "/request/gettoken/" + key } };
    }
    catch (e) {
        console.log('Error:', e);
        throw e;
    }
});
exports.createRequest = createRequest;
const setupRequest = (router, components) => {
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('hey');
        try {
            const response = yield axios_1.default.post(process.env.SSI_SERVER_V2 + '/v2/createrequestvc', {
                templateid: PROFILE_INFO,
                dataset: {},
                domain: process.env.PASSWORDLESS_LOGIN_SERVER + "/request/consumerequest",
                challenge: "challenge"
            }, { headers: {
                    'Content-Type': 'application/json',
                    'X-Token': process.env.ACCESS_TOKEN
                } });
            let key = (0, uuid_1.v4)();
            components.redis.setItem(key, response.data.data.jwt);
            res.status(200).json({ data: { error: 0, jwt: process.env.PASSWORDLESS_LOGIN_SERVER + "/request/gettoken/" + key } });
        }
        catch (e) {
            console.log('Error:', e);
            res.status(500).json({});
        }
    }));
    router.get("/gettoken/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(components.redis);
        let ch = components.redis.getItem(req.params.token);
        res.status(200).json({ jwt: ch });
    }));
    router.post('/consumerequest/:token?', function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jwt = req.body.jwt;
                let token = req.params.token;
                let ch = components.redis.getItem(token);
                console.log("CH", ch);
                let vcs = [];
                console.log("from phone:", jwt);
                const response = yield axios_1.default.post(process.env.SSI_SERVER_V2 + '/v2/consumerequest', {
                    jwt: jwt
                }, { headers: {
                        'Content-Type': 'application/json',
                        'X-Token': 'a4918448-82e8-4e52-9e4f-65c5bad03261'
                    } });
                response.data.data.payload.verifiableCredential.forEach(element => {
                    console.log("VAL:", element.credentialSubject);
                    vcs.push(element);
                });
                components.ws.send(JSON.stringify(vcs));
                res.status(200).json({ data: { error: 0, payload: vcs } });
            }
            catch (e) {
                console.log("ERROR:", e);
            }
        });
    });
};
exports.setupRequest = setupRequest;
//# sourceMappingURL=login.js.map