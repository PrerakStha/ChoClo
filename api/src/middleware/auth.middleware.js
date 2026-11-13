import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { handleError } from "../utils/handleError.js";

export function requireAuth(req,res,next){
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({message: "not authenticated"})
    }
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch{
        return res.status(401).json({message: "not authenticated"})
    }
    req.user = payload;
    next();
}

export async function requireAdmin(req,res,next){
    try{
        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
            select: {role: true},
        })

        if (!user || user.role!== "admin"){
            return res.status(403).json({message: "Forbidden"})
        }
        next();
    }
    
    catch(error){
        handleError(error,res);
    }
    

}