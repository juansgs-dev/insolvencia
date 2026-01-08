import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en el entorno (.env)")
  }
  return new TextEncoder().encode(secret)
}

export interface JWTPayload {
  sub: string
  email: string
  rolId: string
  roleName: string
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({
    email: payload.email,
    rolId: payload.rolId,
    roleName: payload.roleName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub) // 🔥 AQUÍ
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret())

  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      rolId: payload.rolId as string,
      roleName: payload.roleName as string,
    }
  } catch (error) {
    console.error("Error verificando token:", error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
