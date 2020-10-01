import { Router, Request, Response } from 'express'
import { validateToken } from '../libs/validateToken'
import jwt from 'jsonwebtoken'

//Model
import UserModel, { IUser } from '../models/user.model'

class AuthRoute {
    public router: Router;
    
    constructor() {
        this.router = Router();
        this.routes();
    }

    async signUp(req: Request, res: Response) {
        const { username, email, password } = req.body;

        try {            
            const usernameExist = await UserModel.findOne({ username });
            if(usernameExist) return res.status(400).json({ mesasge: "Username already exist" });

            const emailExist = await UserModel.findOne({ email });
            if(emailExist) return res.status(400).json({ mesasge: "Email already exist" });

            const newUser: IUser = new UserModel({
                username,
                email,
                password
            });

            newUser.password = await newUser.encryptPassword(password);

            await newUser.save();

            //Token
            const token: string = jwt.sign({ id: newUser._id }, 'secret-rest-api-ts', {
                expiresIn: 60 * 60 * 24
            });

            res.json(token);

        } catch (error) {
            res.status(500).json({Message: 'Server error'});
        }
    }

    async signIn(req: Request, res: Response) {
        const { email, password } = req.body;
        
        try {
            const user = await UserModel.findOne({ email });
            if(!user) return res.status(400).json({message: 'Email not found'})

            const validatePassword = await user.validatePassword(password);
            if(!validatePassword) return res.status(400).json({message: 'Invalid password'});

            //Token
            const token: string = jwt.sign({ id: user._id }, 'secret-rest-api-ts', {
                expiresIn: 60 * 60 * 24
            });

            res.json(token);
        } catch (error) {
            res.status(500).json({Message: 'Server error'});
        }
    }

    async profile(req: any, res: Response) {
        try {
            const user = await UserModel.findById(req.userId, { password: 0 });
            res.json(user);
        } catch (error) {
            res.status(500).json({Message: 'Server error'});
        }
    }

    routes() {
      this.router.post('/signup', this.signUp); 
      this.router.post('/signin', this.signIn);  
      this.router.get('/profile', validateToken, this.profile);  
    }
}

const authRoutes = new AuthRoute();
export default authRoutes.router;