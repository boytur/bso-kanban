import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const response = await prisma.post.findMany();
        return NextResponse.json({ body: response}, { status: 200 });
    } catch (error) {
        return new NextResponse("Internal Server Error", {
            status: 500,
        });
    }
}

export async function POST(req: Request) {
    try {
        const { title, content } = await req.json();
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
            },
        });
        console.log("POST Response:", newPost); // ตรวจสอบ response ที่ได้รับจากฐานข้อมูล
        return NextResponse.json({body: newPost, message: "Created successful"}, {status: 201});
    } catch (error) {
        console.error("POST Error:", error); // แสดง error ในคอนโซล
        return new NextResponse("Internal Server Error", {
            status: 500,
        });
    }
}
