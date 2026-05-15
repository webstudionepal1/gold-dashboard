import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { signToken, verifyPassword } from "@/lib/auth";
import { omitPassword, withMongoId } from "@/lib/serializers";

export async function handleLogin(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return apiError("Email and password are required", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return apiError("Invalid credentials", 401);
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return apiSuccess({
    token,
    user: withMongoId(omitPassword(user)),
  });
}
