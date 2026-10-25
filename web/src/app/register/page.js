
"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {api} from "@/lib/api";


export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });

  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors([]);
    setLoading(true);


    try {
      await api("/api/auth/register", { method: "POST", body: form });
      router.push("/login");
    } catch (err) {
      if (err.fieldErrors?.length > 0) {
        setFieldErrors(err.fieldErrors);
      } else {
        setError(err.message);
      }

    }
    finally {
      setLoading(false);
    }
  }

  const fieldError = (name) => fieldErrors.find((e)=>e.field === name)?. message;

  return (
    <main className="container">
      <div className="auth-card">
        <h1>Join ChoClo</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
            {fieldError("name") && <p className="field-error">{fieldError("name")}</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {fieldError("email") && <p className="field-error">{fieldError("email")}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
            {fieldError("password") && <p className="field-error">{fieldError("password")}</p>}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
