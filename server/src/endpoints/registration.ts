import axios, { AxiosResponse } from 'axios'
import { v4 } from 'uuid'
import jwt_decode from "jwt-decode";

const TEMPLATE_ID = process.env.TEMPLATE_ID || 26

interface VC {
    verifiableCredential:[
        {
            credentialSubject:{
                email:string
            }
        }
    ]
}

export const createOffer = async (components, email:string) => {
    try {
        let key = v4()
        components.redis.setItem(key, key)
        const response = await axios.post(process.env.SSI_SERVER_V2 +"/v2/createoffervc", {
            templateid: TEMPLATE_ID,
            dataset: {
                email
            },
            domain: process.env.PASSWORDLESS_LOGIN_SERVER + "/offer/consume",
            challenge: key
        }, 
        { headers: { 
            'Content-Type': 'application/json',
            'X-Token': process.env.ACCESS_TOKEN} })
        if (response.data.data.error===0) {
                components.redis.setItem(key, response.data.data.jwt)
                return {data: {error:0, jwt:process.env.PASSWORDLESS_LOGIN_SERVER + "/request/gettoken/" + key}}
        } else {
            return {data: {error: true} }
        }
    } catch (error) {
        return {data: {error: true} }
    }
}



export const setupOffer = (router, components) => { 
    router.post("/consume/:challenge", async (req, res) => {
        const jwt = req.body.jwt
        let vcs = []
        let verification = components.redis.getItem(req.params.challenge)
        if (verification) {
            const response = await axios.post(process.env.SSI_SERVER_V2 + '/v2/consumeoffer', {
                token: jwt
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Token': process.env.ACCESS_TOKEN
                    }
                })
            if (response.data.data.error===0) {
                const decoded:VC = jwt_decode(response.data.data.jwt)
                if (decoded.verifiableCredential[0].credentialSubject.email) {
                    components.ws.send(JSON.stringify({error:0, email:decoded.verifiableCredential[0].credentialSubject.email}))
                    res.status(200).json(response.data)
                } else {
                    res.status(403).json({})
                }
            } else {
                res.status(403).json({})
            }
        } else {
            res.status(403).json({})
        }
    })
}