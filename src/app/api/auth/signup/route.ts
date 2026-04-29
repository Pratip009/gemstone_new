import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { signup } from '@/services/auth.service';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 400, parsed.error.flatten().fieldErrors);
    }

    const { name, email, password } = parsed.data;
    const result = await signup(name, email, password);

    return successResponse(result, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signup failed';
    const status = message.includes('already registered') ? 409 : 500;
    return errorResponse(message, status);
  }
}
