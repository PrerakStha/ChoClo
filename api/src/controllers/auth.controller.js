import { registerUser, loginUser, getUserById } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const COOKIE_OPTIONS = {
    httpOnly: true, //js cant read cookie in the page so no attackers
    sameSite: "lax", //doesnt attach cookie on most cross-site req
    secure: process.env.NODE_ENV === "production", //httpOnly in production because localhost runs on http
}

export async function register(req, res) {
    try {
        const user = await registerUser(req.body);
        res.status(201).json(user);
    }
    catch (err) {
        handleError(err, res);
    }
};

export async function login(req, res) {
    try {
        const user = await loginUser(req.body); //user is stored and loginUser function is called to check if the request.body basically the email and password
        const token = jwt.sign({ id: user.id, role: user.role }, // a token is created use userid and userole as payload, which goes through encryption with the JWT secret and expires in 7d
            process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {  //a cookie is created at login and is sent by server to browser
            ...COOKIE_OPTIONS,
            maxAge: COOKIE_MAX_AGE //max time the cookie is active
        });
        res.status(200).json(user)
    }
    catch (err) {
        handleError(err, res);
    }

}

export async function me(req, res){
    try {
        const user = await getUserById(req.user.id);

    if(!user){
        res.clearCookie("token", COOKIE_OPTIONS);
        return res.status(401).json({message: "Not authenticated"})
    }
    res.json(user);
    }
    catch(err){
        handleError(err,res);
    }
}

export function logout(req, res){
    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({message:"Logged out"});
}