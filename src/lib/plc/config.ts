/**
 * PLC Connection Configuration
 *
 * RequestConfig is the base configuration object required by every class in the
 * simatic-s7-webserver-api library. It tells the library where the PLC is (address),
 * which protocol to use (https), and whether to verify the TLS certificate.
 *
 * Siemens PLCs use self-signed certificates, so verifyTls is set to false.
 */
import { RequestConfig } from '@siemens/simatic-s7-webserver-api'

export function createPlcConfig(address: string): RequestConfig {
  const config = new RequestConfig()
  config.address = address
  config.protocol = 'https'
  config.verifyTls = false   // S7 web server uses a self-signed cert
  return config
}
