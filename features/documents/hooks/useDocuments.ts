'use client';

import { useQuery } from '@tanstack/react-query';
import { documentsService } from '../api/documents.service';
import { ListDocumentsQuery, Document } from '../model/documents.schema';

// Mock data generator for fallback
const generateMockDocuments = (): Document[] => [
  {
    id: 'DOC-101',
    job_id: 'JOB-001',
    document_type: { id: 'dt1', code: 'INV', name: 'Commercial Invoice' },
    vendor: { id: 'v1', name: 'Shanghai Global Trade Co.' },
    start_page: 1,
    end_page: 2,
    status: 'completed',
    fields: [
      { key: 'invoice_number', value: 'INV-2026-0451' },
      { key: 'date', value: '2026-03-08' },
      { key: 'currency', value: 'USD' },
      { key: 'total_amount', value: '24,580.00' }
    ],
    items: [
      { description: 'Electronic Components PCB-A', quantity: 500, unit: 'PCS', unitprice: 12.5, amount: 6250 },
      { description: 'LED Display Module 7in', quantity: 200, unit: 'PCS', unitprice: 45.0, amount: 9000 }
    ]
  },
  {
    id: 'DOC-102',
    job_id: 'JOB-001',
    document_type: { id: 'dt2', code: 'PL', name: 'Packing List' },
    vendor: { id: 'v1', name: 'Shanghai Global Trade Co.' },
    start_page: 3,
    end_page: 4,
    status: 'completed',
    fields: [
      { key: 'pl_number', value: 'PL-2026-0451' },
      { key: 'total_packages', value: '12' }
    ],
    items: [
      { carton: '1-4', content: 'Electronic Components PCB-A', qty: 500, weight: '160 KG' }
    ]
  }
];

export const useDocuments = (query?: ListDocumentsQuery) => {
  const isMock = process.env.NEXT_PUBLIC_MOCK_API === 'true';

  const useDocumentsList = () => {
    return useQuery({
      queryKey: ['documents', query],
      queryFn: async () => {
        if (isMock) {
          await new Promise(resolve => setTimeout(resolve, 600));
          const docs = generateMockDocuments();
          return {
            data: {
              items: docs,
              total: docs.length,
              page: query?.page || 1,
              limit: query?.limit || 10,
              totalPages: 1
            },
            meta: { success: true }
          };
        }
        return documentsService.list(query);
      },
    });
  };

  const useDocumentDetail = (id: string) => {
    return useQuery({
      queryKey: ['documents', id],
      queryFn: async () => {
        if (isMock) {
          await new Promise(resolve => setTimeout(resolve, 400));
          const mockDocs = generateMockDocuments();
          const doc = mockDocs.find(d => d.id === id);
          if (!doc) throw new Error('Document not found');
          return {
            data: doc,
            meta: { success: true }
          };
        }
        return documentsService.getById(id);
      },
      enabled: !!id,
    });
  };

  return {
    useDocumentsList,
    useDocumentDetail,
  };
};
