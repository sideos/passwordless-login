import axios, { AxiosResponse } from 'axios'
import { v4 } from 'uuid'
import { Router } from 'express-ws';


export const createOffer = async (components) => {
  try {
    const response = await axios.post(process.env.SSI_SERVER_V2 +"/v2/createoffervc",
        {
            templateid: [11,12,13],
            dataset: {
                "phone-number": "7836587659743"
            },
            domain: process.env.REGISTRATION_HOST +":"+ process.env.REGISTRATION_PORT+"/offer/consume",
            challenge: "9899"
        }, 
        { headers: { 
            'Content-Type': 'application/json',
            'X-Token': '107ae17b-88c8-42d1-bdea-1460f1936a52' } })
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

    const response = await axios.post(process.env.SSI_SERVER_V2 + '/v2/consumeoffer', {
            token: jwt
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Token': '107ae17b-88c8-42d1-bdea-1460f1936a52'
                }
            })
    res.status(200).send(response.data)
})
}