"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useAuth} from "@/context/AuthContext";

export default function LoginPage(){
    const router = useRouter();
    const {login} = useAuth();
    const [email,setEmail] = useState("");
    const [password, setPassword]=useState("");
    const [error, setError]=useState("");
    const [loading, setLoading]=useState(false);

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        setLoading(true);

    try{
        await login(email, password);
        router.push("/products");
    }
    catch(err){
        setError(err.fieldErrors?.[0]?.message || err.message);
    }
    finally{
        setLoading(false)
    }
    }

     return (
    <main className="container">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="auth-switch">
          New here? <Link href="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}