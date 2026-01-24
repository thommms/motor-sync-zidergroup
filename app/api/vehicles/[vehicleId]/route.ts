import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ vehicleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const resolvedParams = await params

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: resolvedParams.vehicleId,
        userId: session.user.id,
      },
      include: {
        oilChanges: {
          orderBy: {
            dateOfChange: 'desc'
          }
        }
      }
    })

    if (!vehicle) {
      return new NextResponse("Vehicle not found", { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("[VEHICLE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ vehicleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const resolvedParams = await params

    await prisma.vehicle.delete({
      where: {
        id: resolvedParams.vehicleId,
        userId: session.user.id,
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[VEHICLE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

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
    const { name, make, model, year, licensePlate, oilChangeInterval } = body

    const vehicle = await prisma.vehicle.update({
      where: {
        id: resolvedParams.vehicleId,
        userId: session.user.id,
      },
      data: {
        name,
        make: make || null,
        model: model || null,
        year: year ? parseInt(year) : null,
        licensePlate: licensePlate || null,
        oilChangeInterval: oilChangeInterval ? parseInt(oilChangeInterval) : 3000,
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("[VEHICLE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
