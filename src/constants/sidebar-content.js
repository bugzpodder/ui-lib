// @flow
export const LIMS = "lims";
export const EDC = "EDC";
export const PIPELINE = "pipeline";
export const EXTERNAL = "external";

export const sidebarItems: (SidebarItem | ParentSidebarItem)[] = [
  {
    name: "Sample Management",
    children: [
      {
        name: "Commercial Accessioning",
        domain: EDC,
        path: "/v/VERMILLION/trfs",
      },
      {
        name: "Research Accessioning",
        domain: LIMS,
        path: "/lims/accession",
      },
      {
        name: "Samples",
        domain: LIMS,
        path: "/lims/samples",
      },
      {
        name: "Stored Samples",
        domain: LIMS,
        path: "/lims/stored-samples",
      },
      {
        name: "Batches",
        domain: LIMS,
        path: "/lims/batches",
      },
      {
        name: "Sample Issues",
        domain: LIMS,
        path: "/lims/sample-issues",
      },
      {
        name: "Sequencing Runs",
        domain: LIMS,
        path: "/lims/sequencing-runs",
      },
      {
        name: "New Sequencing Run",
        domain: LIMS,
        path: "/lims/new-sequencing-run",
      },
      {
        name: "Print Labels",
        domain: LIMS,
        path: "/lims/print-labels",
      },
      {
        name: "Study Samples",
        domain: LIMS,
        path: "/lims/study-samples",
      },
      {
        name: "Create Study Samples",
        domain: LIMS,
        path: "/lims/create-study-samples",
      },
    ],
  },
  {
    name: "Automation",
    children: [
      {
        name: "Program Runs",
        domain: LIMS,
        path: "/automation/program-runs",
      },
      {
        name: "Resources",
        domain: LIMS,
        path: "/automation/resources",
      },
      {
        name: "Programs",
        domain: LIMS,
        path: "/automation/programs",
      },
      {
        name: "Program Regex Tester",
        domain: LIMS,
        path: "/automation/program-regex-tester",
      },
      {
        name: "Tasks",
        domain: LIMS,
        path: "/automation/tasks",
      },
    ],
  },
  {
    name: "Pipeline",
    children: [
      {
        name: "New Run",
        domain: LIMS,
        path: "/pipeline/analysis-runs/new",
      },
      {
        name: "Previous Runs",
        domain: LIMS,
        path: "/pipeline-ui",
      },
      {
        name: "Sample Sheets",
        domain: LIMS,
        path: "/pipeline/sample-sheets/upload",
      },
      {
        name: "Assay Analysis",
        domain: LIMS,
        path: "/pipeline/assay-analysis",
      },
    ],
  },
  {
    name: "Test Management",
    children: [
      {
        name: "Tests",
        domain: EDC,
        path: "/v/VERMILLION/trfs",
      },
      {
        name: "Test Review",
        domain: LIMS,
        path: "/lims/lab-tests",
      },
      {
        name: "Healthcare Providers",
        domain: EDC,
        path: "/v/VERMILLION/providers",
      },
      {
        name: "Invoices",
        domain: EDC,
        path: "/v/VERMILLION/providers",
      },
      {
        name: "Adjustments",
        domain: EDC,
        path: "/v/VERMILLION/adjustments",
      },
    ],
  },
  {
    name: "Metrics",
    children: [
      {
        name: "Dashboards",
        domain: EXTERNAL,
        path: "https://eng-cluster.eng.aws.grail.com:8630/",
      },
      {
        name: "Reports",
        domain: LIMS,
        path: "/lims/reports",
      },
    ],
  },
  {
    name: "Storage",
    domain: LIMS,
    path: "/lims/sample-storage/racks",
  },
  {
    name: "Reagents",
    children: [
      {
        name: "Part Numbers",
        domain: LIMS,
        path: "/lims/reagents/part-numbers",
      },
      {
        name: "Reagent Lots",
        domain: LIMS,
        path: "/lims/reagents",
        exact: true,
      },
    ],
  },
  {
    name: "Instruments",
    domain: LIMS,
    path: "/facilities/instruments",
  },
  {
    name: "R&D",
    children: [
      {
        name: "Experiments",
        domain: LIMS,
        path: "/lims/experiments",
      },
      {
        name: "Conditions",
        domain: LIMS,
        path: "/lims/conditions",
      },
      {
        name: "Labels",
        domain: LIMS,
        path: "/lims/labels",
      },
    ],
  },
];

export const adminItems = {
  name: "Admin",
  children: [
    {
      name: "Lab Users",
      domain: LIMS,
      path: "/admin/users",
    },
    {
      name: "Accessioning Users",
      domain: EDC,
      path: "/v/VERMILLION/users",
    },
    {
      name: "Labs",
      domain: LIMS,
      path: "/admin/labs",
    },
    {
      name: "Printers",
      domain: LIMS,
      path: "/admin/printers",
    },
    {
      name: "Printer Labels",
      domain: LIMS,
      path: "/admin/printer-labels",
    },
    {
      name: "Import BST Samples",
      domain: LIMS,
      path: "/lims/import-samples",
    },
    {
      name: "Import Mock Samples",
      domain: LIMS,
      path: "/lims/import-mock-samples",
    },
    {
      name: "Config",
      domain: LIMS,
      path: "/admin/config",
    },
  ],
};
