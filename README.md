# S7 Web Server API Demo — React

A React/TypeScript demo application that connects to a **Siemens SIMATIC S7-1200/S7-1500 PLC** via its built-in Web Server API. It monitors and controls a simulated tank-filling process in real time, and doubles as a practical reference for how to integrate the [`@siemens/simatic-s7-webserver-api`](https://www.npmjs.com/package/@siemens/simatic-s7-webserver-api) npm package into a modern React front-end.

---

## Features

| Page | Description | API calls used |
|---|---|---|
| **Login** | Authenticates to the PLC by IP address, username, and password. Auto-refreshes the session token every 60 s. | `ApiLogin` |
| **Tank Overview** | Live tank visualization (filling / emptying / empty image), level progress bar, valve & process controls, flowrate setpoint, and a raw measurement grid. Polled every **500 ms**. | `PlcProgramRead.bulkExecute` (11 vars/request), `PlcProgramWrite.execute` |
| **Plant Status** | Simplified plant view with a run/stop status image, tank level bar, and flowrate input. Polled every **500 ms**. | `PlcProgramRead.execute`, `PlcProgramWrite.execute` |
| **Data View** | Table of the 20-row `DataBuffer` DB (timestamp + value). Refreshed every **2 s** with a single bulk request. | `PlcProgramRead.bulkExecute` (40 vars/request) |
| **Diagnostic Buffer** | PLC internal diagnostic events (short / long / help text) fetched on load and on demand. | `DiagnosticBufferBrowse.execute` |
| **Syslog Buffer** | Raw Web Server syslog ring buffer with overflow indicator. Fetched on load and on demand. | `SyslogBrowse.execute` |
| **Resources** | Curated links to all documentation, libraries, and source files used by this demo. | — |

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** — dev server and bundler
- **React Router DOM v7** — client-side routing
- **Tailwind CSS v4** — utility-first styling
- **`@siemens/simatic-s7-webserver-api` v1.1.x** — PLC communication library
- **lucide-react** — icons
- **shadcn/ui**-style component primitives (`Button`, `Card`, `Badge`, `Table`, `Progress`, …)

---

## Prerequisites

### PLC Side

1. A **SIMATIC S7-1200 G2** or **S7-1500** PLC (or the Drive Controller / ET 200SP variants) with the Web Server enabled and the API activated in TIA Portal.
2. The TIA Portal project must contain:
   - A data block named **`web2plc`** with variables: `start`, `stop`, `reset`, `openValve`, `closeValve`, `statusValveCPU`, `flowrate`, `tankLevel`, `tankLevelScale`, `tankLevelOverflow`, `tankLevelMaximum`, `tankLevelMidth`, `tankLevelMinimum`, `tankLevelLack`.
   - A data block named **`DataBuffer`** with an array `data[0..19]` where each element has `timeStamp` and `value` fields.
3. The PLC must be reachable from the machine running this app (same network or VPN). HTTPS with a self-signed certificate is expected (the library sets `verifyTls = false` by default).

> See the [Siemens application example](https://support.industry.siemens.com/cs/document/68011496) for the complete TIA Portal project that matches this demo.

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/cadugrillo/S7-web-server-api-demo.git
cd S7-web-server-api-demo

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser, enter your PLC's IP address together with a valid username and password, and click **Connect**.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Sidebar shell wrapping all dashboard pages
│   └── ui/                 # Reusable UI primitives (Button, Card, Badge, …)
├── hooks/
│   ├── useTankOverview.ts  # 500 ms bulk-poll + write actions for Tank Overview
│   ├── usePlantStatus.ts   # 500 ms poll for Plant Status
│   ├── useDataView.ts      # 2 s bulk-poll for DataBuffer DB
│   ├── useDiagnosticBuffer.ts
│   ├── useSyslogBuffer.ts
│   └── useAlarms.ts
├── lib/
│   └── plc/
│       ├── config.ts       # Creates RequestConfig (address, https, no TLS verify)
│       ├── auth.ts         # ApiLogin + 60 s token refresh
│       ├── program.ts      # Wrappers for PlcProgramRead / PlcProgramWrite
│       ├── diagnostics.ts
│       ├── syslog.ts
│       └── alarms.ts
├── pages/                  # One file per route
├── data/
│   └── resources.ts        # Link list rendered on the Resources page
└── App.tsx                 # BrowserRouter + route tree
```

---

## How Authentication Works

1. `LoginPage` calls `loginToPLC()` which executes `ApiLogin` against the PLC.
2. On success, the **session token**, PLC address, username, and password are saved in `sessionStorage`.
3. `startPeriodicLogin()` sets a 60-second interval that silently re-authenticates to prevent the PLC session from expiring.
4. Every hook reads `authToken` and `plcAddress` from `sessionStorage` — no prop-drilling or global state manager needed for this demo.
5. Clicking **Disconnect** in the sidebar clears `sessionStorage` and redirects to the login page.

---

## Key API Patterns Demonstrated

### Bulk variable read (efficient)
```ts
// One HTTP request for 11 PLC variables — PlcProgramRead.bulkExecute()
const results = await readVariablesBulk(config, token, [
  { var: '"web2plc".tankLevel',      mode: 'simple' },
  { var: '"web2plc".tankLevelScale', mode: 'simple' },
  // …
])
```

### Single variable write (control command)
```ts
// PlcProgramWrite.execute()
await writeVariable(config, token, '"web2plc".start', true)
```

### Diagnostic buffer browse
```ts
// DiagnosticBufferBrowse.execute() — language string must match TIA Portal config
const response = await new DiagnosticBufferBrowse(config, token, 'en-US').execute()
```

---

## Resources

- [Application Example — Creating User-Defined Web Pages for S7 (Siemens)](https://support.industry.siemens.com/cs/document/68011496)
- [`@siemens/simatic-s7-webserver-api` on npm](https://www.npmjs.com/package/@siemens/simatic-s7-webserver-api)
- [TypeScript library source on GitHub](https://github.com/siemens/typescript-simatic-s7-webserver-api)
- [S7-1500 Web Server API Specification (Siemens)](https://support.industry.siemens.com/cs/mdm/59193560?c=157269632139&lc=en-US)
- [React](https://react.dev) · [Vite](https://vite.dev) · [Tailwind CSS](https://tailwindcss.com)

---

## License

This project is provided as a demo/reference and carries no warranty. See individual dependency licenses for their respective terms.
