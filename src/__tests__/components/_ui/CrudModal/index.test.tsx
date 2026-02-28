import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'antd'
import CrudModal from '../../../../components/_ui/CrudModal'

// Partially mock antd Modal so afterOpenChange fires synchronously when `open` changes.
// All other antd exports (Form, etc.) pass through from the real module.
vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>()
  const React = (await import('react')) as typeof import('react')
  const MockModal = ({
    afterOpenChange,
    open,
    children,
    onOk,
    onCancel,
    okText,
    cancelText,
    title,
  }: {
    afterOpenChange?: (open: boolean) => void
    open?: boolean
    children?: React.ReactNode
    onOk?: () => void
    onCancel?: () => void
    okText?: React.ReactNode
    cancelText?: React.ReactNode
    title?: React.ReactNode
  }) => {
    React.useEffect(() => {
      afterOpenChange?.(open ?? false)
    }, [open])
    if (!open) return null
    return (
      <div role="dialog" aria-label={String(title ?? '')}>
        <span>{title}</span>
        {children}
        <button onClick={onOk}>{okText ?? 'OK'}</button>
        <button onClick={onCancel}>{cancelText ?? 'Cancel'}</button>
      </div>
    )
  }
  return { ...actual, Modal: MockModal }
})

// Wrapper that provides a real antd Form instance
const TestCrudModal = (props: Partial<Parameters<typeof CrudModal>[0]> & { editing: boolean; entityName: string }) => {
  const [form] = Form.useForm()
  return (
    <CrudModal
      open={true}
      form={form}
      onOk={vi.fn()}
      onCancel={vi.fn()}
      {...props}
    >
      <div>Conteúdo do modal</div>
    </CrudModal>
  )
}

describe('CrudModal', () => {
  describe('title', () => {
    it('shows "Novo X" when editing is false', async () => {
      render(<TestCrudModal editing={false} entityName="Produto" />)
      expect(await screen.findByText('Novo Produto')).toBeInTheDocument()
    })

    it('shows "Editar X" when editing is true', async () => {
      render(<TestCrudModal editing={true} entityName="Produto" />)
      expect(await screen.findByText('Editar Produto')).toBeInTheDocument()
    })
  })

  describe('okText', () => {
    it('shows "Cadastrar" when editing is false', async () => {
      render(<TestCrudModal editing={false} entityName="Insumo" />)
      expect(await screen.findByRole('button', { name: /Cadastrar/i })).toBeInTheDocument()
    })

    it('shows "Salvar" when editing is true', async () => {
      render(<TestCrudModal editing={true} entityName="Insumo" />)
      expect(await screen.findByRole('button', { name: /Salvar/i })).toBeInTheDocument()
    })
  })

  describe('callbacks', () => {
    it('calls onOk when OK button is clicked', async () => {
      const onOk = vi.fn()
      render(<TestCrudModal editing={false} entityName="Produto" onOk={onOk} />)
      await userEvent.click(await screen.findByRole('button', { name: /Cadastrar/i }))
      expect(onOk).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when Cancel button is clicked', async () => {
      const onCancel = vi.fn()
      render(<TestCrudModal editing={false} entityName="Produto" onCancel={onCancel} />)
      await userEvent.click(await screen.findByRole('button', { name: /Cancelar/i }))
      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('form.resetFields', () => {
    it('calls resetFields when modal closes', async () => {
      const resetFieldsSpy = vi.fn()

      // Use a real antd form to avoid internal initialization errors,
      // then replace resetFields with a spy after mount.
      const ControlledModal = ({ open }: { open: boolean }) => {
        const [form] = Form.useForm()
        // Override resetFields so we can verify it is called
        form.resetFields = resetFieldsSpy
        return (
          <CrudModal
            open={open}
            editing={false}
            entityName="Produto"
            form={form}
            onOk={vi.fn()}
            onCancel={vi.fn()}
          >
            <div />
          </CrudModal>
        )
      }

      const { rerender } = render(<ControlledModal open={true} />)
      await act(async () => {
        rerender(<ControlledModal open={false} />)
      })
      expect(resetFieldsSpy).toHaveBeenCalled()
    })
  })
})
