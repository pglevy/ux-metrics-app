import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  TextField,
  DropdownField,
  RichTextDisplayField,
} from '@pglevy/sailwind'
import type { Ticket, CreateTicketRequest, TicketStatus } from '@api/types'

/**
 * Tickets Page - Example Prototype
 *
 * This page demonstrates the schema-first workflow:
 * 1. API contract defines the Ticket entity and endpoints
 * 2. Types are generated from the schema
 * 3. UI prototype uses those types
 * 4. As prototype evolves, schema-evolution skill keeps contract in sync
 */

export default function Tickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Create form state
  const [newTicket, setNewTicket] = useState<CreateTicketRequest>({
    title: '',
    description: '',
    assignee: null,
  })

  // Load tickets (using mock data for prototype)
  useEffect(() => {
    loadTickets()
  }, [filter])

  const loadTickets = async () => {
    setLoading(true)
    try {
      // In real app: await api.tickets.list({ status: filter !== 'all' ? filter : undefined })
      // For prototype, using mock data:
      const mockTickets: Ticket[] = [
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

      const filtered = filter === 'all'
        ? mockTickets
        : mockTickets.filter(t => t.status === filter)

      setTickets(filtered)
    } catch (error) {
      console.error('Failed to load tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async () => {
    try {
      // In real app: await api.tickets.create(newTicket)
      // For prototype, simulate creation:
      const created: Ticket = {
        id: String(Date.now()),
        ...newTicket,
        status: 'open',
        assignee: newTicket.assignee || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTickets([created, ...tickets])
      setNewTicket({ title: '', description: '', assignee: null })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create ticket:', error)
    }
  }

  const getStatusBadgeColor = (status: TicketStatus) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-green-100 text-green-800'
    }
  }

  const formatStatus = (status: TicketStatus) => {
    return status.replace('_', ' ').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <HeadingField
            text="Tickets"
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <ButtonWidget
            label="← Back to Home"
            style="OUTLINE"
            color="NEUTRAL"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Filter and Create Section */}
        <CardLayout padding="MORE" showShadow={true}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <DropdownField
                label="Filter by Status"
                choiceLabels={['All Tickets', 'Open', 'In Progress', 'Closed']}
                choiceValues={['all', 'open', 'in_progress', 'closed']}
                value={filter}
                onChange={(value) => setFilter(value as TicketStatus | 'all')}
              />
            </div>
            <div className="pt-6">
              <ButtonWidget
                label={showCreateForm ? 'Cancel' : '+ New Ticket'}
                style={showCreateForm ? 'OUTLINE' : 'SOLID'}
                color={showCreateForm ? 'NEUTRAL' : 'ACCENT'}
                onClick={() => setShowCreateForm(!showCreateForm)}
              />
            </div>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="border-t pt-4 mt-4">
              <HeadingField
                text="Create New Ticket"
                size="MEDIUM"
                headingTag="H3"
                marginBelow="STANDARD"
              />

              <TextField
                label="Title"
                value={newTicket.title}
                onChange={(value) => setNewTicket({ ...newTicket, title: value })}
                required={true}
                marginBelow="STANDARD"
              />

              <div className="mb-4">
                <label className="block text-base font-medium mb-1.5">
                  Description <span className="text-red-700">*</span>
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  required={true}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <TextField
                label="Assignee (optional)"
                value={newTicket.assignee || ''}
                onChange={(value) => setNewTicket({ ...newTicket, assignee: value || null })}
                marginBelow="MORE"
              />

              <ButtonWidget
                label="Create Ticket"
                style="SOLID"
                color="ACCENT"
                onClick={handleCreateTicket}
                disabled={!newTicket.title || !newTicket.description}
              />
            </div>
          )}
        </CardLayout>

        {/* Tickets List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <CardLayout padding="MORE" showShadow={true}>
              <RichTextDisplayField value={['Loading tickets...']} />
            </CardLayout>
          ) : tickets.length === 0 ? (
            <CardLayout padding="MORE" showShadow={true}>
              <RichTextDisplayField value={['No tickets found.']} />
            </CardLayout>
          ) : (
            tickets.map((ticket) => (
              <CardLayout key={ticket.id} padding="MORE" showShadow={true}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <HeadingField
                        text={ticket.title}
                        size="MEDIUM"
                        headingTag="H3"
                        marginBelow="NONE"
                      />
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{ticket.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div>
                        <strong>ID:</strong> {ticket.id}
                      </div>
                      {ticket.assignee && (
                        <div>
                          <strong>Assignee:</strong> {ticket.assignee}
                        </div>
                      )}
                      <div>
                        <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardLayout>
            ))
          )}
        </div>

        {/* Schema-First Workflow Note */}
        <div className="mt-8">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="💡 Schema-First Workflow"
              size="SMALL"
              headingTag="H4"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                "This page demonstrates the schema-first approach:",
                "",
                "1. **API Contract** (schema/api-contract.yaml) defines Ticket entity and endpoints",
                "2. **Types Generated** (api/types/) from the schema",
                "3. **Prototype Uses Types** - ensuring type safety and alignment",
                "4. **Schema Evolves** - as you add features (like filtering), schema-evolution skill keeps contract in sync",
                "",
                "Try adding a new field (like 'priority') to see how the workflow helps maintain consistency!"
              ]}
            />
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
