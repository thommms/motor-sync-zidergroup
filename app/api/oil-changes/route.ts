import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { vehicleId, mileageAtChange, dateOfChange, notes } = body

    if (!vehicleId || !mileageAtChange) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
        userId: session.user.id,
      }
    })

    if (!vehicle) {
      return new NextResponse("Vehicle not found", { status: 404 })
    }

    const nextChangeDueAt = parseInt(mileageAtChange) + vehicle.oilChangeInterval

    const oilChange = await prisma.oilChange.create({
      data: {
        vehicleId,
        mileageAtChange: parseInt(mileageAtChange),
        dateOfChange: dateOfChange ? new Date(dateOfChange) : new Date(),
        nextChangeDueAt,
        notes: notes || null,
      }
    })

    return NextResponse.json(oilChange)
  } catch (error) {
    console.error("[OIL_CHANGES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
