import { Router } from "express";

const router = Router()

import {signUpUser} from "../controllers/user"

router.post('/addUser', signUpUser )

export default router