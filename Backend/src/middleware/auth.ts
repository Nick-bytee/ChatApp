import User from "../Models/User";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any;
  }

export async function authenticate(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authenticate');
    if (!token) {
      console.log('Token Not Available')
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let user: { userId: number } | string;
    user = jwt.verify(token, 'secretkey') as { userId: number };

    if (typeof user === 'object' && user.userId) {
      const userData = await User.findByPk(user.userId);
      if (userData) {
        req.user = userData;
        return next();
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      throw new Error('Internal Server Error')
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default authenticate