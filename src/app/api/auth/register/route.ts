/**
 * POST /api/auth/register - Register a new user
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { generateToken, setAuthCookie, authResponse, authError } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return authError("Username, email, and password are required", 400);
    }

    if (username.length < 3 || username.length > 30) {
      return authError("Username must be between 3 and 30 characters", 400);
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return authError("Username can only contain letters, numbers, and underscores", 400);
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return authError("Please enter a valid email address", 400);
    }

    if (password.length < 8) {
      return authError("Password must be at least 8 characters", 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return authError("Email already registered", 409);
      }
      return authError("Username already taken", 409);
    }

    // Create user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    // Set cookie
    await setAuthCookie(token);

    return authResponse(
      {
        message: "Registration successful",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          verified: user.verified,
          createdAt: user.createdAt,
        },
        token,
      },
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle mongoose validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      const mongooseError = error as unknown as { errors: Record<string, { message: string }> };
      const messages = Object.values(mongooseError.errors)
        .map((e) => e.message)
        .join(", ");
      return authError(messages, 400);
    }

    return authError("Registration failed. Please try again.", 500);
  }
}
