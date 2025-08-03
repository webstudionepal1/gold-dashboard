import React, { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { DropdownField } from '../../../components/shared/form_components/Dropdown'
import { InputField } from '../../../components/shared/form_components/InputField'
import { Button } from '../../../components/shared/form_components/Button'

interface CalculationRow {
  id: string
  name: string
  type: 'flat' | 'percent'
  charge: number
}

interface CalculationSection {
  title: string
  rows: CalculationRow[]
}

const CalculatorIndex = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<'gold' | 'diamond' | ''>('')
  const [incrementSection, setIncrementSection] = useState<CalculationSection>({
    title: 'Increment Calculations',
    rows: []
  })
  const [decrementSection, setDecrementSection] = useState<CalculationSection>({
    title: 'Decrement Calculations',
    rows: []
  })

  const materialOptions = [
    { value: '', label: 'Select Material' },
    { value: 'gold', label: 'Gold' },
    { value: 'diamond', label: 'Diamond' }
  ]

  const chargeTypeOptions = [
    { value: 'flat', label: 'Flat' },
    { value: 'percent', label: 'Percent' }
  ]

  const addCalculationRow = (section: 'increment' | 'decrement') => {
    const newRow: CalculationRow = {
      id: Date.now().toString(),
      name: '',
      type: 'flat',
      charge: 0
    }

    if (section === 'increment') {
      setIncrementSection(prev => ({
        ...prev,
        rows: [...prev.rows, newRow]
      }))
    } else {
      setDecrementSection(prev => ({
        ...prev,
        rows: [...prev.rows, newRow]
      }))
    }
  }

  const updateCalculationRow = (
    section: 'increment' | 'decrement',
    rowId: string,
    field: keyof CalculationRow,
    value: string | number
  ) => {
    const updateSection = section === 'increment' ? setIncrementSection : setDecrementSection

    updateSection(prev => ({
      ...prev,
      rows: prev.rows.map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    }))
  }

  const removeCalculationRow = (section: 'increment' | 'decrement', rowId: string) => {
    const updateSection = section === 'increment' ? setIncrementSection : setDecrementSection

    updateSection(prev => ({
      ...prev,
      rows: prev.rows.filter(row => row.id !== rowId)
    }))
  }

  const renderCalculationSection = (
    section: CalculationSection,
    sectionType: 'increment' | 'decrement'
  ) => (
    <div className="bg-white rounded-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
          <Icon
            icon={sectionType === 'increment' ? 'material-symbols:add-circle' : 'material-symbols:remove-circle'}
            className={`w-4 h-4 ${sectionType === 'increment' ? 'text-green-600' : 'text-red-600'}`}
          />
          {section.title}
        </h3>
        <Button
          onClick={() => addCalculationRow(sectionType)}
          variant="primary"
          size="xs"
          icon="material-symbols:add"
        >
          Add Row
        </Button>
      </div>

      {section.rows.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <Icon icon="material-symbols:calculate" className="w-8 h-8 mx-auto mb-1 opacity-50" />
          <p className="text-sm">No calculations added yet</p>
          <p className="text-xs">Click "Add Row" to start adding calculations</p>
        </div>
      ) : (
        <div className="space-y-2">
          {section.rows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-sm">
              <div className="md:col-span-1">
                <InputField
                  label={index === 0 ? "Name" : ""}
                  placeholder="Enter calculation name"
                  value={row.name}
                  onChange={(e) => updateCalculationRow(sectionType, row.id, 'name', e.target.value)}
                  icon="material-symbols:edit"
                  helperText={index === 0 ? "Descriptive name for this calculation" : undefined}
                />
              </div>

              <div className="md:col-span-1">
                <DropdownField
                  label={index === 0 ? "Type" : ""}
                  options={chargeTypeOptions}
                  value={row.type}
                  onChange={(e) => updateCalculationRow(sectionType, row.id, 'type', e.target.value as 'flat' | 'percent')}
                  icon="material-symbols:category"
                  helperText={index === 0 ? "Choose calculation method" : undefined}
                />
              </div>

              <div className="md:col-span-1">
                <InputField
                  label={index === 0 ? "Charge" : ""}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={row.charge.toString()}
                  onChange={(e) => updateCalculationRow(sectionType, row.id, 'charge', parseFloat(e.target.value) || 0)}
                  icon={row.type === 'percent' ? 'material-symbols:percent' : 'material-symbols:attach-money'}
                  helperText={index === 0 ? (row.type === 'percent' ? "Percentage value" : "Fixed amount") : undefined}
                />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button
                  onClick={() => removeCalculationRow(sectionType, row.id)}
                  variant="danger"
                  size="xs"
                  icon="material-symbols:delete"
                  title="Remove row"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Compact Header with Material Selection */}
      <div className="bg-white rounded-sm border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Icon icon="material-symbols:calculate" className="w-5 h-5 text-amber-600" />
              Price Calculator
              {selectedMaterial && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className={`text-sm font-medium ${selectedMaterial === 'gold' ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)}
                  </span>
                </>
              )}
            </h1>
            <p className="text-gray-600 text-xs mt-1">
              Configure pricing calculations with custom increment and decrement rules
            </p>
          </div>
        </div>

        <div className="max-w-sm">
          <DropdownField
            label="Material Type"
            options={materialOptions}
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value as 'gold' | 'diamond' | '')}
            required
            icon="material-symbols:diamond"
            helperText="Choose the material type for calculations"
          />
        </div>
      </div>

      {/* Calculation Sections - Only show when material is selected */}
      {selectedMaterial && (
        <>

          {/* Increment Section */}
          {renderCalculationSection(incrementSection, 'increment')}

          {/* Decrement Section */}
          {renderCalculationSection(decrementSection, 'decrement')}

          {/* Summary/Actions */}
          <div className="bg-white rounded-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">Calculation Summary</h3>
                <p className="text-gray-600 text-xs">
                  Total increment rules: {incrementSection.rows.length} |
                  Total decrement rules: {decrementSection.rows.length}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon="material-symbols:refresh"
                  onClick={() => {
                    setIncrementSection({ title: 'Increment Calculations', rows: [] });
                    setDecrementSection({ title: 'Decrement Calculations', rows: [] });
                  }}
                >
                  Reset All
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon="material-symbols:save"
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CalculatorIndex