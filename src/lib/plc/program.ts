/**
 * PLC Program Variable Read / Write
 *
 * PlcProgramRead  → JSON-RPC method "PlcProgram.Read"
 *   - execute()      reads a single PLC variable by symbolic name
 *   - bulkExecute()  reads N variables in one HTTP round-trip (JSON-RPC batch)
 *
 * PlcProgramWrite → JSON-RPC method "PlcProgram.Write"
 *   - execute()      writes a value to a single PLC variable
 *
 * Variable names use TIA Portal symbolic notation, e.g. '"web2plc".tankLevel'
 * (the outer double-quotes are part of the TIA Portal DB name syntax).
 */
import { PlcProgramRead, PlcProgramWrite, type RequestConfig } from '@siemens/simatic-s7-webserver-api'

/** Read a single named variable from the PLC. */
export function readVariable(config: RequestConfig, token: string, varName: string) {
  return new PlcProgramRead(config, token, varName).execute()
}

/**
 * Read multiple variables in a single HTTP request.
 * Each param is { var: '<TIA name>', mode?: 'simple' | 'raw' }.
 * Responses are returned in the same order as params.
 */
export function readVariablesBulk(
  config: RequestConfig,
  token: string,
  params: { var: string; mode?: string }[],
) {
  // An empty var string signals to the library that this is a bulk-only request
  return new PlcProgramRead(config, token, '').bulkExecute(params)
}

/** Write a value to a named PLC variable (e.g. start/stop commands, setpoints). */
export function writeVariable(config: RequestConfig, token: string, varName: string, value: unknown) {
  return new PlcProgramWrite(config, token, varName, value).execute()
}
