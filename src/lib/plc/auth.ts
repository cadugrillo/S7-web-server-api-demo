/**
 * PLC Authentication
 *
 * ApiLogin sends a JSON-RPC "Api.Login" request to the S7 Web Server.
 * On success it returns a session token (a string) that must be included in
 * every subsequent API call (PlcProgramRead, AlarmsBrowse, etc.).
 *
 * The token expires, so startPeriodicLogin() re-authenticates every 60 s to
 * keep the session alive — matching the behaviour of the Angular companion app.
 */
import { ApiLogin } from '@siemens/simatic-s7-webserver-api'
import { createPlcConfig } from './config'

/**
 * Authenticate with the PLC and store credentials in sessionStorage.
 * Returns the auth token on success, or null on failure.
 */
export async function loginToPLC(
  plcAddress: string,
  username: string,
  password: string,
): Promise<string | null> {
  const config = createPlcConfig(plcAddress)

  // ApiLogin(config, user, password, use_mode) — use_mode false = standard login
  const login = await new ApiLogin(config, username, password, false).execute()

  if (login?.result) {
    // Persist so every page can read token & address without prop-drilling
    sessionStorage.setItem('authToken', login.result)
    sessionStorage.setItem('plcAddress', plcAddress)
    sessionStorage.setItem('username', username)
    sessionStorage.setItem('password', password)
    return login.result
  }
  return null
}

/** Re-authenticates silently every 60 s to prevent the PLC session from expiring. */
export function startPeriodicLogin(): void {
  const address = sessionStorage.getItem('plcAddress')
  const username = sessionStorage.getItem('username')
  const password = sessionStorage.getItem('password')
  if (!address || !username || !password) return

  setInterval(async () => {
    const result = await loginToPLC(address, username, password)
    if (!result) console.warn('Background token refresh failed.')
  }, 60_000)
}

export const getAuthToken = () => sessionStorage.getItem('authToken')
export const getPlcAddress = () => sessionStorage.getItem('plcAddress') ?? ''
