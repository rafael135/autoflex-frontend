import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Row } from 'antd'
import StatisticCard from '../../../../components/_ui/StatisticCard'

const renderInRow = (ui: React.ReactElement) =>
  render(<Row>{ui}</Row>)

describe('StatisticCard', () => {
  it('renders the title', () => {
    renderInRow(<StatisticCard title="Total de Produtos" value={42} />)
    expect(screen.getByText('Total de Produtos')).toBeInTheDocument()
  })

  it('renders the numeric value', () => {
    renderInRow(<StatisticCard title="Valor" value={100} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders extra content when provided', () => {
    renderInRow(
      <StatisticCard title="Teste" value={0} extra={<span>Conteúdo extra</span>} />,
    )
    expect(screen.getByText('Conteúdo extra')).toBeInTheDocument()
  })

  it('renders with loading state without crashing', () => {
    const { container } = renderInRow(
      <StatisticCard title="Loading" value={0} loading={true} />,
    )
    expect(container).toBeInTheDocument()
  })
})
