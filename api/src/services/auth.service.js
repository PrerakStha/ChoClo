import bcrypt from "bcrypt";
import prisma from "../config/db.js";

const SALT_ROUNDS = 12;

// used to keep login timing similar when the email doesn't exist
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", SALT_ROUNDS);

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function registerUser({ name, email, password }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw httpError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    return await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  } catch (err) {
    if (err.code === "P2002") {
      throw httpError(409, "Email already exists");
    }
    throw err;
  }
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // always run a compare, so both failure cases take similar time
  const hashToCheck = user ? user.passwordHash : DUMMY_HASH;
  const isPasswordValid = await bcrypt.compare(password, hashToCheck);

  if (!user || !isPasswordValid) {
    throw httpError(401, "Invalid email or password");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function getUserById(id){
  return prisma.user.findUnique({
    where: {id},
    select: {id:true, name:true, email:true, role:true, createdAt:true},
  });
}