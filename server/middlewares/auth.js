import jwt from "jsonwebtoken"
import handleError from "./errorHandler.js";
import dotenv from "dotenv"
dotenv.config();
const { SECRET_KEY } = process.env;

const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        
        if (!token) {

            return handleError(res, 401, 'Access denied. No token');

        }


        const result_decode = jwt.verify(token, SECRET_KEY);

        req.user = result_decode;
        next();
    } catch (error) {
        handleError(res, 403, 'Invalid or expired token', error);
    }
}

export default authenticateToken;