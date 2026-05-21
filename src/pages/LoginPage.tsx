/**
 * LoginPage
 *
 * Collects PLC address, username, and password, then calls loginToPLC() from
 * the simatic-s7-webserver-api auth layer.
 *
 * On success:
 *   1. The auth token and credentials are stored in sessionStorage.
 *   2. startPeriodicLogin() is started to refresh the token every 60 s.
 *   3. The user is redirected to the dashboard.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginToPLC, startPeriodicLogin } from '@/lib/plc/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const navigate = useNavigate()
  const [plcAddress, setPlcAddress] = useState('')
  const [username,   setUsername]   = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // loginToPLC sends ApiLogin to the PLC — returns token or null
      const token = await loginToPLC(plcAddress, username, password)

      if (token) {
        // Keep the session alive with periodic re-authentication
        startPeriodicLogin()
        navigate('/dashboard/tank-overview')
      } else {
        setError('Login failed. Check your PLC address and credentials.')
      }
    } catch (err) {
      setError(`Connection error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img src="/assets/SIEMENS_Logo.png" alt="Siemens" className="h-12 object-contain" />
          <h1 className="text-2xl font-semibold tracking-tight">S7 Web Server Demo</h1>
          <p className="text-sm text-muted-foreground text-center">
            React · Vite · simatic-s7-webserver-api
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connect to PLC</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="plcAddress">PLC IP Address</Label>
                <Input
                  id="plcAddress"
                  placeholder="192.168.0.1"
                  value={plcAddress}
                  onChange={e => setPlcAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connecting…' : 'Connect'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
