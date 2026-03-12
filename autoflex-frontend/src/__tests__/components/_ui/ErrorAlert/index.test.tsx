import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorAlert from '../../../../components/_ui/ErrorAlert'

describe('ErrorAlert', () => {
  it('renders nothing when visible is false', () => {
    const { container } = render(<ErrorAlert visible={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the default error message when visible is true', () => {
    render(<ErrorAlert visible={true} />)
    expect(screen.getByText('Ocorreu um erro. Tente novamente.')).toBeInTheDocument()
  })

  it('renders a custom message when provided', () => {
    render(<ErrorAlert visible={true} message="Erro customizado" />)
    expect(screen.getByText('Erro customizado')).toBeInTheDocument()
  })

  it('does not render the custom message when visible is false', () => {
    render(<ErrorAlert visible={false} message="Não deve aparecer" />)
    expect(screen.queryByText('Não deve aparecer')).not.toBeInTheDocument()
  })
})
