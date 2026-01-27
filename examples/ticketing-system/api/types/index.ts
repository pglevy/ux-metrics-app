/**
 * API Types
 *
 * Generated from schema/api-contract.yaml
 *
 * These types represent the contract between the UI prototype and the API.
 * They should be regenerated whenever the schema changes.
 */

export type TicketStatus = 'open' | 'in_progress' | 'closed'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  assignee: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTicketRequest {
  title: string
  description: string
  assignee?: string | null
}

export interface UpdateTicketRequest {
  title?: string
  description?: string
  status?: TicketStatus
  assignee?: string | null
}

export interface ListTicketsParams {
  status?: TicketStatus
  assignee?: string
}
