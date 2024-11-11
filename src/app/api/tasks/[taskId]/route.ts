import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Reorders tasks in a given column by decrementing the order
 * of tasks greater than the specified order.
 * @param columnId - The ID of the column to reorder tasks in.
 * @param order - The starting order from which to decrement subsequent tasks.
 */
async function reorderTasksInColumn(columnId: string, order: number) {
    await prisma.task.updateMany({
        where: { 
            columnId, 
            order: { gt: order }
        },
        data: { order: { decrement: 10 } },
    });
}

/**
 * PATCH handler to update the position of a task within a column or move it to a new column.
 * @param req - The request object.
 * @param params - Contains the taskId parameter.
 * @returns A NextResponse object indicating success or error status.
 */
export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { columnId, order } = await req.json();
        const { taskId } = params;

        // Retrieve the task by its ID
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) {
            return new NextResponse("Task not found", { status: 404 });
        }

        const newOrder = order * 10;
        
        if (task.columnId !== columnId) {
            // Moving task to a new column
            await prisma.task.updateMany({
                where: {
                    columnId,
                    order: { gte: newOrder },
                },
                data: { order: { increment: 10 } },
            });

            await prisma.task.update({
                where: { id: taskId },
                data: { columnId, order: newOrder },
            });

            // Reorder tasks in the old column after the task has been moved
            await reorderTasksInColumn(task.columnId, task.order);

        } else {
            // Reordering task within the same column
            if (newOrder > task.order) { 
                // Moving task down
                await prisma.task.updateMany({
                    where: {
                        columnId,
                        order: { gt: task.order, lte: newOrder },
                    },
                    data: { order: { decrement: 10 } },
                });
            } else if (newOrder < task.order) { 
                // Moving task up
                await prisma.task.updateMany({
                    where: {
                        columnId,
                        order: { gte: newOrder, lt: task.order },
                    },
                    data: { order: { increment: 10 } },
                });
            }

            // Update the order of the task being moved
            await prisma.task.update({
                where: { id: taskId },
                data: { order: newOrder },
            });
        }

        return NextResponse.json({ message: "Task reordered successfully" });
    } catch (error) {
        console.error("Error reordering task:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
