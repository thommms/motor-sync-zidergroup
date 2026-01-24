import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!email || !password) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error("[REGISTER_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}