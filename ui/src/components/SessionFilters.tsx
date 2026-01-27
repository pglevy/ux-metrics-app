import { useState, useEffect } from 'react'
import {
  CardLayout,
  DropdownField,
  TextField,
  ButtonWidget,
  HeadingField,
} from '@pglevy/sailwind'
import type { Person } from '../../../api/types'
import { getAllPeople } from '../services/personService'
import type { SessionFilters as SessionFiltersType } from '../services/sessionService'

/**
 * SessionFilters Component
 *
 * Provides filter controls for sessions including participant, facilitator,
 * and date range filters using Sailwind components.
 *
 * **Validates: Requirements 2.5** - Filter sessions by participant, facilitator, or date range
 */

interface SessionFiltersProps {
  /** Current filter values */
  filters: SessionFiltersType
  /** Callback when filters change */
  onFiltersChange: (filters: SessionFiltersType) => void
  /** Optional callback to clear all filters */
  onClearFilters?: () => void
}

export default function SessionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: SessionFiltersProps) {
  const [people, setPeople] = useState<Person[]>([])

  // Load people list on mount
  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = () => {
    try {
      const allPeople = getAllPeople()
      setPeople(allPeople)
    } catch (error) {
      console.error('Failed to load people:', error)
    }
  }

  // Get participants and facilitators from people list
  const participants = people.filter((p) => p.role === 'participant')
  const facilitators = people.filter((p) => p.role === 'facilitator')

  // Prepare dropdown options
  const participantLabels = ['All Participants', ...participants.map((p) => p.name)]
  const participantValues = ['', ...participants.map((p) => p.id)]
  const facilitatorLabels = ['All Facilitators', ...facilitators.map((f) => f.name)]
  const facilitatorValues = ['', ...facilitators.map((f) => f.id)]

  // Handle participant filter change
  const handleParticipantChange = (value: string) => {
    onFiltersChange({
      ...filters,
      participantId: value || undefined,
    })
  }

  // Handle facilitator filter change
  const handleFacilitatorChange = (value: string) => {
    onFiltersChange({
      ...filters,
      facilitatorId: value || undefined,
    })
  }

  // Handle date from change
  const handleDateFromChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dateFrom: value || undefined,
    })
  }

  // Handle date to change
  const handleDateToChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dateTo: value || undefined,
    })
  }

  // Handle clear filters
  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters()
    } else {
      onFiltersChange({
        studyId: filters.studyId, // Preserve studyId
      })
    }
  }

  // Check if any filters are active (excluding studyId)
  const hasActiveFilters =
    filters.participantId ||
    filters.facilitatorId ||
    filters.dateFrom ||
    filters.dateTo

  return (
    <CardLayout padding="MORE" showShadow={true}>
      <div className="flex items-center justify-between mb-4">
        <HeadingField
          text="Filter Sessions"
          size="SMALL"
          headingTag="H3"
          marginBelow="NONE"
        />
        {hasActiveFilters && (
          <ButtonWidget
            label="Clear Filters"
            style="OUTLINE"
            color="NEUTRAL"
            onClick={handleClearFilters}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Participant Filter */}
        <div>
          <DropdownField
            label="Participant"
            choiceLabels={participantLabels}
            choiceValues={participantValues}
            value={filters.participantId || ''}
            onChange={handleParticipantChange}
            labelPosition="ABOVE"
            marginBelow="NONE"
          />
        </div>

        {/* Facilitator Filter */}
        <div>
          <DropdownField
            label="Facilitator"
            choiceLabels={facilitatorLabels}
            choiceValues={facilitatorValues}
            value={filters.facilitatorId || ''}
            onChange={handleFacilitatorChange}
            labelPosition="ABOVE"
            marginBelow="NONE"
          />
        </div>

        {/* Date From Filter */}
        <div>
          <TextField
            label="From Date"
            value={filters.dateFrom || ''}
            onChange={handleDateFromChange}
            labelPosition="ABOVE"
            marginBelow="NONE"
            placeholder="YYYY-MM-DD"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <TextField
            label="To Date"
            value={filters.dateTo || ''}
            onChange={handleDateToChange}
            labelPosition="ABOVE"
            marginBelow="NONE"
            placeholder="YYYY-MM-DD"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <strong>Active Filters:</strong>{' '}
            {[
              filters.participantId &&
                `Participant: ${participants.find((p) => p.id === filters.participantId)?.name || 'Unknown'}`,
              filters.facilitatorId &&
                `Facilitator: ${facilitators.find((f) => f.id === filters.facilitatorId)?.name || 'Unknown'}`,
              filters.dateFrom && `From: ${filters.dateFrom}`,
              filters.dateTo && `To: ${filters.dateTo}`,
            ]
              .filter(Boolean)
              .join(' | ')}
          </div>
        </div>
      )}
    </CardLayout>
  )
}
