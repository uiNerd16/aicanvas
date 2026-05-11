// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// RESOURCE PLANNING · DEMO DATA
// ============================================================

// ---- Top KPI: Cluster utilisation (a row of skewed bars) ----
// 30 segments matching the ProgressBar grid count. Values 0-1.
export const clusterUtilisation = {
  value: 87.2,
  delta: 1.4,
  segments: [
    0.62, 0.71, 0.55, 0.83, 0.92, 0.74, 0.81, 0.69, 0.78, 0.85,
    0.91, 0.66, 0.74, 0.82, 0.88, 0.94, 0.79, 0.71, 0.86, 0.91,
    0.83, 0.77, 0.89, 0.94, 0.96, 0.88, 0.81, 0.92, 0.97, 0.85,
  ],
};

// ---- Top KPI: Mission success rate (gradient progress bar) ----
export const missionSuccessRate = {
  value: 96.4,
  delta: 0.6,
};

// ---- Top KPI: Active allocations (sparkline) ----
export const activeAllocations = {
  value: 2184,
  delta: 3.5,
  series: [
    1420, 1460, 1495, 1510, 1540, 1530, 1580, 1620, 1660, 1690,
    1730, 1760, 1745, 1810, 1850, 1880, 1920, 1945, 1990, 2020,
    2055, 2080, 2110, 2095, 2130, 2155, 2168, 2180, 2184,
  ].map((v, i) => ({ t: i, v })),
};

// ---- Allocation vs usage (multi-series area chart) ----
// 31 days of mock data. Allocated is the planned capacity, used is the
// active draw, reserved is the locked-but-idle pool.
const _allocationDays = [
  [9100, 8200, 1500], [9200, 8400, 1480], [9050, 8050, 1520], [9300, 8600, 1460],
  [9450, 8800, 1500], [9100, 8500, 1430], [9250, 8350, 1480], [9400, 8700, 1500],
  [9550, 8900, 1520], [9600, 9050, 1480], [9450, 8950, 1450], [9300, 8800, 1490],
  [9650, 9100, 1530], [9800, 9300, 1500], [9700, 9050, 1470], [9550, 8900, 1500],
  [9750, 9250, 1520], [9900, 9450, 1490], [10050, 9650, 1500], [10100, 9700, 1470],
  [9950, 9500, 1450], [10000, 9550, 1480], [10150, 9750, 1500], [10300, 9900, 1530],
  [10250, 9850, 1500], [10100, 9700, 1480], [10250, 9850, 1500], [10400, 10050, 1520],
  [10500, 10150, 1500], [10350, 9950, 1470], [10450, 10100, 1490],
];

export const allocationSeries = _allocationDays.map(([allocated, used, reserved], i) => ({
  t:         i + 1,                          // day-of-month
  allocated,
  used,
  reserved,
}));

// ---- Requests breakdown (3-bucket stacked) ----
export const requestsBreakdown = {
  approved: { value: '1.42K UNITS', share: 0.515 },
  pending:  { value: '802 UNITS',   share: 0.290 },
  rejected: { value: '538 UNITS',   share: 0.195 },
};

// ---- Request log table ----
export const requestRows = [
  { team: 'Comms Array',     submitted: '08/17/25', owner: 'OPS-04',  amount: '12 PFLOPS', status: 'pending'  },
  { team: 'Sensor Bay',      submitted: '08/17/25', owner: 'OPS-02',  amount: '6 PFLOPS',  status: 'pending'  },
  { team: 'Propulsion',      submitted: '08/16/25', owner: 'OPS-07',  amount: '24 PFLOPS', status: 'approved' },
  { team: 'Telemetry',       submitted: '08/16/25', owner: 'OPS-03',  amount: '8 PFLOPS',  status: 'pending'  },
  { team: 'Maintenance',     submitted: '08/16/25', owner: 'OPS-09',  amount: '4 PFLOPS',  status: 'rejected' },
  { team: 'Nav Compute',     submitted: '08/15/25', owner: 'OPS-01',  amount: '18 PFLOPS', status: 'approved' },
  { team: 'Hull Diagnostics', submitted: '08/15/25', owner: 'OPS-05', amount: '3 PFLOPS',  status: 'pending'  },
  { team: 'Life Support',    submitted: '08/14/25', owner: 'OPS-06',  amount: '7 PFLOPS',  status: 'approved' },
];

export const filterTabs = [
  { id: 'all',      label: 'All',      count: 24 },
  { id: 'pending',  label: 'Pending',  count: 9  },
  { id: 'recent',   label: 'Recent',   count: 6  },
  { id: 'approved', label: 'Approved', count: 9  },
];

export const navItems = [
  'Dashboard', 'Allocations', 'Workloads', 'Capacity', 'Reports',
];
