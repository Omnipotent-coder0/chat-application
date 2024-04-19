import { Router } from "express";
import { getAllUsers } from "../controllers/user.controllers.mjs";

const router = Router();

// router.post("/", createUser);
router.get("/", getAllUsers);

export default router;
