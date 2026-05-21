/**
 * Resources shown on the Resources page.
 * Edit this file to add, remove, or reorder links — no component changes needed.
 */
export interface Resource {
  category: string
  description: string
  url: string
}

export const resources: Resource[] = [
  // ── demo files used in this project ──────────────────────────────────────
  {
    category: 'Application Example files used in this demo',
    description: 'Creating User-Defined Web Pages with the Web API for SIMATIC S7-1200 G2 / S7-1500.',
    url: 'https://support.industry.siemens.com/cs/document/68011496/creating-user-defined-web-pages-with-the-web-api-for-simatic-s7-1200-g2-s7-1500?dti=0&lc=en-WW',
  },

  // ── simatic-s7-webserver-api ──────────────────────────────────────────────
  {
    category: 'API Library',
    description: 'simatic-s7-webserver-api — npm package used in this demo to communicate with the Siemens S7 Web Server from TypeScript/JavaScript.',
    url: 'https://www.npmjs.com/package/@siemens/simatic-s7-webserver-api',
  },
  {
    category: 'API Library',
    description: 'simatic-s7-webserver-api GitHub repository — source code, examples, and issue tracker for the Siemens open-source library.',
    url: 'https://github.com/siemens/typescript-simatic-s7-webserver-api',
  },
  {
    category: 'API Library',
    description: 'SIMATIC S7-1500, SIMATIC Drive Controller, ET 200SP, ET 200pro Web server - API Specification.',
    url: 'https://support.industry.siemens.com/cs/mdm/59193560?c=157269632139&lc=en-US',
  },
  {
    category: 'API Library',
    description: ' .NET API Client Library for the SIMATIC S7 PLC Webserver API.',
    url: 'https://github.com/siemens/simatic-s7-webserver-api',
  },

  // ── Siemens Official ─────────────────────────────────────────────────────
  {
    category: 'Siemens Official',
    description: 'Creating User-Defined Web Pages with the Web API for SIMATIC S7-1200 G2 / S7-1500 - PDF.',
    url: 'https://cache.industry.siemens.com/dl/files/496/68011496/att_1328192/v1/68011496_CreatingUserDefinedWebPages_DOC_V5_en.pdf',
  },
  {
    category: 'Siemens Official',
    description: 'Documentation for the automation system S7-1500 and the ET 200MP distributed -I/O system.',
    url: 'https://support.industry.siemens.com/cs/document/109742691/documentation-for-the-automation-system-s7-1500-and-the-et-200mp-distributed-i-o-system?dti=0&lc=en-WW',
  },
  {
    category: 'Siemens Official',
    description: 'SIMATIC Drive Controller, CPU 1507D TF - 6ES7615-7DF10-0AB0 - Datasheet.',
    url: 'https://support.industry.siemens.com/cs/pd/1400633?pdti=td&dl=en&lc=en-WW',
  },

  // ── Frameworks & Tooling ─────────────────────────────────────────────────
  {
    category: 'Frameworks & Tooling',
    description: 'React — the JavaScript library used to build this demo UI (component model, hooks, React Router).',
    url: 'https://react.dev',
  },
  {
    category: 'Frameworks & Tooling',
    description: 'Angular — the alternative framework used in the companion demo app (same PLC library, different framework).',
    url: 'https://angular.dev',
  },
  {
    category: 'Frameworks & Tooling',
    description: 'Vite — next-generation build tool and dev server used to bundle this React application.',
    url: 'https://vite.dev',
  },
  {
    category: 'Frameworks & Tooling',
    description: 'Tailwind CSS — utility-first CSS framework used for all styling in this demo.',
    url: 'https://tailwindcss.com',
  },
]
