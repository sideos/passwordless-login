import axios, { AxiosResponse } from 'axios'
import { v4 } from 'uuid'
import { Router } from 'express-ws';

const PROFILE_INFO = 26

export const createOffer = async (components, email:string) => {
  try {
    let key = v4()
    components.redis.setItem(key, key)
    const response = await axios.post(process.env.SSI_SERVER_V2 +"/v2/createoffervc",
        {
            templateid: PROFILE_INFO,
            dataset: {
                "email": email
            },
            domain: process.env.PASSWORDLESS_LOGIN_SERVER + "/offer/consume",
            challenge: key
        }, 
        { headers: { 
            'Content-Type': 'application/json',
            'X-Token': process.env.ACCESS_TOKEN} })
    console.log('response', response.data)
    return {data: response.data.data}

} catch (error) {
    return { msg: "error", message: error }
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
        res.status(200).json(response.data)
    } else {
        res.status(403).json({})
    }
})
}