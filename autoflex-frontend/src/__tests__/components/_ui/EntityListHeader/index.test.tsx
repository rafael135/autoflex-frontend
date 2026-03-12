import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EntityListHeader from '../../../../components/_ui/EntityListHeader'

describe('EntityListHeader', () => {
  const defaultProps = {
    title: 'Meus Produtos',
    subtitle: '5 produtos cadastrados',
    addLabel: 'Novo Produto',
    onAdd: vi.fn(),
  }

  it('renders the title', () => {
    render(<EntityListHeader {...defaultProps} />)
    expect(screen.getByText('Meus Produtos')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<EntityListHeader {...defaultProps} />)
    expect(screen.getByText('5 produtos cadastrados')).toBeInTheDocument()
  })

  it('renders the add button label', () => {
    render(<EntityListHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /Novo Produto/i })).toBeInTheDocument()
  })

  it('calls onAdd when the button is clicked', async () => {
    const onAdd = vi.fn()
    render(<EntityListHeader {...defaultProps} onAdd={onAdd} />)
    await userEvent.click(screen.getByRole('button', { name: /Novo Produto/i }))
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('renders a ReactNode subtitle', () => {
    render(
      <EntityListHeader
        {...defaultProps}
        subtitle={<span data-testid="subtitle-node">React Node</span>}
      />,
    )
    expect(screen.getByTestId('subtitle-node')).toBeInTheDocument()
  })
})
