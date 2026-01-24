import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ vehicleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const resolvedParams = await params
    const body = await request.json()
    const { currentMileage } = body

    if (!currentMileage) {
      return new NextResponse("Current mileage is required", { status: 400 })
    }

    // Update vehicle current mileage
    const vehicle = await prisma.vehicle.update({
      where: {
        id: resolvedParams.vehicleId,
        userId: session.user.id,
      },
      data: {
        currentMileage: parseInt(currentMileage),
      },
      include: {
        oilChanges: {
          orderBy: {
            dateOfChange: 'desc'
          },
          take: 1
        }
      }
    })

    // Save to mileage history
    await prisma.mileageHistory.create({
      data: {
        vehicleId: resolvedParams.vehicleId,
        mileage: parseInt(currentMileage),
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("[VEHICLE_MILEAGE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
