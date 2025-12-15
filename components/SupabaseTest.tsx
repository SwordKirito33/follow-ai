import React, { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import { addToWaitlist } from '../src/services/waitlistService'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: any
}

const SupabaseTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [overallStatus, setOverallStatus] = useState<'testing' | 'success' | 'error'>('testing')

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    setIsLoading(true)
    const testResults: TestResult[] = []

    try {
      // Test 1: Check Supabase client initialization
      try {
        const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL
        const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing environment variables. Please create .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See ENV_SETUP_GUIDE.md for details.')
        }

        testResults.push({
          name: 'Supabase Client Initialization',
          status: 'success',
          message: '✅ Client initialized successfully',
          details: {
            url: supabaseUrl,
            keyPresent: !!supabaseKey,
            keyLength: supabaseKey.length
          }
        })
      } catch (error) {
        testResults.push({
          name: 'Supabase Client Initialization',
          status: 'error',
          message: `❌ Failed: ${(error as Error).message}`,
          details: error
        })
      }

      // Test 2: Database query (count waitlist entries)
      try {
        const { data, error, count } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })

        if (error) {
          throw error
        }

        testResults.push({
          name: 'Database Connection',
          status: 'success',
          message: `✅ Database connection successful`,
          details: {
            waitlistCount: count || 0,
            canQuery: true
          }
        })
      } catch (error: any) {
        testResults.push({
          name: 'Database Connection',
          status: 'error',
          message: `❌ Database query failed: ${error.message || 'Unknown error'}`,
          details: {
            code: error.code,
            message: error.message,
            hint: error.hint
          }
        })
      }

      // Test 3: Test waitlist service
      try {
        const testEmail = `test-${Date.now()}@example.com`
        const result = await addToWaitlist({
          email: testEmail,
          source: 'connection-test'
        })

        if (result.error) {
          throw result.error
        }

        testResults.push({
          name: 'Waitlist Service',
          status: 'success',
          message: `✅ Waitlist service works`,
          details: {
            email: result.data?.email,
            id: result.data?.id,
            created: result.data?.created_at
          }
        })
      } catch (error) {
        testResults.push({
          name: 'Waitlist Service',
          status: 'error',
          message: `❌ Waitlist service failed: ${(error as Error).message}`,
          details: error
        })
      }

      // Determine overall status
      const hasErrors = testResults.some(r => r.status === 'error')
      setOverallStatus(hasErrors ? 'error' : 'success')
    } catch (error) {
      console.error('Test suite error:', error)
      setOverallStatus('error')
    } finally {
      setIsLoading(false)
      setResults(testResults)
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Supabase Connection Test
            </h1>
            <p className="text-gray-600">
              Testing Supabase client, database connection, and services
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Running tests...</p>
            </div>
          ) : (
            <>
              {/* Overall Status */}
              <div className={`mb-6 p-4 rounded-lg ${
                overallStatus === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {overallStatus === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <h2 className="font-bold text-lg">
                      {overallStatus === 'success' ? 'All Tests Passed!' : 'Some Tests Failed'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {successCount} passed, {errorCount} failed out of {results.length} tests
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {result.name}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">
                          {result.message}
                        </p>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              View details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Retry Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={testConnection}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Run Tests Again
                </button>
              </div>

              {/* Environment Variables Note */}
              {overallStatus === 'error' && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-bold text-amber-900 mb-2">⚠️ Configuration Required</h3>
                  <p className="text-sm text-amber-800 mb-2">
                    If you see "Failed to fetch" errors, you need to configure Supabase environment variables.
                  </p>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p><strong>Steps:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Create <code className="bg-amber-100 px-1 rounded">.env.local</code> file in project root</li>
                      <li>Add your Supabase URL and API key</li>
                      <li>Restart the development server</li>
                    </ol>
                    <p className="mt-2">
                      <strong>See:</strong> <code className="bg-amber-100 px-1 rounded">ENV_SETUP_GUIDE.md</code> for detailed instructions
                    </p>
                  </div>
                </div>
              )}

              {/* Console Note */}
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Check the browser console (Cmd + Option + J) for detailed logs.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupabaseTest

