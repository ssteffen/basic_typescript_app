import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/users"; // Assuming @ points to src
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Optionally, add more robust validation for email format and password strength here

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 409 } // 409 Conflict is more specific for existing resources
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = createUser({ email, password: hashedPassword });

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.message === "User already exists") {
        // This case should ideally be caught by the check above, 
        // but as a fallback for the createUser function's own check.
        return NextResponse.json({ message: "User already exists." }, { status: 409 });
    }
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
