import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "laura_fancy_jwt_secret_key_2026";

export function signJwt(payload: any, expiresIn: string | number = "24h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyJwt(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getAdminUserFromRequest(request: Request): { id: string; email: string; role: string } | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const decoded = verifyJwt(token);
  if (!decoded || decoded.role !== "admin") return null;

  return decoded;
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
