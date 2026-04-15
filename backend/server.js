import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = 8000;

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
));

app.use(express.json());
app.use("/api/auth",authRoutes);

app.use("/api",chatRoutes);

app.listen(PORT,() => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB")
    }catch(err){
        console.log("Failed to connect",err);
    }
}

// app.post("/test",async(req,res) =>{
//     const options = {
//         method:"POST",
//         headers:{
//             "content-type":"application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body:JSON.stringify({
//             model:"gpt-5.4-mini",
//             messages:[{
//                 role:"user",
//                 content:req.body.message
//             }]
//         })
//     }
//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions",options);
//         const data = await response.json();
//         console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);
//     }catch(err){
//         console.log(err);
//     }
// } );

