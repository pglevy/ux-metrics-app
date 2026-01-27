/**
 * Mock Tickets API
 *
 * Simple in-memory implementation of the tickets API contract.
 * In a real system, this would be replaced by actual backend implementation.
 */

import type { Ticket, CreateTicketRequest, UpdateTicketRequest, ListTicketsParams } from '../types'

// In-memory storage
let tickets: Ticket[] = [
  {
    id: '1',
    title: 'Setup development environment',
    description: 'Install dependencies and configure local development setup',
    status: 'closed',
    assignee: 'Alice',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Implement ticket filtering',
    description: 'Add ability to filter tickets by status and assignee',
    status: 'in_progress',
    assignee: 'Bob',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all API endpoints and data models',
    status: 'open',
    assignee: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

let nextId = 4

export const mockTicketsAPI = {
  async listTickets(params?: ListTicketsParams): Promise<Ticket[]> {
    let filtered = tickets

    if (params?.status) {
      filtered = filtered.filter(t => t.status === params.status)
    }

    if (params?.assignee) {
      filtered = filtered.filter(t => t.assignee === params.assignee)
    }

    return filtered
  },

  async getTicket(id: string): Promise<Ticket | null> {
    return tickets.find(t => t.id === id) || null
  },

  async createTicket(request: CreateTicketRequest): Promise<Ticket> {
    const now = new Date().toISOString()
    const ticket: Ticket = {
      id: String(nextId++),
      title: request.title,
      description: request.description,
      status: 'open',
      assignee: request.assignee || null,
      createdAt: now,
      updatedAt: now,
    }

    tickets.push(ticket)
    return ticket
  },

  async updateTicket(id: string, request: UpdateTicketRequest): Promise<Ticket | null> {
    const ticket = tickets.find(t => t.id === id)
    if (!ticket) return null

    if (request.title !== undefined) ticket.title = request.title
    if (request.description !== undefined) ticket.description = request.description
    if (request.status !== undefined) ticket.status = request.status
    if (request.assignee !== undefined) ticket.assignee = request.assignee

    ticket.updatedAt = new Date().toISOString()

    return ticket
  },

  // Helper to reset state (useful for testing/demos)
  reset() {
    tickets = [
      {
        id: '1',
        title: 'Setup development environment',
        description: 'Install dependencies and configure local development setup',
        status: 'closed',
        assignee: 'Alice',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        title: 'Implement ticket filtering',
        description: 'Add ability to filter tickets by status and assignee',
        status: 'in_progress',
        assignee: 'Bob',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all API endpoints and data models',
        status: 'open',
        assignee: null,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ]
    nextId = 4
  }
}
