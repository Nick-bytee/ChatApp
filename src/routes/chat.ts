import { Router } from "express";
const router = Router();

import { getAllChat } from "../controllers/chat";
import authenticate from "../middleware/auth";

router.get("/home", authenticate, getAllChat);

export default router;
