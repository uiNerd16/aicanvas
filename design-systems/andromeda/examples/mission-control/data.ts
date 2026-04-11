// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL DEMO DATA
// ============================================================

import {
  Grid,
  Activity,
  Rocket,
  RadioButton,
  WarningAltFilled,
  Tools,
} from '@carbon/icons-react';

// ---- Sidebar nav ----
export const navItems = [
  { id: 'overview',    label: 'Overview',    icon: Grid             },
  { id: 'telemetry',   label: 'Telemetry',   icon: Activity         },
  { id: 'vehicles',    label: 'Vehicles',    icon: Rocket           },
  { id: 'comms',       label: 'Comms',       icon: RadioButton      },
  { id: 'anomalies',   label: 'Anomalies',   icon: WarningAltFilled },
  { id: 'maintenance', label: 'Maintenance', icon: Tools            },
];

// ---- Telemetry stat tiles ----
export const telemetryStats = [
  { code: 'TLM-01', label: 'Altitude', value: '412.4', unit: 'KM',   delta: 0.3,   deltaLabel: 'last 60s' },
  { code: 'TLM-02', label: 'Velocity', value: '7.66',  unit: 'KM/S', delta: -0.02, deltaLabel: 'last 60s' },
  { code: 'TLM-03', label: 'Signal',   value: '98',    unit: '%',    delta: 0,     deltaLabel: 'nominal'  },
  { code: 'TLM-04', label: 'Power',    value: '87',    unit: '%',    delta: -2,    deltaLabel: 'last 1h'  },
];

// ---- Altitude chart (24 hours, sampled hourly) ----
export const altitudeData = [
  { t: '00:00', alt: 396 },
  { t: '01:00', alt: 398 },
  { t: '02:00', alt: 401 },
  { t: '03:00', alt: 400 },
  { t: '04:00', alt: 403 },
  { t: '05:00', alt: 405 },
  { t: '06:00', alt: 404 },
  { t: '07:00', alt: 406 },
  { t: '08:00', alt: 408 },
  { t: '09:00', alt: 407 },
  { t: '10:00', alt: 409 },
  { t: '11:00', alt: 410 },
  { t: '12:00', alt: 408 },
  { t: '13:00', alt: 411 },
  { t: '14:00', alt: 409 },
  { t: '15:00', alt: 412 },
  { t: '16:00', alt: 410 },
  { t: '17:00', alt: 413 },
  { t: '18:00', alt: 411 },
  { t: '19:00', alt: 414 },
  { t: '20:00', alt: 412 },
  { t: '21:00', alt: 411 },
  { t: '22:00', alt: 412 },
  { t: '23:00', alt: 412 },
];

// ---- System status panel ----
export const systems = [
  { name: 'Propulsion',   status: 'nominal', value: 98  },
  { name: 'Navigation',   status: 'nominal', value: 100 },
  { name: 'Comms Array',  status: 'caution', value: 76  },
  { name: 'Power Grid',   status: 'nominal', value: 87  },
  { name: 'Thermal',      status: 'nominal', value: 92  },
  { name: 'Life Support', status: 'nominal', value: 100 },
];

// ---- Vehicles table ----
export const vehicles = [
  { callsign: 'ARES-1',     type: 'Probe',     status: 'active',  distance: '412 km',  lastContact: '12s ago' },
  { callsign: 'OBERON',     type: 'Lander',    status: 'standby', distance: '0.4 AU',  lastContact: '4m ago'  },
  { callsign: 'KEPLER-2',   type: 'Telescope', status: 'active',  distance: '1.5 AU',  lastContact: '32s ago' },
  { callsign: 'VOYAGER-X',  type: 'Probe',     status: 'caution', distance: '18.2 AU', lastContact: '6h ago'  },
  { callsign: 'HORIZON',    type: 'Orbiter',   status: 'active',  distance: '220 km',  lastContact: '8s ago'  },
];

export const vehicleStatusVariant = {
  active:  'nominal',
  standby: 'default',
  caution: 'caution',
  fault:   'fault',
};

export const vehicleStatusLabel = {
  active:  'Active',
  standby: 'Standby',
  caution: 'Caution',
  fault:   'Fault',
};

// ---- Comms log ----
export const commsLog = [
  { dir: 'down',  from: 'ARES-1',    text: 'Telemetry packet received',     time: 'T-12s' },
  { dir: 'up',    from: 'OBERON',    text: 'Command queue updated',          time: 'T-1m'  },
  { dir: 'down',  from: 'KEPLER-2',  text: 'Image batch transmitted',        time: 'T-3m'  },
  { dir: 'alert', from: 'VOYAGER-X', text: 'Signal degraded · investigate',  time: 'T-32m' },
  { dir: 'down',  from: 'HORIZON',   text: 'Orbit correction confirmed',     time: 'T-1h'  },
];
