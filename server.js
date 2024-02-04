import 'dotenv/config';

import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from "body-parser";

import Router from './src/routers/index.js'

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit:'50mb'
}));
app.use((req, res, next) => {
    console.log("params" , req.params);
    console.log("body" , req.body);
    console.log("URL: ", req.originalUrl);
    next();
});
app.use(Router);

app.use ((err, req, res, next) => {
    console.log("======" , err, "=====");
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        message : err.message,
        statusCode,
        err : err
    });
})



const port = process.env.PORT || 4000;

const server  = http.createServer(app);
server.listen( port, () => {
    console.log( `server started at port : ${ port }` );
});