// @flow
export const LIMS = "lims";
export const EDC = "EDC";
export const PIPELINE = "pipeline";
export const EXTERNAL = "external";

export const sidebarItems: (SidebarItemLink | SidebarItemParent)[] = [
  {
    name: "Sample Management",
    children: [
      {
        name: "Commercial Accessioning",
        domain: EDC,
        path: "/v2/trfs",
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
        name: "Containers",
        domain: LIMS,
        path: "/lims/containers",
      },
      {
        name: "Batches",
        domain: LIMS,
        path: "/lims/batches",
      },
      {
        name: "Issues",
        domain: LIMS,
        path: "/lims/issues",
      },
      {
        name: "Sequencing Runs",
        domain: LIMS,
        path: "/lims/sequencing-runs",
      },
      {
        name: "Print Labels",
        domain: LIMS,
        path: "/lims/print-labels",
      },
      {
        name: "Non-Patient Samples",
        domain: LIMS,
        path: "/lims/non-patient-samples",
      },
      {
        name: "Create Non-Patient Samples",
        domain: LIMS,
        path: "/lims/create-non-patient-samples",
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
    ],
  },
  {
    name: "Pipeline",
    children: [
      {
        name: "Pipeline Runs",
        domain: LIMS,
        path: "/pipeline/pipeline-runs",
      },
      {
        name: "New Run",
        domain: LIMS,
        path: "/pipeline/new-analysis-run",
      },
      {
        name: "Previous Runs",
        domain: LIMS,
        path: "/pipeline-ui",
      },
    ],
  },
  {
    name: "Test Management",
    children: [
      {
        name: "Tests",
        domain: EDC,
        path: "/v2/trfs",
      },
      {
        name: "Healthcare Providers",
        domain: EDC,
        path: "/v2/providers",
      },
      {
        name: "Invoices",
        domain: EDC,
        path: "/v2/invoices",
      },
      {
        name: "Adjustments",
        domain: EDC,
        path: "/v2/adjustments",
      },
    ],
  },
  {
    name: "Metrics",
    children: [
      {
        name: "Dashboards",
        domain: EXTERNAL,
        path: "https://ccga-pm-dashboard.eng.aws.grail.com/#/dashboards/ccga2/tmOD",
      },
      {
        name: "Reports",
        domain: LIMS,
        path: "/lims/reports",
      },
    ],
  },
  {
    name: "Reagents",
    children: [
      {
        name: "Part Numbers",
        domain: LIMS,
        path: "/lims/part-numbers",
      },
      {
        name: "Reagent Lots",
        domain: LIMS,
        path: "/lims/reagent-lots",
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
        name: "Tags",
        domain: LIMS,
        path: "/lims/tags",
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
      path: "/v2/users",
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
      name: "Assay Analysis",
      domain: LIMS,
      path: "/admin/assay-analysis",
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
