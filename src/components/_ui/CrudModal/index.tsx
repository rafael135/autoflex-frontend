import { Modal, Form, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { ReactNode } from 'react';

interface CrudModalProps {
    open: boolean;
    editing: boolean;
    entityName: string;
    form: FormInstance;
    onOk: () => void;
    onCancel: () => void;
    confirmLoading?: boolean;
    /** Max width of the modal. Uses 90vw on small screens automatically. */
    width?: number | string;
    children: ReactNode;
}

const CrudModal = ({
    open,
    editing,
    entityName,
    form,
    onOk,
    onCancel,
    confirmLoading,
    width = 520,
    children,
}: CrudModalProps) => (
    <Modal
        title={editing ? `Editar ${entityName}` : `Novo ${entityName}`}
        open={open}
        onCancel={onCancel}
        footer={
            <>
                <Button onClick={onCancel} data-testid="modal-cancel-button">
                    Cancelar
                </Button>
                <Button
                    type="primary"
                    onClick={onOk}
                    loading={confirmLoading}
                    data-testid="modal-ok-button"
                >
                    {editing ? 'Salvar' : 'Cadastrar'}
                </Button>
            </>
        }
        style={{ maxWidth: width }}
        width="90vw"
        styles={{
            body: {
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 200px)',
            },
        }}
        afterOpenChange={(visible) => {
            if (!visible) form.resetFields();
        }}
        destroyOnHidden
        data-testid="crud-modal"
    >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            {children}
        </Form>
    </Modal>
);

export default CrudModal;
