/**
 * useAlarms — fetches active alarms and provides an acknowledge action.
 *
 * Mirrors AlarmsComponent from the Angular app.
 *
 * simatic-s7-webserver-api usage:
 *   • AlarmsBrowse.execute()    (via browseAlarms)       — fetch alarm list with attribute filters
 *   • AlarmsAcknowledge.execute() (via acknowledgeAlarm) — acknowledge a specific alarm by ID
 *
 * The Filters object requests only the attributes the UI needs, minimising response size.
 */
import { useState, useEffect, useCallback } from 'react'
import type { EntryAlarm, Filters } from '@siemens/simatic-s7-webserver-api'
import { createPlcConfig } from '@/lib/plc/config'
import { browseAlarms, acknowledgeAlarm } from '@/lib/plc/alarms'

export function useAlarms() {
  const address = sessionStorage.getItem('plcAddress') ?? ''
  const token   = sessionStorage.getItem('authToken') ?? ''

  const [entries, setEntries] = useState<EntryAlarm[]>([])
  const [countCurrent, setCountCurrent] = useState(0)
  const [countMax, setCountMax] = useState(0)
  const [lastModified, setLastModified] = useState('')
  const [ackMessage, setAckMessage] = useState('')
  const [ackSuccess, setAckSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchAlarms = useCallback(async () => {
    if (!token || !address) return
    setLoading(true)
    const config = createPlcConfig(address)

    // Only request the alarm attributes this UI renders — reduces PLC response size
    const filters: Filters = {
      mode: 'include',
      attributes: ['alarm_text', 'info_text', 'status', 'timestamp', 'acknowledgement', 'alarm_number', 'producer'],
    }

    try {
      const response = await browseAlarms(config, token, 'en-US', filters)
      if (response?.result?.entries) {
        setEntries(response.result.entries)
        setCountCurrent(response.result.count_current)
        setCountMax(response.result.count_max)
        setLastModified(response.result.last_modified)
      }
    } catch (err) {
      console.error('Alarms fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [address, token])

  useEffect(() => { void fetchAlarms() }, [fetchAlarms])

  const acknowledge = async (alarmId: string) => {
    if (!alarmId) {
      setAckMessage('Please enter a valid Alarm ID.')
      setAckSuccess(false)
      return
    }

    const target = entries.find(e => e.id === alarmId && e.acknowledgement)
    if (!target) {
      setAckMessage(`No acknowledgeable alarm found with ID ${alarmId}.`)
      setAckSuccess(false)
      return
    }

    const config = createPlcConfig(address)
    try {
      // AlarmsAcknowledge sends a "Alarms.Acknowledge" JSON-RPC call to the PLC
      const response = await acknowledgeAlarm(config, token, alarmId)
      if (response?.result === true) {
        setAckMessage(`Alarm ${alarmId} acknowledged successfully.`)
        setAckSuccess(true)
        void fetchAlarms()
      } else {
        setAckMessage(`Failed to acknowledge alarm ${alarmId}.`)
        setAckSuccess(false)
      }
    } catch (err) {
      setAckMessage(`Error acknowledging alarm: ${err}`)
      setAckSuccess(false)
    }
  }

  return { entries, countCurrent, countMax, lastModified, ackMessage, ackSuccess, loading, refresh: fetchAlarms, acknowledge }
}
