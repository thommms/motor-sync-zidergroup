import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/motorsync.png" 
              alt="MotorSync" 
              width={200}
              height={60}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Never Miss an Oil Change Again
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track oil changes, manage vehicle maintenance, and get automatic reminders for your entire fleet.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-lg font-medium border-2 border-gray-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fleet Management</h3>
            <p className="text-gray-600">
              Track unlimited vehicles with detailed maintenance history and mileage tracking.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Notifications</h3>
            <p className="text-gray-600">
              Get email and SMS alerts when oil changes are due based on time or mileage.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Reports</h3>
            <p className="text-gray-600">
              View complete service history and maintenance records for all your vehicles.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to streamline your vehicle maintenance?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join fleet managers who trust MotorSync to keep their vehicles running smoothly.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 text-lg font-medium shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2025 MotorSync by Zider Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
