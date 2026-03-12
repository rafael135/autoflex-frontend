import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'antd'

const openCreateModal = vi.fn()
const openEditModal = vi.fn()
const closeModal = vi.fn()
const handleSubmit = vi.fn()
const handleDelete = vi.fn()
const setCurrentPage = vi.fn()
const setItemsPerPage = vi.fn()
const onSearchRawMaterials = vi.fn()
const onLoadMoreRawMaterials = vi.fn()

const makeHookReturn = (overrides = {}) => {
  const [form] = Form.useForm()
  return {
    form,
    modalOpen: false,
    editingProduct: null,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    products: { data: [], totalItems: 0, currentPage: 1, totalPages: 1 },
    isLoadingGetProducts: false,
    isErrorGetProducts: false,
    rawMaterialOptions: [],
    isLoadingRawMaterials: false,
    hasMoreRawMaterials: false,
    onSearchRawMaterials,
    onLoadMoreRawMaterials,
    isLoadingCreateProduct: false,
    isLoadingUpdateProduct: false,
    isLoadingDeleteProduct: false,
    isErrorCreateProduct: false,
    isErrorUpdateProduct: false,
    currentPage: 1,
    setCurrentPage,
    itemsPerPage: 10,
    setItemsPerPage,
    ...overrides,
  }
}

vi.mock('../../../../../features/products/components/ProductsList/hooks/useProducts', () => ({
  useProducts: vi.fn(() => makeHookReturn()),
}))

import { useProducts } from '../../../../../features/products/components/ProductsList/hooks/useProducts'
import ProductsList from '../../../../../features/products/components/ProductsList'

describe('ProductsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useProducts).mockImplementation(() => makeHookReturn())
  })

  it('renders the title "Produtos"', () => {
    render(<ProductsList />)
    expect(screen.getByText('Produtos')).toBeInTheDocument()
  })

  it('shows "0 produtos cadastrados" for empty list', () => {
    render(<ProductsList />)
    expect(screen.getByText('0 produtos cadastrados')).toBeInTheDocument()
  })

  it('shows singular "1 produto cadastrado"', () => {
    vi.mocked(useProducts).mockImplementation(() =>
      makeHookReturn({
        products: { data: [], totalItems: 1, currentPage: 1, totalPages: 1 },
      }),
    )
    render(<ProductsList />)
    expect(screen.getByText('1 produto cadastrado')).toBeInTheDocument()
  })

  it('shows plural for multiple products', () => {
    vi.mocked(useProducts).mockImplementation(() =>
      makeHookReturn({
        products: { data: [], totalItems: 3, currentPage: 1, totalPages: 1 },
      }),
    )
    render(<ProductsList />)
    expect(screen.getByText('3 produtos cadastrados')).toBeInTheDocument()
  })

  it('renders "Novo Produto" button', () => {
    render(<ProductsList />)
    expect(screen.getByRole('button', { name: /Novo Produto/i })).toBeInTheDocument()
  })

  it('calls openCreateModal when "Novo Produto" button is clicked', async () => {
    render(<ProductsList />)
    await userEvent.click(screen.getByRole('button', { name: /Novo Produto/i }))
    expect(openCreateModal).toHaveBeenCalledTimes(1)
  })

  it('renders table rows for each product', () => {
    vi.mocked(useProducts).mockImplementation(() =>
      makeHookReturn({
        products: {
          data: [
            { id: 1, name: 'Produto Alpha', value: 100, materials: [] },
            { id: 2, name: 'Produto Beta', value: 200, materials: [{ rawMaterialId: 1, name: 'Aço', quantity: 2 }] },
          ],
          totalItems: 2,
          currentPage: 1,
          totalPages: 1,
        },
      }),
    )
    render(<ProductsList />)
    expect(screen.getByText('Produto Alpha')).toBeInTheDocument()
    expect(screen.getByText('Produto Beta')).toBeInTheDocument()
  })

  it('shows empty text when there are no products', () => {
    render(<ProductsList />)
    expect(screen.getByText('Não há produtos registrados')).toBeInTheDocument()
  })
})
