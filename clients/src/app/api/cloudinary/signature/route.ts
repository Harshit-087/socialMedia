
//signature for cloudinary api route

import { NextRequest,NextResponse } from "next/server"

import crypto from "crypto"

export async function GET(request:NextRequest){
    const timestamp = Math.round(Date.now()/1000);
    const apikey = process.env.CLOUDINARY_API_KEY;

    const signature = crypto
    .createHash("sha256")
    .update(`timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex")

    return NextResponse.json({
        timestamp,
        apikey,
        signature,
        cloudname:process.env.CLOUDINARY_CLOUD_NAME
    })

}