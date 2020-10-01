import { Schema, model, Document } from 'mongoose'

export interface ITask extends Document {
    title: string;
    description: string;
    done: boolean;
    user: string
};

const TaskModel = new Schema({
    title: String,
    description: String,
    done: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
}, {
    timestamps: true
});

export default model<ITask>('task', TaskModel);