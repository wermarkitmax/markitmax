// Server-side authentication utilities
// This file should only be imported in server contexts (.server.ts, server functions)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const SALT_ROUNDS = 10;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwt(userId: string): string {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyJwt(token: string): { sub: string } {
  return jwt.verify(token, getJwtSecret()) as { sub: string };
}

export async function hasUsers(): Promise<boolean> {
  const count = await prisma.user.count();
  return count > 0;
}

export async function setupAdmin(
  email: string,
  password: string,
  fullName: string,
) {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    throw new Error("Admin already setup");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashed,
        fullName: fullName || email.split("@")[0],
      },
    });

    await tx.profile.create({
      data: {
        id: newUser.id,
        fullName: fullName || email.split("@")[0],
        email,
      },
    });

    await tx.userRole.create({
      data: {
        userId: newUser.id,
        role: "admin",
      },
    });

    return newUser;
  });

  const token = signJwt(user.id);
  return { token, userId: user.id };
}

export async function createEmployee(
  email: string,
  password: string,
  fullName: string,
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashed,
        fullName: fullName || email.split("@")[0],
      },
    });

    await tx.profile.create({
      data: {
        id: newUser.id,
        fullName: fullName || email.split("@")[0],
        email,
      },
    });

    await tx.userRole.create({
      data: {
        userId: newUser.id,
        role: "employee",
      },
    });

    return newUser;
  });

  return { userId: user.id };
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = signJwt(user.id);
  return { token, userId: user.id };
}

export async function getUserFromToken(token: string) {
  try {
    const payload = verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, fullName: true },
    });
    if (!user) return null;

    const [profile, roles] = await Promise.all([
      prisma.profile.findUnique({
        where: { id: user.id },
        select: { fullName: true, email: true, avatarUrl: true },
      }),
      prisma.userRole.findMany({
        where: { userId: user.id },
        select: { role: true },
      }),
    ]);

    const role = roles.find((r) => r.role === "admin")
      ? "admin"
      : (roles[0]?.role ?? "employee");

    return { user, profile, role };
  } catch {
    return null;
  }
}
