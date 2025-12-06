import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const result = await authServices.loginUser(email, password)
        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: result
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const signUpUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signUpUser(req.body);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

export const authControllers ={
    loginUser,
    signUpUser
}