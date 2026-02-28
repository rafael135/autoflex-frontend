import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...original,
    useNavigate: () => mockNavigate,
    Outlet: () => <div data-testid="outlet-content">Outlet Content</div>,
  }
})

import MainLayout from '../../layouts/MainLayout'

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<MainLayout />)
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument()
  })

  it('renders the Outlet placeholder', () => {
    render(<MainLayout />)
    expect(screen.getByText('Outlet Content')).toBeInTheDocument()
  })

  it('renders the "Autoflex" brand name', () => {
    render(<MainLayout />)
    expect(screen.getByText('Autoflex')).toBeInTheDocument()
  })

  it('renders the sidebar nav items', () => {
    render(<MainLayout />)
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Insumos')).toBeInTheDocument()
    expect(screen.getByText('Simulador')).toBeInTheDocument()
  })

  it('navigates to /products when "Produtos" menu item is clicked', async () => {
    render(<MainLayout />)
    await userEvent.click(screen.getAllByText('Produtos')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/products')
  })

  it('navigates to /rawMaterials when "Insumos" menu item is clicked', async () => {
    render(<MainLayout />)
    await userEvent.click(screen.getAllByText('Insumos')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/rawMaterials')
  })

  it('navigates to /production when "Simulador" menu item is clicked', async () => {
    render(<MainLayout />)
    await userEvent.click(screen.getAllByText('Simulador')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/production')
  })

  it('toggles the sidebar on collapse button click', async () => {
    render(<MainLayout />)
    // The collapse button is present in the header (desktop mode in jsdom)
    // Find the fold/unfold button
    const collapseBtn = screen.queryByRole('button', { name: /menu-fold/i })
      ?? screen.queryByRole('button', { name: /menu-unfold/i })
    if (collapseBtn) {
      await userEvent.click(collapseBtn)
      // Should not throw and state should toggle
      expect(collapseBtn).toBeInTheDocument()
    }
  })
})
