import prisma from "../../config/prismaClient";
import { TaskStatus, User } from "../../generated/prisma";

export const createTaskService = async (title: string, description: string, assigneeId: number, user: User): Promise<any> => { 
    const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
    
      if (assignee) {
        const task = prisma.task.create({
          data: {
            title,
            description,
            creatorId: user.id,
            assigneeId,
            status: TaskStatus.UNSTARTED,
          },
        });
    
        const { title: taskTitle, description: taskDescription, id } = await task;
    
        return {
          id,
          taskTitle,
          taskDescription,
        };
      } else {
          throw new Error("Assignee ID isn't correct")
      }
}

export const getListTasksService = async () => {
    const tasks = prisma.task.findMany({
        orderBy: {
            createdAt:"desc"
        }
    })
    return tasks
}

export const getTaskDetailService = async (taskID: string) => {
    const task = await prisma.task.findFirst({
        where: {
            id: parseInt(taskID)
        }
    })
    if (task) {
        return task
    } else {
        throw new Error("Something went wrong!")
    }
}

export const deleteTaskService = async (taskID: string) => {
    const deleteTask = await prisma.task.delete({
        where: {
            id: parseInt(taskID),
        }
    })
    if (deleteTask) {
        return deleteTask
    } else {
        throw new Error("Something went wrong!")
    }
}

export const updateTaskService = async (title: string, description: string, assigneeId: number, user: User): Promise<any> => { 
    
}