import express, {Request,Response} from 'express'
const UserRouter=express.Router();
import { PrismaClient, relations } from '@prisma/client';
import {generateCompletion} from "../helper/gpt"
const prisma = new PrismaClient();
// import multer from 'multer';
// import cloudinary from '../helper/cloudinaryConfig';
import { v2 as cloudinaryV2 } from 'cloudinary';
import {User,Relation,Conversation} from "../types/interfaces"       
import { Types } from '@prisma/client/runtime/library';
// import {upload} from "../uploads/multer"
import cloudinary, { CloudinaryStorage } from 'multer-storage-cloudinary';
import { upload } from '../uploads/multer';
import dotenv from 'dotenv';
import {createConversations,ChatGptHelper} from "../controllers/user.controoler"
dotenv.config()



UserRouter.post('/addUser',async(req:Request,res:Response)=>{
    try {
        const {name,email,picture,About}=req.body;
        const userFindCheck=await prisma.user.findUnique({where:{
            email:email
        }})
        console.log(userFindCheck)
        if(userFindCheck){
            const users=userFindCheck
            return res.status(201).send({"msg":"user already exist",users})
        }
        const userData={
            name,
            email,
            picture,
            About
        }
        const users:User=await prisma.user.create({
            data:userData,
        })
        res.status(201).send({"msg":"user has been created",users})
    } catch (error) {
        console.log("something went wrong",error)
        res.status(500).send({"msg":"something went wrong",error})
    }
})

UserRouter.get('/getUser',async(req:Request,res:Response)=>{
    try {
       
       const Alluser=await prisma.user.findMany(
       { where:{
            NOT:{
                id:4,
                email:"Chatgpt@gmail.com"
            }
        }
    })
        res.status(200).send({"msg":"all user has been fetched",Alluser})
    } catch (error) {
        console.log("something went wrong",error)
        res.status(500).send({"msg":"something went wrong",error})
    }
})


UserRouter.post('/chatWithGPT',async(req:Request,res:Response)=>{
    try {
       const {text, textId,reciverId, conversationsID, date, type, time}=req.body
       const makeConvers=await ChatGptHelper(text, textId,conversationsID, date, type, time);
       console.log(makeConvers)
        const response:string | any = await generateCompletion(`${text}`);
        console.log("responseofgpt",response)
        const makeConversagain=await ChatGptHelper(response, reciverId,conversationsID, date, type, time)
        res.status(201).send({response})
    } catch (error) {
        console.log("something went wrong",error)
        res.status(500).send({"msg":"something went wrong",error})
    }
})


UserRouter.post("/createRelations", async (req: Request, res: Response) => {
    try {
        const { reciverId, senderId } = req.body;

        const availabelRealtions=await prisma.relations.findFirst({
            where:{
             reciverId:reciverId,
             senderId:senderId
            }
        })
        if(availabelRealtions){
         console.log(reciverId,typeof(reciverId),senderId,typeof(reciverId))

            let relations=availabelRealtions
            return res.status(200).send({'msg':"relations already exist",relations})
        }


        const CheckAgainavailabelRealtions=await prisma.relations.findFirst({
            where:{
             reciverId:senderId,
             senderId:reciverId
            }
        })
        if(CheckAgainavailabelRealtions){
            let relations={
                id:CheckAgainavailabelRealtions.id,
                senderId:CheckAgainavailabelRealtions.reciverId,
                reciverId:CheckAgainavailabelRealtions.senderId,
                conversations:CheckAgainavailabelRealtions.conversations
            }
            console.log("checkagain",senderId,reciverId)
            return res.status(200).send({'msg':"relations already exist",relations})
        }


        const postData = {
            reciverId: reciverId,
            senderId: senderId,
            conversations:[],
        };

        const relations = await prisma.relations.create({
            data: postData
        });
        console.log("relations",relations)
        // Handle the response or send a success message back to the client
        res.status(200).json({ message: "Relation created successfully",  relations });
    } catch (error) {
        // Handle errors appropriately
        console.log(error)
        res.status(500).json({ msg: "An error occurred while creating the relation",error });
    }
});



 
UserRouter.post("/createConversations",createConversations);

UserRouter.get("/particularConversations/:id",async(req:Request,res:Response)=>{
    try {
        let paramsid=req.params.id;
       const id=+paramsid
        let conversationObj=await prisma.relations.findFirst({
            where:{
                id:id
            }
        })
        const conversation=conversationObj?.conversations
        res.status(200).send(conversation)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the conversation" }); 
    }
})




cloudinaryV2.config({
    cloud_name:process.env.cloudname,
    api_key:process.env.cloudinary_key,
    api_secret:process.env.cloudinary_secret,
  });




UserRouter.post('/post/image/files',upload.single('profile'),async(req:Request,res:Response)=>{
    // Access the uploaded file info via req.file
  // The uploaded file is already stored in Cloudinary, and you can use its public URL
  try{
    let {textId,conversationsID,date,time,type}=req.body;
    conversationsID=+conversationsID
    textId=+textId
    const existingRelations=await prisma.relations.findUnique({
        where:{
            id:conversationsID
        }
    });
    
     let existingConversations:any=existingRelations?.conversations ?? [];
      
    //    existingConversations = existingConversations.filter((conversation: any) => conversation.text!=undefined);
    const filebuffer=req.file?.buffer
    const timeStamp=new Date().getTime();
    const uniqueId=Math.floor(Math.random()*100000);
    
    const PublicId=`image_${timeStamp}_${uniqueId}`;
    cloudinaryV2.uploader.upload_stream({
        public_id:PublicId
    },
    async(err,result)=>{
        if(err){
            return res.status(500).send({"msg":"error in cloudinary"})
        }
             const updatedConversations = [
            ...existingConversations,
            {
                fileurl:result?.url,
                textId,
                date,
                type,
                time
            }
        ];
        const conversationRelation = await prisma.relations.update({
                    where: {
                        id: conversationsID
                    },
                    data: {
                        conversations: updatedConversations
                    
                    }
                });
                console.log("convers",conversationRelation)
        res.status(200).json({ message: "Conversation created successfully",conversationRelation });
    }
    ).end(filebuffer)
  } catch (error) {
console.log(error);
res.status(500).json({ error: "An error occurred while creating the conversation" });
}
})

export default UserRouter