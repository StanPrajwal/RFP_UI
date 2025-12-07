// Types for API responses
export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  [key: string]: any;
}

export interface ChatResponse {
  message: string;
  products?: Product[];
  [key: string]: any;
}

// RFP Types
export interface RFPItem {
  item: string;
  quantity: number;
  specs: string | null;
  _id?: string;
}

export interface StructuredRFP {
  budget: number;
  currency: string;
  currencySymbol: string;
  deliveryTimeline: string;
  paymentTerms: string;
  warranty: string;
  items: RFPItem[];
}

export interface GenerateRFPResponse {
  code: number;
  message: string;
  structuredRfp: {
    title: string;
    descriptionRaw: string;
    descriptionStructured: StructuredRFP;
  };
}

export interface CreateRFPRequest {
  title: string;
  descriptionRaw: string;
  descriptionStructured: StructuredRFP;
}

export interface CreateRFPResponse {
  code: number;
  success: boolean;
  message: string;
  data?: {
    _id: string;
  };
}

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  __v?: number;
}

export interface FetchVendorsResponse {
  code: number;
  message: string;
  data: Vendor[];
}

export interface RFP {
  _id: string;
  title: string;
  descriptionRaw: string;
  descriptionStructured: StructuredRFP;
  vendorsInvited: string[];
  status: 'draft' | 'sent';
  createdAt: string;
  __v?: number;
}

export interface FetchAllRFPResponse {
  code: number;
  message: string;
  data: RFP[];
}

export interface AssignVendorsRequest {
  vendorIds: string[];
}

export interface AssignVendorsResponse {
  code: number;
  message: string;
}

export interface SendRFPRequest {
  vendorIds: string[];
}

export interface SendRFPResponse {
  code: number;
  message: string;
}

// Proposal Types
export interface ProposalItem {
  item: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  _id?: string;
}

export interface ParsedProposal {
  totalPrice: number;
  currency: string;
  paymentTerms: string;
  deliveryTimeline: string;
  warranty: string;
  items: ProposalItem[];
  additionalNotes?: string;
}

export interface Proposal {
  id: string;
  vendorId: Vendor;
  parsed: ParsedProposal;
  scoring?: Record<string, any>;
  createdAt: string;
}

export interface FetchProposalsResponse {
  code: number;
  message: string;
  data: {
    rfpId: string;
    rfpTitle: string;
    totalProposals: number;
    proposals: Proposal[];
  };
}

// Comparison Types
export interface BestPrice {
  vendorId: string;
  vendorName: string;
  price: number;
  currency: string;
}

export interface BestDelivery {
  vendorId: string;
  vendorName: string;
  timeline: string;
}

export interface BestOverall {
  vendorId: string;
  vendorName: string;
  score: number;
  reason: string;
}

export interface ComparisonSummary {
  totalProposals: number;
  note?: string;
  bestPrice?: BestPrice;
  bestDelivery?: BestDelivery;
  bestOverall?: BestOverall;
}

export interface ComparisonTableItem {
  vendorId: string;
  vendorName: string;
  totalPrice: number;
  currency: string;
  deliveryTimeline: string;
  paymentTerms: string;
  warranty: string;
  overallScore: number;
  priceScore?: number;
  deliveryScore?: number;
  warrantyScore?: number;
  completenessScore?: number;
  aiRecommendation?: string;
  strengths: string[];
  weaknesses: string[];
}

export interface Recommendation {
  recommendedVendorId: string;
  recommendedVendorName: string;
  reasoning: string;
  keyFactors: string[];
}

export interface ComparisonData {
  summary: ComparisonSummary;
  comparisonTable: ComparisonTableItem[];
  recommendation: Recommendation;
}

export interface FetchComparisonResponse {
  code: number;
  message: string;
  data: {
    rfpId: string;
    rfpTitle: string;
    totalProposals: number;
    comparison: ComparisonData | null;
  };
}
