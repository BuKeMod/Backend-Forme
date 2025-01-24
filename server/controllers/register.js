
import prisma from "../config/prisma.js"

import bcrypt from "bcrypt"

import handleError from "../utils/errorHandler.js";


const create = async (req, res) => {
    try {

        const { username, email, password } = req.body
        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: passwordHash,
            },
        });
        res.json({
            msg: "create user success",
            // user
        });
    } catch (error) {

        handleError(res, 500, 'Failed to create user',error)
    }
}


export default create;