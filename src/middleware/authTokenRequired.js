import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
// import dotenv from 'dotenv';
const User = mongoose.model('User')
// dotenv.config();

const authTokenRequired = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'] || req.headers['Authorization'];

    if(!authorizationHeader){
        return res.status(401).send({error:"You must log in key not given"})
    }
    const token = authorizationHeader.replace("Bearer ", "")
    // console.log(token)
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).send({error:'you must be loged in , token error'})
        }
        const {_id} = payload;
        User.findById(_id).then(userData => {
            req.user = userData;   
            next() 
        })
        
    })

};

export default authTokenRequired;
