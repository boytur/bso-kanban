import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type ItemType = { id: string; content: string | null };
type ColumnType = { name: string; items: ItemType[] };
type ColumnsType = { [key: string]: ColumnType };

export async function GET() {
    try {
        const response = await prisma.board.findMany({
            include: {
                columns: {
                    include: {
                        tasks: true
                    }
                }
            }
        });

        // จัดโครงสร้างข้อมูลให้อยู่ในรูปแบบ ColumnsType
        const boardData = response.map(board => {
            const columnsData: ColumnsType = {};

            board.columns.forEach(column => {
                columnsData[column.name.toLowerCase()] = {
                    name: column.name,
                    items: column.tasks.map(task => ({
                        id: task.id,
                        content: task.name,
                    })),
                };
            });

            return {
                id: board.id,
                projectId: board.projectId,
                ownerId: board.ownerId,
                columns: columnsData,
            };
        });

        
        return NextResponse.json({ body: boardData }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", {
            status: 500,
        });
    }
}

export async function POST(req: Request) {
    try {
        const {boardId,order, name } = await req.json();
        const newBoard = await prisma.column.create({
            data: {
                name,
                order,
                boardId,
            },
        });
        return NextResponse.json({ body: newBoard, message: "Created successfully" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", {
            status: 500,
        });
    }
}
