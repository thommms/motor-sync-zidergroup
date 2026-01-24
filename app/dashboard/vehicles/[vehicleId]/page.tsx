import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import VehicleDetailsClient from "./VehicleDetailsClient"

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
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
      },
      mileageHistory: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!vehicle) {
    redirect("/dashboard")
  }

  return <VehicleDetailsClient vehicle={vehicle} />
}
