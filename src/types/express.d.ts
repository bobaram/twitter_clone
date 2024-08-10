import { User } from '../models/user'; // Adjust the path to your User model if needed

declare global {
    namespace Express {
        interface Request {
            user?: User | any; // Adjust the type based on what you store in `req.user`
        }
    }
}
