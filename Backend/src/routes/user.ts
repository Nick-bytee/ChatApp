import { Router } from "express";

const router = Router()

import {signUpUser} from "../controllers/user"
import { signInUser } from "../controllers/user";

router.post('/addUser', signUpUser )

router.post('/signIn', signInUser)

export default router