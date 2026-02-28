import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'antd'

// ---- Shared mock state ----
const openCreateModal = vi.fn()
const openEditModal = vi.fn()
const closeModal = vi.fn()
const handleSubmit = vi.fn()
const handleDelete = vi.fn()
const setCurrentPage = vi.fn()
const setItemsPerPage = vi.fn()

const makeHookReturn = (overrides = {}) => {
  // Form.useForm() must be called inside a component or renderHook; here we provide a real form
  const [form] = Form.useForm()
  return {
    form,
    modalOpen: false,
    editingRawMaterial: null,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    rawMaterials: { data: [], totalItems: 0, currentPage: 1, totalPages: 1 },
    isLoadingGetRawMaterials: false,
    isErrorGetRawMaterials: false,
    isLoadingCreate: false,
    isLoadingUpdate: false,
    isLoadingDelete: false,
    currentPage: 1,
    setCurrentPage,
    itemsPerPage: 10,
    setItemsPerPage,
    ...overrides,
  }
}

vi.mock('../../../../../features/rawMaterials/components/RawMaterialsList/hooks/useRawMaterials', () => ({
  useRawMaterials: vi.fn(() => makeHookReturn()),
}))

import { useRawMaterials } from '../../../../../features/rawMaterials/components/RawMaterialsList/hooks/useRawMaterials'
import RawMaterialsList from '../../../../../features/rawMaterials/components/RawMaterialsList'

describe('RawMaterialsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRawMaterials).mockImplementation(() => makeHookReturn())
  })

  it('renders the title "Insumos"', () => {
    render(<RawMaterialsList />)
    expect(screen.getByText('Insumos')).toBeInTheDocument()
  })

  it('shows plural subtitle for 0 items', () => {
    render(<RawMaterialsList />)
    expect(screen.getByText('0 insumos cadastrados')).toBeInTheDocument()
  })

  it('shows singular subtitle for 1 item', () => {
    vi.mocked(useRawMaterials).mockImplementation(() =>
      makeHookReturn({
        rawMaterials: { data: [], totalItems: 1, currentPage: 1, totalPages: 1 },
      }),
    )
    render(<RawMaterialsList />)
    expect(screen.getByText('1 insumo cadastrado')).toBeInTheDocument()
  })

  it('shows plural subtitle for multiple items', () => {
    vi.mocked(useRawMaterials).mockImplementation(() =>
      makeHookReturn({
        rawMaterials: { data: [], totalItems: 5, currentPage: 1, totalPages: 1 },
      }),
    )
    render(<RawMaterialsList />)
    expect(screen.getByText('5 insumos cadastrados')).toBeInTheDocument()
  })

  it('renders "Novo Insumo" button', () => {
    render(<RawMaterialsList />)
    expect(screen.getByRole('button', { name: /Novo Insumo/i })).toBeInTheDocument()
  })

  it('calls openCreateModal when "Novo Insumo" is clicked', async () => {
    render(<RawMaterialsList />)
    await userEvent.click(screen.getByRole('button', { name: /Novo Insumo/i }))
    expect(openCreateModal).toHaveBeenCalledTimes(1)
  })

  it('renders table rows for each raw material', () => {
    vi.mocked(useRawMaterials).mockImplementation(() =>
      makeHookReturn({
        rawMaterials: {
          data: [
            { id: 1, name: 'Aço Carbono', stockQuantity: 300 },
            { id: 2, name: 'Cobre', stockQuantity: 100 },
          ],
          totalItems: 2,
          currentPage: 1,
          totalPages: 1,
        },
      }),
    )
    render(<RawMaterialsList />)
    expect(screen.getByText('Aço Carbono')).toBeInTheDocument()
    expect(screen.getByText('Cobre')).toBeInTheDocument()
  })

  it('shows empty text when there are no items', () => {
    render(<RawMaterialsList />)
    expect(screen.getByText('Não há insumos registrados')).toBeInTheDocument()
  })
})
