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
    const { name, make, model, year, licensePlate, oilChangeInterval } = body

    if (!name) {
      return new NextResponse("Vehicle name is required", { status: 400 })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: session.user.id,
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
    console.error("[VEHICLES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: session.user.id
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

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("[VEHICLES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
