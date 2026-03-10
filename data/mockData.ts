import { Status } from "@/components/StatusBadge";

export interface Job {
  id: string;
  fileName: string;
  pages: number;
  status: Status;
  progress: number;
  createdAt: string;
}

export interface DocumentInstance {
  id: string;
  documentType: string;
  vendor: string;
  fields: Record<string, string>;
  items: Array<Record<string, string | number>>;
  status: Status;
}

export const mockJobs: Job[] = [
  {
    id: "JOB-001",
    fileName: "invoice_batch_march.pdf",
    pages: 24,
    status: "completed",
    progress: 100,
    createdAt: "2026-03-10 09:15",
  },
  {
    id: "JOB-002",
    fileName: "shipping_manifest_0312.pdf",
    pages: 8,
    status: "processing",
    progress: 62,
    createdAt: "2026-03-10 10:30",
  },
  {
    id: "JOB-003",
    fileName: "customs_declaration.pdf",
    pages: 3,
    status: "completed",
    progress: 100,
    createdAt: "2026-03-10 08:45",
  },
  {
    id: "JOB-004",
    fileName: "bill_of_lading_set.pdf",
    pages: 12,
    status: "queued",
    progress: 0,
    createdAt: "2026-03-10 11:00",
  },
  {
    id: "JOB-005",
    fileName: "packing_list_export.pdf",
    pages: 6,
    status: "failed",
    progress: 33,
    createdAt: "2026-03-09 16:20",
  },
  {
    id: "JOB-006",
    fileName: "commercial_invoice_CN.pdf",
    pages: 4,
    status: "completed",
    progress: 100,
    createdAt: "2026-03-09 14:10",
  },
  {
    id: "JOB-007",
    fileName: "warehouse_receipt.pdf",
    pages: 2,
    status: "completed",
    progress: 100,
    createdAt: "2026-03-09 12:00",
  },
  {
    id: "JOB-008",
    fileName: "freight_invoice_batch.pdf",
    pages: 18,
    status: "processing",
    progress: 44,
    createdAt: "2026-03-10 11:15",
  },
];

export const mockInstances: DocumentInstance[] = [
  {
    id: "INST-001",
    documentType: "Commercial Invoice",
    vendor: "Shanghai Global Trade Co.",
    status: "completed",
    fields: {
      "Invoice Number": "INV-2026-0451",
      Date: "2026-03-08",
      Currency: "USD",
      "Total Amount": "24,580.00",
      Incoterm: "FOB Shanghai",
    },
    items: [
      {
        description: "Electronic Components PCB-A",
        quantity: 500,
        unit: "PCS",
        unitPrice: 12.5,
        amount: 6250,
      },
      {
        description: "LED Display Module 7in",
        quantity: 200,
        unit: "PCS",
        unitPrice: 45.0,
        amount: 9000,
      },
      {
        description: "Connector Cable Set USB-C",
        quantity: 1000,
        unit: "PCS",
        unitPrice: 9.33,
        amount: 9330,
      },
    ],
  },
  {
    id: "INST-002",
    documentType: "Packing List",
    vendor: "Shanghai Global Trade Co.",
    status: "completed",
    fields: {
      "PL Number": "PL-2026-0451",
      "Total Packages": "12",
      "Gross Weight": "480 KG",
      "Net Weight": "420 KG",
      Dimensions: "120x80x100 cm",
    },
    items: [
      {
        carton: "1-4",
        content: "Electronic Components PCB-A",
        qty: 500,
        weight: "160 KG",
      },
      {
        carton: "5-8",
        content: "LED Display Module 7in",
        qty: 200,
        weight: "180 KG",
      },
      {
        carton: "9-12",
        content: "Connector Cable Set USB-C",
        qty: 1000,
        weight: "140 KG",
      },
    ],
  },
  {
    id: "INST-003",
    documentType: "Bill of Lading",
    vendor: "Maersk Line",
    status: "failed",
    fields: {
      "B/L Number": "MAEU-2026-78451",
      Vessel: "Maersk Seletar",
      "Port of Loading": "Shanghai",
      "Port of Discharge": "Los Angeles",
      ETA: "2026-04-02",
    },
    items: [
      {
        container: "MSKU-4521876",
        type: "40HC",
        sealNo: "ML-98742",
        weight: "480 KG",
      },
    ],
  },
];

export const mockDocumentResult = {
  jobId: "JOB-001",
  fileName: "invoice_batch_march.pdf",
  processedAt: "2026-03-10T09:45:00Z",
  instances: mockInstances.map((inst) => ({
    ...inst,
    extractedData: {
      documentType: inst.documentType,
      vendor: inst.vendor,
      fields: inst.fields,
      lineItems: inst.items,
      metadata: {
        confidence: 0.94,
        processingTime: "2.3s",
        pageRange: "1-8",
      },
    },
  })),
};
