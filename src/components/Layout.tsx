/**
 * Layout — sidebar navigation shell that wraps all dashboard pages.
 *
 * Mirrors the LandingPageComponent / Bootstrap sidebar from the Angular app,
 * rebuilt with plain Tailwind (no third-party sidebar library needed).
 */
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Activity,
  BarChart2,
  // Bell,
  BookMarked,
  BookOpen,
  Database,
  LogOut,
  ScrollText,
} from 'lucide-react'

const navItems = [
  { to: 'tank-overview',      label: 'Tank Overview',      icon: Activity    },
  { to: 'plant-status',       label: 'Plant Status',        icon: BarChart2   },
  { to: 'data-view',          label: 'Data View',           icon: Database    },
  { to: 'diagnostic-buffer',  label: 'Diagnostic Buffer',   icon: BookOpen    },
  { to: 'syslog-buffer',      label: 'Syslog Buffer',       icon: ScrollText  },
  // { to: 'alarms',             label: 'Alarms',              icon: Bell        },
  { to: 'resources',          label: 'Resources',           icon: BookMarked  },
]

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 px-5 py-5 border-b border-sidebar-border">
          <img src="/assets/SIEMENS_Logo.png" alt="Siemens" className="h-10 object-contain" />
          <span className="text-sm font-semibold leading-tight text-center">
            S7 Web Server<br />
            <span className="text-xs font-normal text-sidebar-foreground/60">React Demo</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Disconnect
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-7xl p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
