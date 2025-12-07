import express from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = express.Router()

router.post("/", auth("admin", "customer"), bookingControllers.createBooking)

router.get("/", auth("admin", "customer"), bookingControllers.getBooking)

router.put("/:bookingId", auth("admin", "customer"), bookingControllers.updateBooking)

// router.delete("/:userId", auth("admin"), userControllers.deleteUser)

export const bookingRoutes = router;