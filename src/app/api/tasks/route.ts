import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type ItemType = { id: string; content: string | null };
type ColumnType = { name: string; items: ItemType[] };
type ColumnsType = { [key: string]: ColumnType };

export async function POST(req: Request) {
    try {
        const {name, columnId, order } = await req.json();
        
        const newBoard = await prisma.task.create({
            data: {
                name,
                columnId,
                order: order,
            },
        });
        return NextResponse.json({ body: newBoard, message: "Created successfully" }, { status: 201 });
    } catch (error) {
        return new NextResponse("Internal Server Error", {
            status: 500,
        });
    }
}