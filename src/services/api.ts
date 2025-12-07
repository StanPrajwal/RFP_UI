import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../config/axios';
import type { ChatResponse, ChatMessage, Product, GenerateRFPResponse, CreateRFPRequest, CreateRFPResponse, FetchAllRFPResponse, AssignVendorsResponse, SendRFPResponse, FetchProposalsResponse, FetchComparisonResponse, FetchVendorsResponse } from './interface.service';


// API functions
export const chatApi = {
  sendMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    const response = await axiosInstance.post<ChatResponse>('/chat', {
      message,
      conversationId,
    });
    return response.data;
  },

  getConversation: async (conversationId: string): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get<ChatMessage[]>(`/chat/${conversationId}`);
    return response.data;
  },
};

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/products');
    return response.data;
  },
};

// RFP API functions
export const rfpApi = {
  generateRfp: async (description: string): Promise<GenerateRFPResponse> => {
    const response = await axiosInstance.post<GenerateRFPResponse>('/rfp/generate-rfp', {
      description,
    });
    return response.data;
  },

  createRfp: async (data: CreateRFPRequest): Promise<CreateRFPResponse> => {
    const response = await axiosInstance.post<CreateRFPResponse>('/rfp/create', data);
    return response.data;
  },

  fetchAllRfps: async (): Promise<FetchAllRFPResponse> => {
    const response = await axiosInstance.get<FetchAllRFPResponse>('/rfp/fetch-all-rfp');
    return response.data;
  },

  assignVendors: async (rfpId: string, vendorIds: string[]): Promise<AssignVendorsResponse> => {
    const response = await axiosInstance.post<AssignVendorsResponse>(`/rfp/${rfpId}/vendors`, {
      vendorIds,
    });
    return response.data;
  },

  sendRfp: async (rfpId: string, vendorIds: string[]): Promise<SendRFPResponse> => {
    const response = await axiosInstance.post<SendRFPResponse>(`/rfp/${rfpId}/send`, {
      vendorIds,
    });
    return response.data;
  },

  fetchProposals: async (rfpId: string): Promise<FetchProposalsResponse> => {
    const response = await axiosInstance.get<FetchProposalsResponse>(`/rfp/${rfpId}/proposals`);
    return response.data;
  },

  fetchComparison: async (rfpId: string): Promise<FetchComparisonResponse> => {
    const response = await axiosInstance.get<FetchComparisonResponse>(`/rfp/${rfpId}/compare`);
    return response.data;
  },
};

export const vendorApi = {
  fetchVendors: async (): Promise<FetchVendorsResponse> => {
    const response = await axiosInstance.get<FetchVendorsResponse>('/vendor/fetch-vendors');
    return response.data;
  },
};

// React Query hooks
export const useChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, conversationId }: { message: string; conversationId?: string }) =>
      chatApi.sendMessage(message, conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });
};

export const useGenerateRfp = () => {
  return useMutation({
    mutationFn: (description: string) => rfpApi.generateRfp(description),
  });
};

export const useCreateRfp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRFPRequest) => rfpApi.createRfp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
};

export const useFetchAllRfps = () => {
  return useQuery({
    queryKey: ['rfps'],
    queryFn: () => rfpApi.fetchAllRfps(),
  });
};

export const useAssignVendors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rfpId, vendorIds }: { rfpId: string; vendorIds: string[] }) =>
      rfpApi.assignVendors(rfpId, vendorIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
};

export const useSendRfp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rfpId, vendorIds }: { rfpId: string; vendorIds: string[] }) =>
      rfpApi.sendRfp(rfpId, vendorIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
};

export const useFetchVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorApi.fetchVendors(),
  });
};

export const useFetchProposals = (rfpId: string | undefined) => {
  return useQuery({
    queryKey: ['proposals', rfpId],
    queryFn: () => (rfpId ? rfpApi.fetchProposals(rfpId) : null),
    enabled: !!rfpId,
  });
};

export const useFetchComparison = (rfpId: string | undefined) => {
  return useQuery({
    queryKey: ['comparison', rfpId],
    queryFn: () => (rfpId ? rfpApi.fetchComparison(rfpId) : null),
    enabled: !!rfpId,
  });
};

export const useGetConversation = (conversationId: string | null) => {
  return useQuery({
    queryKey: ['chat', conversationId],
    queryFn: () => (conversationId ? chatApi.getConversation(conversationId) : []),
    enabled: !!conversationId,
  });
};

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productApi.getProducts,
  });
};
