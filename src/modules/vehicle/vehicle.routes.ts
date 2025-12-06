import express from "express";
import auth from "../../middleware/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = express.Router()

router.post("/", auth("admin"), vehicleControllers.createVehicle)

router.get("/", vehicleControllers.getVehicle)

router.get("/:id", vehicleControllers.getSingleVehicle)

router.put("/:id", auth("admin"), vehicleControllers.updateVehicle)

router.delete("/:id", auth("admin"), vehicleControllers.deleteVehicle)

export const vehicleRoutes = router;