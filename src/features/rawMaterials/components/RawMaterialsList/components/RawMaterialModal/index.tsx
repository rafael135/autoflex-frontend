import { Modal, Form, Input, InputNumber } from "antd";
import type { FormInstance } from "antd";
import type { RawMaterial } from "../../../../types";
import type { FC } from "react";

interface RawMaterialModalProps {
    open: boolean;
    editingRawMaterial: RawMaterial | null;
    form: FormInstance;
    onOk: () => void;
    onCancel: () => void;
}

const RawMaterialModal: FC<RawMaterialModalProps> = ({
    open,
    editingRawMaterial,
    form,
    onOk,
    onCancel,
}) => {
    return (
        <Modal
            title={editingRawMaterial ? "Editar Insumo" : "Novo Insumo"}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            okText={editingRawMaterial ? "Salvar" : "Cadastrar"}
            cancelText="Cancelar"
            width={480}
            afterOpenChange={(visible) => {
                if (!visible) form.resetFields();
            }}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item
                    name="name"
                    label="Nome do Insumo"
                    rules={[{ required: true, message: "Informe o nome." }]}
                >
                    <Input placeholder="Ex: Chapa de Aço 2mm" />
                </Form.Item>

                <Form.Item
                    name="stockQuantity"
                    label="Quantidade em Estoque"
                    rules={[
                        {
                            required: true,
                            message: "Informe a quantidade em estoque.",
                        },
                    ]}
                >
                    <InputNumber<number>
                        min={0}
                        step={1}
                        precision={0}
                        style={{ width: "100%" }}
                        placeholder="0"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RawMaterialModal;
