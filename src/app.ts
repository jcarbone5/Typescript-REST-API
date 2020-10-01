import express, { json } from 'express'
import morgan from 'morgan'

//Routes
import taskRoutes from './routes/task.routes'
import authRoutes from './routes/auth.routes'

class Application {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        this.app.set('port', process.env.PORT || 3000);
    }

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(json());
    }

    routes() {
        this.app.use('/api/tasks', taskRoutes);
        this.app.use('/api/auth', authRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Server on port", this.app.get('port'))
        });
    }
}

export default Application;