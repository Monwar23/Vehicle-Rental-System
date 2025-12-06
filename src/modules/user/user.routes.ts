import express from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router()

router.get("/", logger, auth("admin"), userControllers.getUser)

router.put("/:id", auth("admin", "user"), userControllers.updateUser)

router.delete("/:id", auth("admin"), userControllers.deleteUser)

export const userRoutes = router;