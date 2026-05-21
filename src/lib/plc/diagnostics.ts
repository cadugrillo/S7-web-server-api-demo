/**
 * PLC Diagnostic Buffer
 *
 * DiagnosticBufferBrowse → JSON-RPC "DiagnosticBuffer.Browse"
 *   Returns internal PLC diagnostic events: CPU state changes, program errors,
 *   hardware faults, etc.  Text descriptions are returned in the requested language
 *   (must match a language configured in the TIA Portal project).
 *
 * The optional Filters object selects which text fields to include:
 *   short_text, long_text, help_text — request only what the UI shows.
 */
import {
  DiagnosticBufferBrowse,
  type RequestConfig,
  type Filters,
} from '@siemens/simatic-s7-webserver-api'

export function browseDiagnosticBuffer(
  config: RequestConfig,
  token: string,
  language = 'en-US',
  filters?: Filters,
) {
  // count is mandatory before filters; pass undefined to use the PLC default
  return new DiagnosticBufferBrowse(config, token, language, undefined, filters).execute()
}
