/**
 * App — root routing configuration.
 *
 * Route structure mirrors the Angular app.routes.ts:
 *   /             → redirect to /login
 *   /login        → LoginPage
 *   /dashboard/*  → Layout (sidebar) with nested pages
 *
 * No auth guard is implemented here (kept simple for demo purposes);
 * pages rely on sessionStorage for token & address.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import LoginPage            from '@/pages/LoginPage'
import TankOverviewPage     from '@/pages/TankOverviewPage'
import PlantStatusPage      from '@/pages/PlantStatusPage'
import DataViewPage         from '@/pages/DataViewPage'
import DiagnosticBufferPage from '@/pages/DiagnosticBufferPage'
import SyslogBufferPage     from '@/pages/SyslogBufferPage'
import AlarmsPage           from '@/pages/AlarmsPage'
import ResourcesPage        from '@/pages/ResourcesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="tank-overview" replace />} />
          <Route path="tank-overview"     element={<TankOverviewPage />} />
          <Route path="plant-status"      element={<PlantStatusPage />} />
          <Route path="data-view"         element={<DataViewPage />} />
          <Route path="diagnostic-buffer" element={<DiagnosticBufferPage />} />
          <Route path="syslog-buffer"     element={<SyslogBufferPage />} />
          <Route path="alarms"            element={<AlarmsPage />} />
          <Route path="resources"         element={<ResourcesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
