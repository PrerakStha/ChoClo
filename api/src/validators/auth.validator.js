import { z } from "zod";

export const registerSchema = z.object({
    name : z
    .string("name is required")
    .trim()
    .min(2, "Name must have atleast 2 characters")
    .max(50, "Name must be below 50 characters."),

    email : z
    .string("Email is required")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email."),

    password : z
    .string("Password is required.")
    .min(8,"Password should be at least 8 characters")
    .max(72,"Password should be less than 72 characters"),
})

export const loginSchema = z.object({
    email : z
    .string("Email is required")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

    password : z
    .string("Password is required")
    .min(1,"Password is required"),
})