import prisma from "../config/prisma.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import handleError from "../utils/errorHandler.js";

dotenv.config();
const { SECRET_KEY } = process.env;




const login = async (req, res) => {
    try {

        const { username_OR_email, password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username_OR_email },
                    { email: username_OR_email },
                ],
            },
        });

        if (!user) { return handleError(res, 400, 'User not found') };


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) { return handleError(res, 400, 'Invalid credentials') }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: 'user'
            },
            SECRET_KEY,
            {
                expiresIn: "1h",
                algorithm: 'HS512'
            })

        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: 'none',
        })
        res.json({
            msg: "Login successful",
            
        })


    } catch (error) {
        console.log(error);

        handleError(res, 500, 'Failed to login', error);
    }
}

export default login;