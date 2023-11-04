import { Router } from "express";
const router = Router()

import authenticate from "../middleware/auth";
import { createGroup, joinGroup, updateGroupInfo } from "../controllers/group";
import { getGroups } from "../controllers/group";
import { getGroupChat } from "../controllers/group";
import { getGroupInfo } from "../controllers/group";

router.post('/createGroup', authenticate, createGroup)

router.get('/getGroups', authenticate, getGroups)

router.get('/getChat/:id',authenticate, getGroupChat)

router.get('/getInfo/:id', authenticate, getGroupInfo)

router.post('/updateGroupInfo', authenticate, updateGroupInfo)

router.post('/joinGroup', authenticate, joinGroup)
export default router