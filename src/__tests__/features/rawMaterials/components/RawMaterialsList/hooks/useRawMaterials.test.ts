import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Provide a real message context so App.useApp() works without an <AntApp> provider
vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>()
  return {
    ...actual,
    App: {
      ...actual.App,
      useApp: () => ({
        message: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
        modal: {},
        notification: {},
      }),
    },
  }
})
// ---- Mock RTK Query hooks ----
const mockRefetch = vi.fn()
const mockCreateRawMaterial = vi.fn().mockResolvedValue({})
const mockUpdateRawMaterial = vi.fn().mockResolvedValue({})
const mockDeleteRawMaterial = vi.fn().mockResolvedValue({})

vi.mock('../../../../../../features/rawMaterials/api/rawMaterialsApi', () => ({
  useGetRawMaterialsQuery: vi.fn(() => ({
    data: { data: [], totalItems: 0, currentPage: 1, totalPages: 1 },
    isLoading: false,
    isError: false,
    refetch: mockRefetch,
  })),
  useCreateRawMaterialMutation: vi.fn(() => [mockCreateRawMaterial, { isLoading: false }]),
  useUpdateRawMaterialMutation: vi.fn(() => [mockUpdateRawMaterial, { isLoading: false }]),
  useDeleteRawMaterialMutation: vi.fn(() => [mockDeleteRawMaterial, { isLoading: false }]),
}))

// Import AFTER the mock
import { useRawMaterials } from '../../../../../../features/rawMaterials/components/RawMaterialsList/hooks/useRawMaterials'
import type { RawMaterial } from '../../../../../../features/rawMaterials/types'

describe('useRawMaterials', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRefetch.mockResolvedValue({})
  })

  it('initializes with page 1 and 10 items per page', () => {
    const { result } = renderHook(() => useRawMaterials())
    expect(result.current.currentPage).toBe(1)
    expect(result.current.itemsPerPage).toBe(10)
  })

  it('initializes with modal closed and no editing raw material', () => {
    const { result } = renderHook(() => useRawMaterials())
    expect(result.current.modalOpen).toBe(false)
    expect(result.current.editingRawMaterial).toBeNull()
  })

  it('openCreateModal opens the modal with null editingRawMaterial', () => {
    const { result } = renderHook(() => useRawMaterials())
    act(() => {
      result.current.openCreateModal()
    })
    expect(result.current.modalOpen).toBe(true)
    expect(result.current.editingRawMaterial).toBeNull()
  })

  it('openEditModal opens the modal and sets the editing raw material', () => {
    const { result } = renderHook(() => useRawMaterials())
    const rawMaterial: RawMaterial = { id: 5, name: 'Cobre', stockQuantity: 200 }
    act(() => {
      result.current.openEditModal(rawMaterial)
    })
    expect(result.current.modalOpen).toBe(true)
    expect(result.current.editingRawMaterial).toEqual(rawMaterial)
  })

  it('closeModal closes the modal', () => {
    const { result } = renderHook(() => useRawMaterials())
    act(() => {
      result.current.openCreateModal()
    })
    act(() => {
      result.current.closeModal()
    })
    expect(result.current.modalOpen).toBe(false)
  })

  it('handleDelete calls deleteRawMaterial with the given id', async () => {
    const { result } = renderHook(() => useRawMaterials())
    await act(async () => {
      result.current.handleDelete(99)
    })
    expect(mockDeleteRawMaterial).toHaveBeenCalledWith(99)
  })

  it('setCurrentPage and setItemsPerPage update pagination state', () => {
    const { result } = renderHook(() => useRawMaterials())
    act(() => {
      result.current.setCurrentPage(3)
      result.current.setItemsPerPage(20)
    })
    expect(result.current.currentPage).toBe(3)
    expect(result.current.itemsPerPage).toBe(20)
  })

  it('rawMaterials is the data returned by the query', () => {
    const { result } = renderHook(() => useRawMaterials())
    expect(result.current.rawMaterials).toEqual({
      data: [],
      totalItems: 0,
      currentPage: 1,
      totalPages: 1,
    })
  })

  it('isLoadingGetRawMaterials reflects the query loading state', () => {
    const { result } = renderHook(() => useRawMaterials())
    expect(result.current.isLoadingGetRawMaterials).toBe(false)
  })
})
