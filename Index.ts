import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./Routers/UserRoute"
const app=express()
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(UserRouter)
app.listen(process.env.port,()=>{
    console.log(`http://localhost:${process.env.port}`)
})
