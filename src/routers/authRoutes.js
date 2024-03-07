import express from 'express'
import authController from "./../controllers/auth.js"
import { getCourse } from '../controllers/getCourse.js';
import authTokenRequired from '../middleware/authTokenRequired.js'; 

const router = express.Router()

router.post("/signup", authController.signup);
router.post('/login', authController.login);
router.get('/getCourse', authTokenRequired, getCourse);


export default router;


