/**
 * POST /api/auth/logout - Logout user
 */
import { clearAuthCookie, authResponse } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();
    return authResponse({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return authResponse({ message: "Logout successful" }); // Still succeed
  }
}
