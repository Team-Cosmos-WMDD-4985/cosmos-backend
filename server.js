import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from "body-parser";
import Router from './src/routers/index.js';

// DB Connection
import dbConnection from "./src/config/db.js";
await dbConnection();

const app = express();
// import awsService from './src/services/aws.service.js';
// await awsService.getObject();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
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

// app.use(authRoute)


const port = process.env.PORT || 4000;

const server  = http.createServer(app);
server.listen( port, () => {
    console.log( `server started at port : ${ port }` );
});