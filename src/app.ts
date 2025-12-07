import express, { NextFunction, Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
// import { todoRoutes } from "./modules/todo/todo.routes";

const app = express()

// initializing DB
initDB()

app.use(express.json())
// app.use(express.urlencoded())


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/vehicles", vehicleRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/auth", authRoutes)

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Page not found",
        data: req.path
    })

})

export default app;