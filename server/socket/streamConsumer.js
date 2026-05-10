//  consumer (worker) *******
// function **runs in the background**, constantly checking the "To-Do List" (Stream) and **saving items to MongoDB**.

import { redis } from "../config/connection.js";
import Message from "../models/message.schema.js";

export const startStreamConsumer = async()=>{
    console.log("Redis Stream Consumer started...");

    while(true){
        try{
            // BLOCK 5000: Wait up to 5 seconds for a new message
           // '$': Only read messages that arrive AFTER we start listening
           // '0' means: Start from the very first message in the stream
            const response = await redis.xread("BLOCK",5000,"STREAMS","chat_stream","$")
            console.log("Stream response:", response);

            if (response) {
        const [_streamName, messages] = response[0];
            
        for(const [id,fields] of messages){

            // Fields come as a flat array: ['key', 'value', 'key', 'value']
          // Let's turn it into a nice object
            const data={};
           if (Array.isArray(fields)) {
        for (let i = 0; i < fields.length; i += 2) {
            data[fields[i]] = fields[i + 1];
        }
    } else {
        // If it's already an object, just use it
        data = fields;
    }

            // Save to MongoDB
            await Message.create(data);
                console.log("Message saved to MongoDB:", data);
                
            // Remove from stream so it doesn't grow forever    
            await redis.xdel("chat_stream",id);    
        }}

        }catch(error){
            console.log("stream consumer error:",error)
        }
    }
}