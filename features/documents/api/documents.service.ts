import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  Document, 
  ListDocumentsQuery,
  ListDocumentsData 
} from '../model/documents.schema';

export const documentsService = {
  list: async (query?: ListDocumentsQuery): Promise<ApiResponse<ListDocumentsData>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          data: [
            {
              id: 'doc-1',
              job_id: 'job-1',
              source_file: { id: 'sf-1', file_name: 'invoice-1.pdf' },
              vendor: { id: 'v-1', name: 'Mock Vendor' },
              document_type: { id: 'dt-1', code: 'INV', name: 'Invoice' },
              start_page: 1,
              end_page: 1,
              status: 'completed',
              confidence: '0.98',
              needs_review: false,
              created_at: new Date().toISOString(),
              fields: [
                { key: 'invoice_number', value: 'INV-001' },
                { key: 'total_amount', value: '150.00' },
              ],
            },
          ],
          pagination: {
            total: 1,
            page: query?.page || 1,
            limit: query?.limit || 10,
            total_pages: 1,
          },
        },
        meta: { 
          success: true,
          message: 'Mock documents loaded',
        },
      };
    }
    const { data } = await apiClient.get<ApiResponse<ListDocumentsData>>('/documents', {
      params: query,
    });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Document>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          job_id: 'job-1',
          source_file: { id: 'sf-1', file_name: 'invoice-1.pdf' },
          vendor: { id: 'v-1', name: 'Mock Vendor' },
          document_type: { id: 'dt-1', code: 'INV', name: 'Invoice' },
          start_page: 1,
          end_page: 1,
          status: 'completed',
          confidence: '0.98',
          needs_review: false,
          created_at: new Date().toISOString(),
          fields: [
            { key: 'invoice_number', value: 'INV-001' },
            { key: 'total_amount', value: '150.00' },
          ],
        },
        meta: { success: true },
      };
    }
    const { data } = await apiClient.get<ApiResponse<Document>>(`/documents/${id}`);
    return data;
  },

  retry: async (id: string): Promise<ApiResponse<Document>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        data: {
          id,
          job_id: "job-1",
          source_file: { id: "sf-1", file_name: "invoice-1.pdf" },
          vendor: { id: "v-1", name: "Mock Vendor" },
          document_type: { id: "dt-1", code: "INV", name: "Invoice" },
          start_page: 1,
          end_page: 1,
          status: "queued",
          confidence: "0.98",
          needs_review: false,
          created_at: new Date().toISOString(),
        },
        meta: { success: true, message: "Wait for retry processing..." },
      };
    }
    const { data } = await apiClient.post<ApiResponse<Document>>(
      `/documents/${id}/retry`
    );
    return data;
  },
};
