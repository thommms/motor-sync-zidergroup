"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type OilChange = {
  id: string
  mileageAtChange: number
  dateOfChange: Date
  nextChangeDueAt: number
  notes: string | null
}

type MileageHistory = {
  id: string
  mileage: number
  createdAt: Date
}

type Vehicle = {
  id: string
  name: string
  make: string | null
  model: string | null
  year: number | null
  licensePlate: string | null
  oilChangeInterval: number
  currentMileage: number | null
  oilChanges: OilChange[]
  mileageHistory: MileageHistory[]
}

export default function VehicleDetailsClient({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter()
  const [showOilChangeModal, setShowOilChangeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [oilChangeData, setOilChangeData] = useState({
    mileageAtChange: "",
    dateOfChange: new Date().toISOString().split('T')[0],
    notes: "",
  })

  const lastOilChange = vehicle.oilChanges[0]
  const milesUntilNext = lastOilChange && vehicle.currentMileage
    ? lastOilChange.nextChangeDueAt - vehicle.currentMileage
    : null
  const needsService = milesUntilNext !== null && milesUntilNext <= 200

  const handleOilChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/oil-changes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          ...oilChangeData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to record oil change")
      }

      setShowOilChangeModal(false)
      setOilChangeData({
        mileageAtChange: "",
        dateOfChange: new Date().toISOString().split('T')[0],
        notes: "",
      })
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this vehicle? This cannot be undone.")) {
      return
    }

    try {
      const response = await fetch("/api/vehicles/" + vehicle.id, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete vehicle")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      alert("Failed to delete vehicle")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
                {(vehicle.make || vehicle.model || vehicle.year) && (
                  <p className="text-sm text-gray-500">
                    {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/vehicles/" + vehicle.id + "/edit")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Current Status</h2>
                <button
                  onClick={() => setShowOilChangeModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Record Oil Change
                </button>
              </div>

              {lastOilChange ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Last Oil Change</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {lastOilChange.mileageAtChange.toLocaleString()} miles
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(lastOilChange.dateOfChange).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Next Due At</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {lastOilChange.nextChangeDueAt.toLocaleString()} miles
                      </p>
                      {milesUntilNext !== null && (
                        <p className={`text-sm font-medium mt-1 ${needsService ? 'text-yellow-600' : 'text-green-600'}`}>
                          {milesUntilNext > 0 
                            ? `${milesUntilNext.toLocaleString()} miles remaining`
                            : `${Math.abs(milesUntilNext).toLocaleString()} miles overdue`}
                        </p>
                      )}
                    </div>
                  </div>

                  {needsService && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="font-medium text-yellow-900">Oil Change Due Soon</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            This vehicle is within 200 miles of its next scheduled oil change.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No oil changes recorded yet</p>
                  <button
                    onClick={() => setShowOilChangeModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Record First Oil Change
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Oil Change History</h2>
              {vehicle.oilChanges.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.oilChanges.map((change) => (
                    <div key={change.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {change.mileageAtChange.toLocaleString()} miles
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(change.dateOfChange).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Next due</p>
                          <p className="text-sm font-medium text-gray-900">
                            {change.nextChangeDueAt.toLocaleString()} miles
                          </p>
                        </div>
                      </div>
                      {change.notes && (
                        <p className="text-sm text-gray-600 mt-2">{change.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No oil change history available</p>
              )}
            </div>

            {vehicle.mileageHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mileage Updates</h2>
                <div className="space-y-3">
                  {vehicle.mileageHistory.map((history, index) => (
                    <div key={history.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {history.mileage.toLocaleString()} miles
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(history.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
              <dl className="space-y-3">
                {vehicle.make && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Make</dt>
                    <dd className="text-sm text-gray-900">{vehicle.make}</dd>
                  </div>
                )}
                {vehicle.model && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                    <dd className="text-sm text-gray-900">{vehicle.model}</dd>
                  </div>
                )}
                {vehicle.year && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Year</dt>
                    <dd className="text-sm text-gray-900">{vehicle.year}</dd>
                  </div>
                )}
                {vehicle.licensePlate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">License Plate</dt>
                    <dd className="text-sm text-gray-900">{vehicle.licensePlate}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Oil Change Interval</dt>
                  <dd className="text-sm text-gray-900">{vehicle.oilChangeInterval.toLocaleString()} miles</dd>
                </div>
                {vehicle.currentMileage && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current Mileage</dt>
                    <dd className="text-sm text-gray-900">{vehicle.currentMileage.toLocaleString()} miles</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </main>

      {showOilChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Oil Change</h3>
            
            <form onSubmit={handleOilChangeSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="mileageAtChange" className="block text-sm font-medium text-gray-700">
                  Current Mileage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="mileageAtChange"
                  required
                  value={oilChangeData.mileageAtChange}
                  onChange={(e) => setOilChangeData({ ...oilChangeData, mileageAtChange: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 45000"
                />
              </div>

              <div>
                <label htmlFor="dateOfChange" className="block text-sm font-medium text-gray-700">
                  Date of Change
                </label>
                <input
                  type="date"
                  id="dateOfChange"
                  value={oilChangeData.dateOfChange}
                  onChange={(e) => setOilChangeData({ ...oilChangeData, dateOfChange: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={oilChangeData.notes}
                  onChange={(e) => setOilChangeData({ ...oilChangeData, notes: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOilChangeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
