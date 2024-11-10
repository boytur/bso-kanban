import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ฟังก์ชันสำหรับกำหนด order ใหม่ให้กับ tasks ทั้งหมดใน column
async function reorderTasksInColumn(columnId: string) {
    const tasks = await prisma.task.findMany({
        where: { columnId },
        orderBy: { order: 'asc' },
    });

    for (let i = 0; i < tasks.length; i++) {
        await prisma.task.update({
            where: { id: tasks[i].id },
            data: { order: (i + 1) * 10 }, // กำหนดค่า order ใหม่ทีละ 10 เพื่อลดปัญหาการชน
        });
    }
}

// ฟังก์ชัน PATCH สำหรับอัปเดตตำแหน่งของ task
export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { columnId, order } = await req.json();
        const { taskId } = await params;

        // ตรวจสอบว่า task ย้ายไป column ใหม่หรือไม่
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) {
            return new NextResponse("Task not found", { status: 404 });
        }

        if (task.columnId !== columnId) {
            // ย้าย task ไป column ใหม่และรีลำดับ tasks ใน column นั้น
            await prisma.task.update({
                where: { id: taskId },
                data: { columnId, order: (order * 10) },
            });
            await reorderTasksInColumn(columnId);
        } else {
            // ย้าย task ภายใน column เดิม
            if (order > task.order) {
                // เลื่อนลงล่าง tasks ที่อยู่ระหว่าง order ของ task
                await prisma.task.updateMany({
                    where: {
                        columnId,
                        order: { gt: task.order, lte: order },
                    },
                    data: { order: { decrement: 10 } },
                });
            } else if (order < task.order) {
                // เลื่อนขึ้นบน tasks ที่อยู่ระหว่าง order ของ task
                await prisma.task.updateMany({
                    where: {
                        columnId,
                        order: { gte: order, lt: task.order },
                    },
                    data: { order: { increment: 10 } },
                });
            }

            // อัปเดต order ของ task ที่กำลังย้าย
            await prisma.task.update({
                where: { id: taskId },
                data: { order: order * 10 },
            });
        }

        return NextResponse.json({ message: "Task reordered successfully" });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
