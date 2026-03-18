import { useQuery } from "@tanstack/react-query";
import { documentsService } from "../api/documents.service";
import { ListDocumentsQuery } from "../model/documents.schema";

export const useDocuments = (query?: ListDocumentsQuery) => {
  const useDocumentsList = () => {
    return useQuery({
      queryKey: ["documents", query],
      queryFn: () => documentsService.list(query),
    });
  };

  const useDocumentDetail = (id: string) => {
    return useQuery({
      queryKey: ["documents", id],
      queryFn: () => documentsService.getById(id),
      enabled: !!id,
    });
  };

  return {
    useDocumentsList,
    useDocumentDetail,
  };
};
