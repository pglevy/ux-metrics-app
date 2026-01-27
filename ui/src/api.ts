/**
 * API Client
 *
 * Create your API client here after defining your schema.
 *
 * Workflow:
 * 1. Define your schema in schema/api-contract.yaml
 * 2. Generate types (see api/types/README.md)
 * 3. Import generated types here
 * 4. Create fetch functions for each endpoint
 *
 * See examples/ticketing-system/ui/src/api.ts for a working example.
 */

// Example structure (replace with your generated types):
//
// import type { Ticket, CreateTicketRequest } from '../../api/types'
//
// const API = '/api'
//
// export async function getTickets(): Promise<Ticket[]> {
//   const res = await fetch(`${API}/tickets`)
//   if (!res.ok) throw new Error('Failed to fetch tickets')
//   return res.json()
// }
//
// export async function createTicket(data: CreateTicketRequest): Promise<Ticket> {
//   const res = await fetch(`${API}/tickets`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   })
//   if (!res.ok) throw new Error('Failed to create ticket')
//   return res.json()
// }
