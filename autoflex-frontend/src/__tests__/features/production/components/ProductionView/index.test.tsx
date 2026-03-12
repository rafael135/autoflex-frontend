import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TotalProductionResponse } from '../../../../../features/production/types'
import type { ProductDetail } from '../../../../../features/production/types'

// ---- Mock the useProduction hook ----
vi.mock('../../../../../features/production/components/ProductionView/hooks/useProduction', () => ({
  useProduction: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    topProduct: null,
  })),
}))

import { useProduction } from '../../../../../features/production/components/ProductionView/hooks/useProduction'
import ProductionView from '../../../../../features/production/components/ProductionView'

const sampleProducts: ProductDetail[] = [
  { id: 1, name: 'Quadro Elétrico A', maxProductionCapacity: 80, totalValue: 4000 },
  { id: 2, name: 'Quadro Elétrico B', maxProductionCapacity: 120, totalValue: 6000 },
]

const sampleData: TotalProductionResponse = {
  products: sampleProducts,
  totalProductionValue: 10000,
}

describe('ProductionView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useProduction).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      topProduct: null,
    })
  })

  it('renders the "Valor Total de Produção" card title', () => {
    render(<ProductionView />)
    expect(screen.getByText('Valor Total de Produção')).toBeInTheDocument()
  })

  it('renders the "Produtos Simulados" card title', () => {
    render(<ProductionView />)
    expect(screen.getByText('Produtos Simulados')).toBeInTheDocument()
  })

  it('renders the "Maior Capacidade" card title', () => {
    render(<ProductionView />)
    expect(screen.getByText('Maior Capacidade')).toBeInTheDocument()
  })

  it('shows "—" for top product when there are no products', () => {
    render(<ProductionView />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('does NOT show error alert when isError is false', () => {
    render(<ProductionView />)
    expect(
      screen.queryByText('Não foi possível carregar os dados de produção.'),
    ).not.toBeInTheDocument()
  })

  it('shows error alert when isError is true', () => {
    vi.mocked(useProduction).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      topProduct: null,
    })
    render(<ProductionView />)
    expect(
      screen.getByText('Não foi possível carregar os dados de produção.'),
    ).toBeInTheDocument()
  })

  it('renders product names in the table when data is available', () => {
    vi.mocked(useProduction).mockReturnValue({
      data: sampleData,
      isLoading: false,
      isError: false,
      topProduct: sampleProducts[1], // Quadro Elétrico B has higher capacity
    })
    render(<ProductionView />)
    // "Quadro Elétrico A" appears only in the table row
    expect(screen.getByText('Quadro Elétrico A')).toBeInTheDocument()
    // "Quadro Elétrico B" appears in both the table row and the StatisticCard extra slot
    expect(screen.getAllByText('Quadro Elétrico B').length).toBeGreaterThan(0)
  })

  it('shows the top product value in the "Maior Capacidade" card', () => {
    vi.mocked(useProduction).mockReturnValue({
      data: sampleData,
      isLoading: false,
      isError: false,
      topProduct: sampleProducts[1], // 120 capacity
    })
    render(<ProductionView />)
    // "120" appears in both the StatisticCard and the table cell — verify at least one exists
    expect(screen.getAllByText(/120/).length).toBeGreaterThan(0)
  })

  it('shows count of simulated products (2 products)', () => {
    vi.mocked(useProduction).mockReturnValue({
      data: sampleData,
      isLoading: false,
      isError: false,
      topProduct: sampleProducts[1],
    })
    render(<ProductionView />)
    // The Statistic card for "Produtos Simulados" should show 2
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
  })
})
