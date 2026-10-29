"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api("api/auth/me")
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);


    async function login(email, password) {
        const loggedIn = await api("/api/auth/login",
            {
                method: "POST",
                body: { email, password }
            });
        setUser(loggedIn);
        return loggedIn
    }

    async function logout() {
        await api("api/auth/logout", { method: "POST" });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}
