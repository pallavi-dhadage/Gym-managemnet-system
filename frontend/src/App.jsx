import { useEffect, useState } from 'react'
import apiClient from './api/client'

function App() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Test backend connection on app load
    const checkBackendHealth = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/health')
        console.log('Backend health check response:', response.data)
        setHealthStatus(response.data)
        setError(null)
      } catch (err) {
        console.error('Backend health check failed:', err)
        setError(err.message)
        setHealthStatus(null)
      } finally {
        setLoading(false)
      }
    }

    checkBackendHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Gym Management System
        </h1>
        
        <div className="text-center">
          <p className="text-lg text-green-600 font-semibold mb-4">
            ✅ Setup OK
          </p>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Backend Status:
            </h3>
            
            {loading && (
              <p className="text-blue-500">Checking backend...</p>
            )}
            
            {error && (
              <p className="text-red-500">❌ Error: {error}</p>
            )}
            
            {healthStatus && (
              <p className="text-green-500">
                ✅ Connected - {JSON.stringify(healthStatus)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App