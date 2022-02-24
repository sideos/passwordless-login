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
exports.setupOffer = exports.createOffer = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const PROFILE_INFO = 26;
const createOffer = (components, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let key = (0, uuid_1.v4)();
        components.redis.setItem(key, key);
        const response = yield axios_1.default.post(process.env.SSI_SERVER_V2 + "/v2/createoffervc", {
            templateid: PROFILE_INFO,
            dataset: {
                "email": email
            },
            domain: process.env.PASSWORDLESS_LOGIN_SERVER + "/offer/consume",
            challenge: key
        }, { headers: {
                'Content-Type': 'application/json',
                'X-Token': process.env.ACCESS_TOKEN
            } });
        components.redis.setItem(key, response.data.data.jwt);
        return { data: { error: 0, jwt: process.env.PASSWORDLESS_LOGIN_SERVER + "/request/gettoken/" + key } };
    }
    catch (error) {
        return { msg: "error", message: error };
    }
});
exports.createOffer = createOffer;
const setupOffer = (router, components) => {
    router.post("/consume/:challenge", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const jwt = req.body.jwt;
        let vcs = [];
        let verification = components.redis.getItem(req.params.challenge);
        if (verification) {
            const response = yield axios_1.default.post(process.env.SSI_SERVER_V2 + '/v2/consumeoffer', {
                token: jwt
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Token': process.env.ACCESS_TOKEN
                }
            });
            res.status(200).json(response.data);
        }
        else {
            res.status(403).json({});
        }
    }));
};
exports.setupOffer = setupOffer;
//# sourceMappingURL=registration.js.map