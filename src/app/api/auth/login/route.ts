/**
 * POST /api/auth/login - Login user
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { generateToken, setAuthCookie, authResponse, authError } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return authError("Email and password are required", 400);
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return authError("Invalid email or password", 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return authError("Invalid email or password", 401);
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    // Set cookie
    await setAuthCookie(token);

    return authResponse({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        verified: user.verified,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return authError("Login failed. Please try again.", 500);
  }
}
