import express from 'express';
import Thread from "../models/Thread.js"
import getOpenAIAPIResponse from '../utils/openai.js';
import {protect} from '../middleware/auth.js';


const router = express.Router();

//test

router.use(protect); // Apply authentication middleware to all routes in this router

router.post("/test",async(req,res) => {
    try{
        const thread = new Thread({
            threadId:"xyz",
            title:"tetsing new thread"
        });

        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to save in DB"});
    }
});

//Get all threads
router.get("/thread",async(req,res) => {
    try {
        const threads = await Thread.find({userId:req.user.id}).sort({updatedAt:-1});
        res.json(threads);
        //descending order//most recent

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Fialed to fetch threads"});
    }
});

router.get("/thread/:threadId",async(req,res) => {
    const {threadId}=req.params;
    try{
        const thread = await Thread.findOne({threadId,userId:req.user.id});

        if(!thread){
            res.status(404).json({error:"Thread not found"})
        }
        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Fialed to fetch chat"}); 
    }
});
router.delete("/thread/:threadId",async(req,res) => {
    const {threadId} = req.params;
    try{
        const deletedThread=await Thread.findOneAndDelete({threadId,userId:req.user.id});
        if(!deletedThread){
            res.status(404).json({error:"thread not found"});
        }
        res.status(200).json({success:"thread deleted successfully"});
    }catch(err){
         console.log(err);
        res.status(500).json({error:"Fialed to delete"}); 
    }
});


router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId,userId:req.user.id });

        // create thread if not exists
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [],
                userId: req.user.id
            });
        }

        const userMessage = { role: "user", content: message };

        //  IMPORTANT: send FULL history
        const assistantReply = await getOpenAIAPIResponse([
            ...thread.messages,
            userMessage
        ]);

        // now store messages
        thread.messages.push(userMessage);
        thread.messages.push(assistantReply);

        thread.updatedAt = new Date();
        await thread.save();

        res.json(assistantReply);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });
    }
});
export default router;