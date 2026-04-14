import { env } from '@/shared/config/env';
import { apiClient } from '@/shared/api/axios';
import { ApiResponse } from '@/shared/types/api-response';
import { 
  Document, 
  ListDocumentsQuery
} from '../model/documents.schema';

export const documentsService = {
  list: async (query?: ListDocumentsQuery): Promise<ApiResponse<Document[]>> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
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
            confidence: 0.98,
            needs_review: false,
            created_at: new Date().toISOString(),
            fields: [
              { key: 'invoice_number', value: 'INV-001' },
              { key: 'total_amount', value: '150.00' },
            ],
          },
        ],
        pagination: {
          total_items: 1,
          page: query?.page || 1,
          limit: query?.limit || 10,
          total_pages: 1,
          has_next_page: false,
          has_prev_page: false
        },
        meta: { 
          success: true,
          message: 'Mock documents loaded',
        },
      };
    }
    const { data } = await apiClient.get<ApiResponse<Document[]>>('/documents', {
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
          confidence: 0.98,
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
          confidence: 0.98,
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

  getRawById: async (id: string): Promise<unknown> => {
    if (env.NEXT_PUBLIC_MOCK_API) {
      return {
        InvoiceResponse: {
          data: {
            bill_to_name: "PT. SCHNEIDER ELECTRIC MANUFACTURING BATAM",
            bill_to_address: "BLK 4 MUKA KUNING BATAM ISLAND Riau 29433 Indonesia",
            seller_name: "ARROW ELECTRONICS ASIA (S) PTE. LTD.",
            seller_address: "Arrow Components (M) Sdn Bhd D20-2, Jalan DPB/3, PTP (FCZ) 81560 Gelang Patah, Johor, MY",
            seller_country: "MY",
            seller_country_code: "MY",
            seller_phone: null,
            seller_tax: null,
            buyer_name: "PT. SCHNEIDER ELECTRIC MANUFACTURING BATAM",
            buyer_address: "BLK 4 MUKA KUNING BATAM ISLAND Riau 29433 Indonesia",
            buyer_country: "Indonesia",
            buyer_country_code: null,
            buyer_phone: null,
            buyer_tax: null,
            buyer_customs_id: null,
            ship_to: "Maersk Logistics & Services Singapore Pte. Ltd. Receiving Department Batamindo KD Warehouse 519 Kampong Bahru Road #01-107 099449 Singapore",
            ship_to_city: "Singapore",
            payment_terms: "75 NET",
            payment_terms_code: null,
            inco_terms: "FCA",
            freight_terms: null,
            total: 136.2,
            currency_code: "USD",
            packaging_type: null,
            invoice_list: [
              {
                invoice_number: "13834776",
                invoice_date: "2025-02-05",
                items: [
                  {
                    number: "001",
                    prod_number: "RT0402BRD0710KL",
                    description: "Res Thin Film 0402 10K ohm 0.1% 0.063W(1/16W) ±25ppm/°C Pad SMD T/R",
                    quantity: 10000,
                    hs_code: "8533210030",
                    uom: "EA",
                    origin: null,
                    origin_code: null,
                    vendor_name: null,
                    vendor_number: null,
                    unit_price: 0.01362,
                    amount: 136.2,
                    currency: "USD",
                    packaging_type_item: null
                  },
                  {
                    number: null,
                    prod_number: null,
                    description: null,
                    quantity: 10000,
                    hs_code: null,
                    uom: "EA",
                    origin: null,
                    origin_code: "TW",
                    vendor_name: null,
                    vendor_number: null,
                    unit_price: null,
                    amount: null,
                    currency: "USD",
                    packaging_type_item: null
                  }
                ]
              }
            ],
            details_list: [
              {
                number: "001",
                brand: "YAGEO",
                description: "Res Thin Film 0402 10K ohm 0.1% 0.063W(1/16W) ±25ppm/°C Pad SMD T/R",
                quantity: 10000,
                hs_code: "8533210030",
                product_number: "1RES008304",
                unique_identifier: null,
                uom: "EA",
                origin: null,
                origin_code: null,
                vendor_name: null,
                vendor_number: null,
                unit_price: 0.01362,
                amount: 136.2,
                currency: "USD",
                packaging_type_item: null
              },
              {
                number: null,
                brand: null,
                description: null,
                quantity: 10000,
                hs_code: null,
                product_number: null,
                unique_identifier: "2451",
                uom: "EA",
                origin: null,
                origin_code: "TW",
                vendor_name: null,
                vendor_number: null,
                unit_price: null,
                amount: null,
                currency: "USD",
                packaging_type_item: null
              }
            ],
            banks: []
          }
        }
      };
    }
    const { data } = await apiClient.get<unknown>(
      `/documents/${id}?raw=true`
    );
    return data;
  },
};
