import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router()

router.post("/signin", authControllers.loginUser)

router.post("/signup", authControllers.signUpUser)

export const authRoutes = router;