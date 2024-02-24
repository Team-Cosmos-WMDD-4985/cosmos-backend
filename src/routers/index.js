import express from 'express';
import { langChain } from "./../controllers/langchain.js"
const router = express.Router();

router.get("/test", (req, res)=> {
    res.json({
        message: "This is a test route"
    })
})
router.post("/langchain", langChain);
export default router;