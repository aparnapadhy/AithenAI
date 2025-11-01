import Chat from "../models/Chat.js";
import User from '../models/User.js'
import axios from 'axios'
import imagekit from "../configs/imageKit.js";
import openai from '../configs/openai.js'

//API to generate text-based AI response
export const textResponse = async(req,res)=>{

    try {
        const userId = req.user._id;

        //check credits
        if(req.user.credits<1){
            return res.json({success:false, message:"you don't have enough credits to use this feature!"})
        }

    const {chatId, prompt}  = req.body;

    const chat = await Chat.findOne({_id:chatId, userId});

    chat.messages.push({role:"user", content: prompt, timestamp: Date.now(),isImage:false});

    const {choices} = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
});

    const reply = {...choices[0].message , timestamp: Date.now(),isImage:false}
    res.json({success:true, reply});
   
    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({_id:userId}, {$inc: {credits: -1}});
    }

     catch (error) {
        res.json({success:false, message: error.message});
    }}
    
//API to generate image-based AI response
 export const imageResponse = async(req,res)=>{
    try {
        const userId = req.user._id;

        //check credits
        if(req.user.credits<2){
            return res.json({success:false, message:"you don't have enough credits to use this feature!"})
        }
        
        const {prompt, chatId,isPublished} = req.body;

        //find chat
        const chat = await Chat.findOne({_id:chatId, userId});

        //push user message
        chat.messages.push({
            role:"user",
            content: prompt,
            timestamp: Date.now(),
            isImage:false })

        //encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        //construct generated image url
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/aithenai/${Date.now()}.png?tr=w-800,h-800`

        //trigger image generation by fetching from imagekit
        const bufferImage = await axios.get(generatedImageUrl, {responseType:"arraybuffer"})

        //convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(bufferImage.data, "binary").toString('base64')}`

        //upload to imagekit media library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "aithenai"
        })

        const reply = {
             role: 'assistant' ,
             content : uploadResponse.url,
             timestamp: Date.now(),
             isImage:true,
             isPublished}

    res.json({success:true, reply});

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({_id:userId}, {$inc: {credits: 2}});
   
    } catch (error) {
        res.json({success:false, message:error.message});
    }
 }
 
 //API to get published images
 export const getPublishedImages = async(req,res)=>{

    try {
         const publishedImageMessages = await Chat.aggregate([
        {$unwind : "$messages"},
        {
           '$messages.isImage' : true,
           '$messages.isPublished' : true
        }, 
        {
            $project : {
                _id : 0,
                imageUrl : "$messages.content",
                userName : "$userName"
            }
        }
    ])

    res.json({success:true, images: publishedImageMessages.reverse()});

    } catch (error) {
    res.json({success:false, message:error.message});
    }
   
 }