import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EditVehicleClient from "./EditVehicleClient"

export default async function EditVehiclePage({
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
    }
  })

  if (!vehicle) {
    redirect("/dashboard")
  }

  return <EditVehicleClient vehicle={vehicle} />
}
