import { Request,Response } from "express"
import { PrismaClient, relations } from '@prisma/client';
const prisma = new PrismaClient();
export const createConversations=async(req:Request,res:Response)=>{
    try {
        const { text, textId, conversationsID, date, type, time } = req.body;
                console.log(text, textId, conversationsID, date, type, time);
                const existingRelations=await prisma.relations.findUnique({
                    where:{
                        id:conversationsID
                    }
                });
                
                let existingConversations:any=existingRelations?.conversations ?? [];
                console.log(existingConversations);
               console.log("existingConversations",typeof existingConversations) 
               

               existingConversations = existingConversations.filter((conversation: any) => conversation.type!=undefined);

                const updatedConversations = [
                    ...existingConversations,
                    {
                        text,
                        textId,
                        date,
                        type,
                        time
                    }
                ];
                console.log(updatedConversations);
        
                // Update the conversation relation with the new conversations array
                const conversationRelation = await prisma.relations.update({
                    where: {
                        id: conversationsID
                    },
                    data: {
                        conversations: updatedConversations
                    
                    }
                });
        
                console.log(conversationRelation);
                res.status(200).json({ message: "Conversation created successfully", conversationRelation });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred while creating the conversation" });
    }
}

export const ChatGptHelper=async( text:string, textId:number, conversationsID:number, date:string, type:string, time:string)=>{
    try {
                console.log(text, textId, conversationsID, date, type, time);
                const existingRelations=await prisma.relations.findUnique({
                    where:{
                        id:conversationsID
                    }
                });
                
                let existingConversations:any=existingRelations?.conversations ?? [];
                console.log(existingConversations);
               console.log("existingConversations",typeof existingConversations) 
               

               existingConversations = existingConversations.filter((conversation: any) => conversation.type!=undefined);

                const updatedConversations = [
                    ...existingConversations,
                    {
                        text,
                        textId,
                        date,
                        type,
                        time
                    }
                ];
                // console.log(updatedConversations);
        
                // Update the conversation relation with the new conversations array
                const conversationRelation = await prisma.relations.update({
                    where: {
                        id: conversationsID
                    },
                    data: {
                        conversations: updatedConversations
                    
                    }
                });
                // console.log(conversationRelation);
              return conversationRelation
    } catch (error) {
      console.log(error);
      return error
    }
}