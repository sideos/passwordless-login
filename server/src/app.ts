import express from 'express';
import http from 'http'
import cors from 'cors';
import {components} from './config'
import {setItem, getItem} from './redis'
import { setupRequest, createRequest } from './endpoints/login';

const app = express();
const expressWs = require('express-ws')(app)

const requestRouter = express.Router()
setupRequest(requestRouter, components)
app.use("/request", requestRouter);

const PORT = 8080;

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
//@ts-ignore
app.ws('/login', (ws, req) => {
    components.ws = ws
    
    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.use(express.json())
app.listen(PORT, () => {`Listen to PORT ${PORT}`})