/**
 * PLC Alarms
 *
 * AlarmsBrowse    → JSON-RPC "Alarms.Browse"
 *   Returns the active alarm list. The Filters object selects which alarm
 *   attributes the PLC includes in the response (reduces payload size).
 *
 * AlarmsAcknowledge → JSON-RPC "Alarms.Acknowledge"
 *   Acknowledges a specific alarm by its ID. Only alarms with
 *   acknowledgement == true can be acknowledged.
 */
import {
  AlarmsBrowse,
  AlarmsAcknowledge,
  type RequestConfig,
  type Filters,
} from '@siemens/simatic-s7-webserver-api'

export function browseAlarms(
  config: RequestConfig,
  token: string,
  language = 'en-US',
  filters?: Filters,
) {
  // Positional args: (config, token, language, count?, alarm_id?, filters?)
  return new AlarmsBrowse(config, token, language, undefined, undefined, filters).execute()
}

export function acknowledgeAlarm(config: RequestConfig, token: string, alarmId: string) {
  return new AlarmsAcknowledge(config, token, alarmId).execute()
}
