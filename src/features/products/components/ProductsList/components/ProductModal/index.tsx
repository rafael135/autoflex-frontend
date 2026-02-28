import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Space,
    Divider,
    Flex,
    Typography,
    Spin,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { Product } from "../../../../types";
import type { FC } from "react";

const { Text } = Typography;

type RawMaterialOption = { value: number; label: string };

interface ProductModalProps {
    open: boolean;
    editingProduct: Product | null;
    form: FormInstance;
    rawMaterialOptions: RawMaterialOption[];
    isLoadingRawMaterials: boolean;
    hasMoreRawMaterials: boolean;
    onSearchRawMaterials: (search: string) => void;
    onLoadMoreRawMaterials: () => void;
    onOk: () => void;
    onCancel: () => void;
}

const ProductModal: FC<ProductModalProps> = ({
    open,
    editingProduct,
    form,
    rawMaterialOptions,
    isLoadingRawMaterials,
    hasMoreRawMaterials,
    onSearchRawMaterials,
    onLoadMoreRawMaterials,
    onOk,
    onCancel,
}) => {
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            onLoadMoreRawMaterials();
        }
    };

    const dropdownRender = (menu: React.ReactNode) => (
        <>
            {menu}
            {(isLoadingRawMaterials || hasMoreRawMaterials) && (
                <Flex justify="center" style={{ padding: "8px 0" }}>
                    {isLoadingRawMaterials ? (
                        <Spin size="small" />
                    ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Role para carregar mais
                        </Text>
                    )}
                </Flex>
            )}
        </>
    );

    return (
        <Modal
            title={editingProduct ? "Editar Produto" : "Novo Produto"}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            okText={editingProduct ? "Salvar" : "Cadastrar"}
            cancelText="Cancelar"
            width={600}
            afterOpenChange={(visible) => {
                if (!visible) form.resetFields();
            }}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item
                    name="name"
                    label="Nome do Produto"
                    rules={[{ required: true, message: "Informe o nome." }]}
                >
                    <Input placeholder="Ex: Quadro Elétrico Industrial" />
                </Form.Item>

                <Form.Item
                    name="value"
                    label="Valor Unitário (R$)"
                    rules={[
                        {
                            required: true,
                            message: "Informe o valor unitário.",
                        },
                    ]}
                >
                    <InputNumber<number>
                        min={0}
                        step={0.01}
                        style={{ width: "100%" }}
                        placeholder="0"
                        formatter={(v) => `${v}`.replace(".", ",")}
                        parser={(v) => parseFloat((v ?? "0").replace(",", "."))}
                    />
                </Form.Item>

                <Divider orientation="horizontal">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Insumos por unidade produzida
                    </Text>
                </Divider>

                <Form.List name="materials">
                    {(fields, { add, remove }) => (
                        <Space
                            direction="vertical"
                            size="small"
                            style={{ display: "flex" }}
                        >
                            {fields.map(({ key, name, ...restField }) => (
                                <Flex key={key} gap="small" align="flex-start">
                                    <Form.Item
                                        {...restField}
                                        name={[name, "rawMaterialId"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Selecione o insumo.",
                                            },
                                        ]}
                                        style={{ flex: 1, marginBottom: 0 }}
                                    >
                                        <Select
                                            options={rawMaterialOptions}
                                            placeholder="Selecione o insumo..."
                                            showSearch
                                            filterOption={false}
                                            onSearch={onSearchRawMaterials}
                                            onPopupScroll={handlePopupScroll}
                                            dropdownRender={dropdownRender}
                                            loading={isLoadingRawMaterials}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "quantity"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Informe a qtd.",
                                            },
                                        ]}
                                        style={{ width: 110, marginBottom: 0 }}
                                    >
                                        <InputNumber
                                            min={1}
                                            step={1}
                                            placeholder="Qtd."
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<MinusCircleOutlined />}
                                        onClick={() => remove(name)}
                                        style={{ marginTop: 4 }}
                                    />
                                </Flex>
                            ))}
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                block
                            >
                                Adicionar Insumo
                            </Button>
                        </Space>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default ProductModal;

