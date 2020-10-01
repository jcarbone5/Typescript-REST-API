import { Router, Request, Response } from 'express'
import { validateToken } from '../libs/validateToken'

//Model
import TaskModel from '../models/task.model'

class TaskRoute {
    public router: Router;
    
    constructor() {
        this.router = Router();
        this.routes();
    }

    async getTasks(req: any, res: Response) {
        const tasks = await TaskModel.find({ user: req.userId }).populate('user', { password: 0 });
        res.json(tasks);
    }

    async getTask(req: Request, res: Response) {
        const { id } = req.params;
        
        const task = await TaskModel.findById(id);
        res.json(task);
    }

    async createTask(req: Request, res: Response) {
        const task = await TaskModel.create(req.body)
        res.json(task);
    }

    async removeTask(req: Request, res: Response) {
        const { id } = req.params;

        await TaskModel.remove({ _id: id });
        res.json({ message: 'Task deleted' });
    }

    async updateTask(req: Request, res: Response) {
        const { id } = req.params;

        const task = await TaskModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Task updated', task });
    }

    routes() {
        this.router.get('/', validateToken, this.getTasks);
        this.router.get('/:id', validateToken, this.getTask);
        this.router.post('/', validateToken, this.createTask);
        this.router.delete('/:id', validateToken, this.removeTask);
        this.router.put('/:id', validateToken, this.updateTask);
    }
}

const taskRoutes = new TaskRoute();
export default taskRoutes.router;