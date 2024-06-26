import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import User from './../models/User.js';
import bcrypt from 'bcrypt'

export default {
    signup: async(req, res, next) => {

        const { name, email, password, dob } = req.body;
        if (!name || !email || !password ) {
            return res.status(422).send({ error: 'Please fill out all the missing fields' });
        }
        User.findOne({ email: email }).then(async (savedUser) => {
            if (savedUser) {
                return res.status(422).send({ error: 'User already exists' });
            }
            const user = new User({
                name,
                email,
                password,
                dob
            })
    
            try {
                await user.save()
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                res.send({ token })
    
            } catch {
                return res.status(422).send({ error: error.message });
            }
    
    
        });
    },

    login: async (req, res, next) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).send({ error: 'Please fill out all the missing fields' });
        }
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(422).send({ error: 'invalid Credential' });
        }
        try {
            bcrypt.compare(password, user.password,(err,result) =>{
                if (result) {
                    console.log("password match")
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

                    const userInfo = user.toJSON();
                    delete userInfo.password;
                    delete userInfo._id;
                    res.json({
                        token : token,
                        user: user
                    })
    
                }
                else{
                    console.log("password dint match")
                    return res.status(422).send({ error: 'password not match' });
                }
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }

    
}