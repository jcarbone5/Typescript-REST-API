import { Schema, model, Document } from 'mongoose'

import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

const UserModel = new Schema({
    username: { type: String, unique: true, trim:true },
    email: { type: String, unique: true, trim:true },
    password: { type: String }
});

UserModel.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

UserModel.methods.validatePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model<IUser>('user', UserModel);