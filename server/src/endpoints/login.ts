import axios, { AxiosResponse } from 'axios'
import { v4 } from 'uuid'
import { Router } from 'express-ws';
import jwt_decode from "jwt-decode";

const PROFILE_INFO = 26


export const createRequest= async (components:{redis}) => {
  try {
  const response = await axios.post(process.env.SSI_SERVER_V2 + '/v2/createrequestvc', 
      {
          templateid: PROFILE_INFO,
          dataset: { },
          domain: process.env.PASSWORDLESS_LOGIN_SERVER +"/request/consumerequest",
          challenge : "challenge"
      },
        {headers: {
          'Content-Type': 'application/json',
          'X-Token': process.env.ACCESS_TOKEN
      }})
      let key = v4()
  components.redis.setItem(key, response.data.data.jwt)
  return {data: {error:0, jwt:process.env.PASSWORDLESS_LOGIN_SERVER + "/request/gettoken/"+ key}}
} catch(e) {
  console.log('Error:', e)
  throw e
}}

export const setupRequest = (router: Router, components: { ws: any; redis: any; }) => {

  router.get('/', async(req,res)=> {  

    try {
      const response = await axios.post(process.env.SSI_SERVER_V2 + '/v2/createrequestvc', 
          {
              templateid: PROFILE_INFO,
              dataset: { },
              domain: process.env.PASSWORDLESS_LOGIN_SERVER +"/request/consumerequest",
              challenge : "challenge"
          },
            {headers: {
              'Content-Type': 'application/json',
              'X-Token': process.env.ACCESS_TOKEN
          }})
          let key = v4()
      components.redis.setItem(key, response.data.data.jwt)
      res.status(200).json( {data: {error:0, jwt:process.env.PASSWORDLESS_LOGIN_SERVER + "/request/gettoken/"+ key}})
    } catch(e) {
      console.log('Error:', e)
      res.status(500).json({})
    }
  })
  

  router.get("/gettoken/:token", async (req, res) => {
    console.log(components.redis)
    let ch = components.redis.getItem(req.params.token)
    res.status(200).json({jwt:ch})
  })
  
  router.post('/consumerequest/:token?', async function (req, res, next) {
    try {
        const jwt = req.body.jwt
        const decoded:{iss:string} = jwt_decode(jwt)
        const iss = decoded.iss
        let token = req.params.token
        let ch = components.redis.getItem(token)
        console.log("CH", ch)
        let vcs = []
        console.log("from phone:", jwt)
        const response = await axios.post(process.env.SSI_SERVER_V2 + '/v2/consumerequest', {
            jwt: jwt
        }, {headers: {
            'Content-Type': 'application/json',
            'X-Token': process.env.ACCESS_TOKEN
        }})
        response.data.data.payload.verifiableCredential.forEach(element => {
            console.log("VAL:", element, "JWT:", decoded)
            // console.log("VAL:", element.credentialSubject)
            vcs.push(element)
        });

        if(vcs[0].credentialSubject.id === process.env.DID_ISSUER && vcs[0].credentialSubject.email){

          components.ws.send(JSON.stringify({error:0, email:vcs[0].credentialSubject.email}))
          res.status(200).json({ data: {error: 0, payload: vcs}})
          return
        }else{
          res.status(403).json({ err:1, message:'forbidden, invalid VC '})
          return
        } 
        
        //simple jwt parser check if the jwt is valid check type in varifiable credential , email valida?

    } catch(e) {
        console.log("ERROR:", e)
    }
  })
}