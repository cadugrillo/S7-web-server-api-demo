/**
 * PLC Syslog Buffer
 *
 * SyslogBrowse → JSON-RPC "Syslog.Browse"
 *   Returns raw system log entries from the S7 Web Server.
 *   Useful for low-level debugging of the PLC's web server layer.
 *
 * The response includes count_total and count_lost so the UI can show
 * whether any log entries were dropped (ring-buffer overflow).
 */
import { SyslogBrowse, type RequestConfig } from '@siemens/simatic-s7-webserver-api'

export function browseSyslog(config: RequestConfig, token: string) {
  return new SyslogBrowse(config, token).execute()
}
