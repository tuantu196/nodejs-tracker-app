import { Request, Response } from "express";
import prisma from "../../config/prismaClient";
import { TaskStatus } from "../../generated/prisma";
import { createTaskService, deleteTaskService, getListTasksService, getTaskDetailService } from "./taskService";


export const createTask = async (req: Request, res: Response): Promise<any> => {
    const { title, description, assigneeId } = req.body;
    
    try {
      const create = await createTaskService(
        title,
        description,
        assigneeId,
        req.user
      );
      return res.success("Task created successfully!", create);
    } catch (error) {
      return res.failure(String(error), 400);
    }
}

export const listTasks = async (req: Request, res: Response): Promise<any> => { 
    try {
        const listTasks = await getListTasksService()
        return res.success("", listTasks);
    } catch (error) {
        return res.failure(String(error), 400);
    }
}

export const getTaskDetail = async (req: Request, res: Response): Promise<any> => { 
    const taskID = req.params.id
    try {
        const task = await getTaskDetailService(taskID)
        return res.success("", task)
    } catch (error) {
        return res.failure("Something went wrong!", 400)
    }
}

export const updateTask = async (req: Request, res: Response) : Promise<any>=> { 
    return res.status(200).json({ message: "Task created successfully" });
}

export const deleteTask = async (req: Request, res: Response): Promise<any> => { 
    const taskID = req.params.id

    try {
        const deleteTask = await deleteTaskService(taskID);
        return res.success("Delete Task successfully", deleteTask)
    } catch (error) {
        return res.failure("Something went wrong!", 400)
    }
}