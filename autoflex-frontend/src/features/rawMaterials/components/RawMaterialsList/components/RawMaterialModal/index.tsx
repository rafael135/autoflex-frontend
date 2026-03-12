import { Form, Input, InputNumber } from "antd";
import type { FormInstance } from "antd";
import type { RawMaterial } from "../../../../types";
import type { FC } from "react";
import { CrudModal } from "../../../../../../components/_ui";

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
        <CrudModal
            open={open}
            editing={!!editingRawMaterial}
            entityName="Insumo"
            form={form}
            onOk={onOk}
            onCancel={onCancel}
            width={480}
        >
                <Form.Item
                    name="name"
                    label="Nome do Insumo"
                    rules={[{ required: true, message: "Informe o nome." }]}
                >
                    <Input placeholder="Ex: Chapa de Aço 2mm" data-testid="name-input" />
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
                        data-testid="stock-quantity-input"
                    />
                </Form.Item>
        </CrudModal>
    );
};

export default RawMaterialModal;
