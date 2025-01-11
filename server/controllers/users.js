import prisma from '../config/prisma.js';
import handleError from '../utils/errorHandler.js';

export const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // รับข้อมูล User ID จาก Token ที่ Middleware เพิ่มเข้าไปใน req.user
        const user = await prisma.user.findUnique({
            where: { id: userId }, // ค้นหา User ตาม ID
            select: {              // เลือกเฉพาะข้อมูลที่ต้องการ
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            
            return handleError(res,404,'User not found');
        }

        res.json(user); // ส่งข้อมูลผู้ใช้กลับไป
    } catch (error) {

        handleError(res,500,'Failed to retrieve user details.');
    }
};
