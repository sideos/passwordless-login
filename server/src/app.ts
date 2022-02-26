import express from 'express';
import http from 'http'
import cors from 'cors';
import { components } from './config'
import { setItem, getItem } from './redis'
import { setupRequest, createRequest} from './endpoints/login';
import { setupOffer, createOffer } from './endpoints/registration';

const appBase = express();
const expressWs = require('express-ws')(appBase)
let { app } = expressWs
app.use(express.json())

const requestRouter = express.Router()
app.use("/request", requestRouter);
setupRequest(requestRouter, components)

const offerRouter = express.Router()
app.use("/offer", offerRouter);
setupOffer(offerRouter, components)

const PORT = process.env.PASSWORDLESS_LOGIN_PORT || 8000

app.use(
  cors({
    credentials: true,
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

components.redis = {setItem, getItem}

// Health check at "/"
app.get('/', (req, res) => {
  res.status(200).send('all in check!')
})

const s = http.createServer(app)

app.ws('/api/login',async (ws, req) => {
    components.ws = ws
    try {
      const response = await createRequest(components)
      ws.send(JSON.stringify(response.data))
      
    } catch (e) {
      ws.send({ err:1, message:e })
    }
    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.ws('/api/registration',async (ws, req) => {
    components.ws = ws
  
    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
    ws.on('message', (data) => {
      let message = JSON.parse(data)
      if (message.action==="getoffer") {
        createOffer(components, message.email).then(response => {
          ws.send(JSON.stringify(response.data))
        }) 
      }
  })
})

app.use(express.json())
app.listen(PORT, () => {`Listen to PORT ${PORT}`})