import { httpError } from "../utils/httpError.js";

const USER_LIMIT = Number(process.env.USER_LIMIT) || 1000;
const GLOBAL_LIMIT = Number(process.env.GLOBAL_LIMIT) || 10000;
const today = () => new Date().toISOString().slice(0, 10);
let date = today();
let total = 0;
const perUser = new Map();


export function reserveAiQuota(userId) {
    if(today() !== date){
        date = today();
        total = 0;
        perUser.clear();
    }

    const used = perUser.get(userId) || 0;
    if(used >= USER_LIMIT) throw httpError(429, "User AI quota exceeded");
    if(total >= GLOBAL_LIMIT) throw httpError(429, "Global AI quota exceeded");
    
    perUser.set(userId, used + 1);
    total += 1;
}