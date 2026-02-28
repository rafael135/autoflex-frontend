import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// ---- Mock RTK Query hooks ----
const mockRefetchProducts = vi.fn().mockResolvedValue({})
const mockCreateProduct = vi.fn().mockResolvedValue({})
const mockUpdateProduct = vi.fn().mockResolvedValue({})
const mockDeleteProduct = vi.fn().mockResolvedValue({})
const mockTriggerGetRawMaterials = vi.fn().mockResolvedValue({
  data: { data: [], totalItems: 0, currentPage: 1, totalPages: 1 },
})

vi.mock('../../../../../../features/products/api/productsApi', () => ({
  useGetProductsQuery: vi.fn(() => ({
    data: { data: [], totalItems: 0, currentPage: 1, totalPages: 1 },
    isLoading: false,
    isError: false,
    refetch: mockRefetchProducts,
  })),
  useCreateProductMutation: vi.fn(() => [mockCreateProduct, { isLoading: false, isError: false }]),
  useUpdateProductMutation: vi.fn(() => [mockUpdateProduct, { isLoading: false, isError: false }]),
  useDeleteProductMutation: vi.fn(() => [mockDeleteProduct, { isLoading: false }]),
}))

vi.mock('../../../../../../features/rawMaterials', () => ({
  useLazyGetRawMaterialsQuery: vi.fn(() => [mockTriggerGetRawMaterials, { isFetching: false }]),
}))

import { useProducts } from '../../../../../../features/products/components/ProductsList/hooks/useProducts'
import type { Product } from '../../../../../../features/products/types'

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRefetchProducts.mockResolvedValue({})
  })

  it('initializes with page 1 and 10 items per page', () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current.currentPage).toBe(1)
    expect(result.current.itemsPerPage).toBe(10)
  })

  it('initializes with modal closed and no editing product', () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current.modalOpen).toBe(false)
    expect(result.current.editingProduct).toBeNull()
  })

  it('openCreateModal opens the modal with null editingProduct', () => {
    const { result } = renderHook(() => useProducts())
    act(() => {
      result.current.openCreateModal()
    })
    expect(result.current.modalOpen).toBe(true)
    expect(result.current.editingProduct).toBeNull()
  })

  it('openCreateModal triggers loadRawMaterials', async () => {
    const { result } = renderHook(() => useProducts())
    await act(async () => {
      result.current.openCreateModal()
    })
    expect(mockTriggerGetRawMaterials).toHaveBeenCalled()
  })

  it('openEditModal opens modal and sets editingProduct', () => {
    const { result } = renderHook(() => useProducts())
    const product: Product = {
      id: 3,
      name: 'Quadro Elétrico',
      value: 250,
      materials: [],
    }
    act(() => {
      result.current.openEditModal(product)
    })
    expect(result.current.modalOpen).toBe(true)
    expect(result.current.editingProduct).toEqual(product)
  })

  it('closeModal closes the modal', () => {
    const { result } = renderHook(() => useProducts())
    act(() => {
      result.current.openCreateModal()
    })
    act(() => {
      result.current.closeModal()
    })
    expect(result.current.modalOpen).toBe(false)
  })

  it('handleDelete calls deleteProduct with the given id', async () => {
    const { result } = renderHook(() => useProducts())
    await act(async () => {
      result.current.handleDelete(42)
    })
    expect(mockDeleteProduct).toHaveBeenCalledWith(42)
  })

  it('setCurrentPage and setItemsPerPage update pagination state', () => {
    const { result } = renderHook(() => useProducts())
    act(() => {
      result.current.setCurrentPage(2)
      result.current.setItemsPerPage(25)
    })
    expect(result.current.currentPage).toBe(2)
    expect(result.current.itemsPerPage).toBe(25)
  })

  it('onSearchRawMaterials debounces the raw material search call', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useProducts())
    act(() => {
      result.current.onSearchRawMaterials('aço')
      result.current.onSearchRawMaterials('aço ca')
    })
    // Not called yet — debounce pending
    expect(mockTriggerGetRawMaterials).not.toHaveBeenCalled()
    await act(async () => {
      vi.advanceTimersByTime(350)
    })
    expect(mockTriggerGetRawMaterials).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('onLoadMoreRawMaterials does not trigger when hasMoreRawMaterials is false', async () => {
    mockTriggerGetRawMaterials.mockClear()
    const { result } = renderHook(() => useProducts())
    // hasMoreRawMaterials starts as false
    await act(async () => {
      result.current.onLoadMoreRawMaterials()
    })
    expect(mockTriggerGetRawMaterials).not.toHaveBeenCalled()
  })

  it('products is the data returned by the query', () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current.products).toEqual({
      data: [],
      totalItems: 0,
      currentPage: 1,
      totalPages: 1,
    })
  })
})
