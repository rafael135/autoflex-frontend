import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'antd'
import RawMaterialModal from '../../../../../../../features/rawMaterials/components/RawMaterialsList/components/RawMaterialModal'
import type { RawMaterial } from '../../../../../../../features/rawMaterials/types'

const TestModal = (props: {
  open: boolean
  editingRawMaterial: RawMaterial | null
  onOk?: () => void
  onCancel?: () => void
}) => {
  const [form] = Form.useForm()
  return (
    <RawMaterialModal
      form={form}
      onOk={props.onOk ?? vi.fn()}
      onCancel={props.onCancel ?? vi.fn()}
      open={props.open}
      editingRawMaterial={props.editingRawMaterial}
    />
  )
}

describe('RawMaterialModal', () => {
  it('shows "Novo Insumo" when not editing', async () => {
    render(<TestModal open={true} editingRawMaterial={null} />)
    expect(await screen.findByText('Novo Insumo')).toBeInTheDocument()
  })

  it('shows "Editar Insumo" when editing', async () => {
    const rm: RawMaterial = { id: 1, name: 'Aço', stockQuantity: 50 }
    render(<TestModal open={true} editingRawMaterial={rm} />)
    expect(await screen.findByText('Editar Insumo')).toBeInTheDocument()
  })

  it('renders the "Nome do Insumo" field label', async () => {
    render(<TestModal open={true} editingRawMaterial={null} />)
    expect(await screen.findByText('Nome do Insumo')).toBeInTheDocument()
  })

  it('renders the "Quantidade em Estoque" field label', async () => {
    render(<TestModal open={true} editingRawMaterial={null} />)
    expect(await screen.findByText('Quantidade em Estoque')).toBeInTheDocument()
  })

  it('shows "Cadastrar" button when creating', async () => {
    render(<TestModal open={true} editingRawMaterial={null} />)
    expect(await screen.findByRole('button', { name: /Cadastrar/i })).toBeInTheDocument()
  })

  it('shows "Salvar" button when editing', async () => {
    const rm: RawMaterial = { id: 1, name: 'Aço', stockQuantity: 50 }
    render(<TestModal open={true} editingRawMaterial={rm} />)
    expect(await screen.findByRole('button', { name: /Salvar/i })).toBeInTheDocument()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn()
    render(<TestModal open={true} editingRawMaterial={null} onCancel={onCancel} />)
    await userEvent.click(await screen.findByRole('button', { name: /Cancelar/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
