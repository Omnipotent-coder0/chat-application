import { Router } from "express";
import {
  login,
  logout,
  signup,
  status,
} from "../controllers/auth.controllers.mjs";
import { userValidationShcema } from "../utils/validationShcemas.mjs";
import { checkSchema } from "express-validator";

const router = Router();

router.post("/signup", checkSchema(userValidationShcema), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/status", status);

export default router;
