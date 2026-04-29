import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { login } from '@/services/auth.service';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 400, parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;
    const result = await login(email, password);

    return successResponse(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    const status = message.includes('Invalid credentials') ? 401 : 500;
    return errorResponse(message, status);
  }
}
