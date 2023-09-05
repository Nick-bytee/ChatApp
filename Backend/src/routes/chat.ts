import { Router } from "express";
const router = Router()

import { getAllChat } from "../controllers/chat";

router.get('/home', getAllChat)

export default router