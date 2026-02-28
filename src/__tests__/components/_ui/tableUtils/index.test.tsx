import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildIdColumn, buildActionColumn } from '../../../../components/_ui/tableUtils'
import type { RawMaterial } from '../../../../features/rawMaterials/types'

// Helper to render a column's render fn
const renderCell = (content: React.ReactNode) => {
  return render(<div data-testid="cell">{content}</div>)
}

describe('buildIdColumn', () => {
  it('renders the ID inside a Tag', () => {
    const col = buildIdColumn<RawMaterial>()
    const node = (col.render as (id: number) => React.ReactNode)(42)
    renderCell(node)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('has title "ID"', () => {
    const col = buildIdColumn<RawMaterial>()
    expect(col.title).toBe('ID')
  })
})

describe('buildActionColumn', () => {
  const mockRecord: RawMaterial = { id: 7, name: 'Aço', stockQuantity: 100 }
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  const setup = () => {
    const col = buildActionColumn<RawMaterial>({
      onEdit,
      onDelete,
      deleteLabel: 'insumo',
    })
    const renderFn = col.render as (_: unknown, record: RawMaterial) => React.ReactNode
    render(<div>{renderFn(undefined, mockRecord)}</div>)
  }

  it('renders the edit button', () => {
    setup()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('calls onEdit with the record when edit button is clicked', async () => {
    setup()
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(mockRecord)
  })

  it('renders a delete button', () => {
    setup()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls onDelete with the record id after confirming the Popconfirm', async () => {
    setup()
    // Open the Popconfirm
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    // Popconfirm renders "Sim" confirm button in the overlay (portal in document.body)
    const confirmButton = await screen.findByRole('button', { name: /sim/i })
    await userEvent.click(confirmButton)
    expect(onDelete).toHaveBeenCalledWith(mockRecord.id)
  })
})
