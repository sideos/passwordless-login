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
exports.createRequest = void 0;
const axios_1 = __importDefault(require("axios"));
// import { v4 } from 'uuid'
// import { Router, Request, Response } from 'express';
// export const setupLogin = (publicRoute: any, components: any) => {}
const PROFILE_INFO = 11;
var savedToken = "";
const createRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.SSI_SERVER_V2 + '/v3/createrequestvc', {
            templateid: [PROFILE_INFO],
            dataset: {},
            domain: process.env.DEMOSHOP_HOST + "/request/consumerequest",
            challenge: "challenge"
        }, { headers: {
                'Content-Type': 'application/json',
                'X-Token': '107ae17b-88c8-42d1-bdea-1460f1936a52'
            } });
        savedToken = response.data.data.jwt;
        return { data: { error: 0, jwt: process.env.DEMOSHOP_HOST + "/request/gettoken" } };
    }
    catch (e) {
        console.log('Error:', e);
        throw e;
    }
});
exports.createRequest = createRequest;
//# sourceMappingURL=login.js.map