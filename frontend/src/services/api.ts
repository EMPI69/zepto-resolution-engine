import { API_BASE_URL } from '../config';
import {
  HealthCheckResponse,
  TicketResolutionResponse,
  TicketsResponse
} from '../types';

export async function checkHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data: HealthCheckResponse = await response.json();
      return data?.status === 'ok' || response.status === 200;
    }
    return false;
  } catch (error) {
    console.error('Health check error:', error);
    return false;
  }
}

export async function getTickets(): Promise<TicketsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;

    try {
      const errData = await response.json();

      if (errData?.detail) {
        errorMsg =
          typeof errData.detail === 'string'
            ? errData.detail
            : JSON.stringify(errData.detail);
      }
    } catch {
      // Use default error message
    }

    throw new Error(errorMsg);
  }

  const data: TicketsResponse = await response.json();
  return data;
}

export async function resolveTicket(ticketId: string): Promise<TicketResolutionResponse> {
  const cleanId = ticketId.trim();
  if (!cleanId) {
    throw new Error('Please enter a valid Ticket ID.');
  }

  const response = await fetch(`${API_BASE_URL}/api/tickets/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ ticket_id: cleanId }),
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errData = await response.json();
      if (errData?.detail) {
        errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      } else if (errData?.message) {
        errorMsg = errData.message;
      }
    } catch {
      // Use default errorMsg
    }
    throw new Error(errorMsg);
  }

  const data: TicketResolutionResponse = await response.json();
  return data;
}
