import jwt from "jsonwebtoken";

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

export function requireAdmin(req,res,next){
    if(req.user?.role!=="admin"){
        return res.status(401).json({message: "Not an admin."})
    }
next();
}