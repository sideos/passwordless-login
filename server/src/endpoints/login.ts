import axios, { AxiosResponse } from 'axios'
import { v4 } from 'uuid'
import * as express from 'express';


const router = express.Router();
const PROFILE_INFO = 26



export const createRequest = async  (components) => {
  try {
    const response = await axios.post(process.env.SSI_SERVER_V2 + '/v3/createrequestvc', 
        {
            templateid: [PROFILE_INFO],
            dataset: { },
            domain: process.env.PASSWORDLESS_LOGIN_SERVER +"/request/consumerequest",
            challenge : "challenge"
        },
          {headers: {
            'Content-Type': 'application/json',
            'X-Token': process.env.ACCESS_TOKEN
        }})
        let key = v4()
    components.setItem(key, response.data.data.jwt)
    return {data: {error:0, jwt:process.env.PASSWORDLESS_LOGIN_SERVER + "/request/gettoken/"+ key}}
  } catch(e) {
    console.log('Error:', e)
    throw e
  }
}

export const setupRequest = (router, components) => {
  router.get("/gettoken", async (req, res) => {
    console.log(components.redis)
    res.status(200).json({jwt: components.redis})
  })
  
  router.post('/consumerequest/:token?', async function (req, res, next) {
    try {
        const jwt = req.body.jwt
        let token = req.params.token
        let ch = components.redis.getItem(token)
        console.log("CH", ch)
        let vcs = []
        console.log("from phone:", jwt)
        const response = await axios.post(process.env.SSI_SERVER_V2 + '/v2/consumerequest', {
            jwt: jwt
        }, {headers: {
            'Content-Type': 'application/json',
            'X-Token': '107ae17b-88c8-42d1-bdea-1460f1936a52'
        }})
        response.data.data.payload.verifiableCredential.forEach(element => {
            console.log("VAL:", element.credentialSubject)
            vcs.push(element)
        });
        components.ws.send(JSON.stringify(vcs))
        res.status(200).json({ data: {error: 0, payload: vcs}})
    } catch(e) {
        console.log("ERROR:", e)
    }
  })
}