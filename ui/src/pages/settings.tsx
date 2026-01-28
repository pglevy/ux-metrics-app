import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
} from '@pglevy/sailwind'
import { exportAllData, importData, type ImportResult } from '../services/backupService'
import { resetToSeedData } from '../data/seedData'

/**
 * Settings Page
 * 
 * Provides data management controls including backup/restore and seed data reset.
 * 
 * **Validates: Requirements 12.4, 13.7**
 * - 12.4: Manual export/import (download JSON file, upload to restore)
 * - 13.7: Reset to seed data functionality
 */

export default function Settings() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [importing, setImporting] = useState(false)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    // Auto-clear after 5 seconds
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = () => {
    const result = exportAllData()
    if (result.success) {
      showMessage('success', 'Data exported successfully! Check your downloads folder.')
    } else {
      showMessage('error', result.error || 'Failed to export data')
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const result: ImportResult = await importData(file)
      if (result.success && result.counts) {
        showMessage(
          'success',
          `Data imported successfully! Loaded ${result.counts.studies} studies, ${result.counts.sessions} sessions, ${result.counts.people} people.`
        )
      } else {
        showMessage('error', result.error || 'Failed to import data')
      }
    } catch (error) {
      showMessage('error', 'An unexpected error occurred during import')
    } finally {
      setImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleResetSeedData = () => {
    if (!confirm('This will delete all existing data and replace it with demonstration data. Are you sure?')) {
      return
    }

    const success = resetToSeedData()
    if (success) {
      showMessage('success', 'Data reset to seed data successfully!')
    } else {
      showMessage('error', 'Failed to reset data')
    }
  }

  return (
    <div className="with-sidebar min-h-screen page-animate" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <HeadingField
            text="Settings"
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

        {/* Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Data Backup Section */}
        <CardLayout padding="MORE" showShadow={true}>
          <HeadingField
            text="Data Backup & Restore"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="STANDARD"
          />
          <RichTextDisplayField
            value={[
              'Export your data as a JSON file for backup, or import a previously exported file to restore your data.',
              '',
              'Note: Importing data will replace all existing data.',
            ]}
            marginBelow="MORE"
          />
          <div className="flex gap-4">
            <ButtonWidget
              label="Export Data"
              style="SOLID"
              color="ACCENT"
              onClick={handleExport}
            />
            <ButtonWidget
              label={importing ? 'Importing...' : 'Import Data'}
              style="OUTLINE"
              color="ACCENT"
              onClick={handleImportClick}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardLayout>

        {/* Seed Data Section */}
        <div className="mt-6">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Demonstration Data"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                'Reset the application to use demonstration seed data. This is useful for testing or starting fresh with example data.',
                '',
                'Warning: This will delete all existing data!',
              ]}
              marginBelow="MORE"
            />
            <ButtonWidget
              label="Reset to Seed Data"
              style="OUTLINE"
              color="NEGATIVE"
              onClick={handleResetSeedData}
            />
          </CardLayout>
        </div>

        {/* About Section */}
        <div className="mt-6">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="About"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                'UX Metrics Capture and Review Application',
                '',
                'A tool for capturing and analyzing usability testing metrics including:',
                '• Task Success Rate',
                '• Time on Task',
                '• Task Efficiency',
                '• Error Rate',
                '• Single Ease Question (SEQ)',
                '',
                'Data is stored locally in your browser using localStorage.',
              ]}
            />
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
