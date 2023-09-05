import { Router } from "express";
const router = Router()

import { getAllChat } from "../controllers/chat";
import { storeChat } from "../controllers/chat";
import authenticate from "../middleware/auth";

router.get('/home', getAllChat)
router.post('/sendChat', authenticate ,storeChat)

export default router