export interface Precedent {
  ticket_id: string;
  description: string;
  category: string;
  action: string;
  resolution_note: string;
  csat: number;
  similarity: number;
}

export interface OrderContextData {
  order_id: string;
  items: number;
  value_inr: number;
  delivery_time_min: number;
  delivery_status: string;
}

export interface PolicyCheck {
  rule: string;
  passed: boolean;
  reason: string;
}

export interface TicketResolutionResponse {
  ticket_id: string;
  description: string;
  decision: 'AUTO_RESOLVE' | 'HUMAN_REVIEW' | string;
  suggested_action: string;
  executed_action: string | null;
  retrieval_confidence: number;
  resolution_confidence: number;
  top3_agreement: number;
  reason: string;
  precedents: Precedent[];
  action_distribution: Record<string, number>;
  order: OrderContextData | null;
  policy_checks: PolicyCheck[];
}

export interface HealthCheckResponse {
  status: string;
  [key: string]: any;
}

export interface TicketSummary {
  ticket_id: string;
  description: string;
  order_id: string;
}

export interface TicketsResponse {
  total: number;
  tickets: TicketSummary[];
}
