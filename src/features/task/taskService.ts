import { JsonArrIndexOptions } from './../../../node_modules/@redis/json/dist/lib/commands/ARRINDEX.d';
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

export const updateTaskService = async (id: number, title: string, description: string, assigneeId: number, user: User, status: TaskStatus): Promise<any> => { 

    const updateTask = await prisma.task.findUnique({
        where: {
            id
        }
    })

    if (!updateTask) {
        throw new Error("Task not found!");   
    }

    if (updateTask.creatorId !== user.id) {
        throw new Error("You are not authorized to update this task!");
    }

    if (assigneeId) {
        const assignee = await prisma.user.findUnique({
            where: {
                id: assigneeId
            }
        })
        if (!assignee) {
            throw new Error("Assignee ID isn't correct");
            
        }
    }

    const updatedTask = await prisma.task.update({
        where: {
            id
        },
        data: {
            title,
            description,
            assigneeId,
            status,
        }
    })

    if (!updatedTask) {
        throw new Error("Update Task not successfully!");
        
    }

    const { id: idUpdated, title: titleUpdated, description: descriptionUpdated, assigneeId: assigneeIdUpdated, status: statusUpdated } = updatedTask;

    return {
      idUpdated,
      titleUpdated,
      descriptionUpdated,
      assigneeIdUpdated,
      statusUpdated,
    };

}