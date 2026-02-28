import { Table, Button, Popconfirm, Tag, Space, Typography, Flex } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useProducts } from "./hooks/useProducts";
import ProductModal from "./components/ProductModal";
import type { Product } from "../../types";

const { Title, Text } = Typography;

const formatCurrency = (value: number) => {
    if (isNaN(value)) return value;

    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
    

const columns = (
    onEdit: (r: Product) => void,
    onDelete: (id: number) => void,
) => [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 150,
        render: (id: number) => (
            <Tag color="geekblue">
                <Text code>{id}</Text>
            </Tag>
        ),
    },
    {
        title: "Nome do Produto",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Valor Unitário",
        dataIndex: "value",
        key: "value",
        width: 160,
        align: "right" as const,
        render: (value: number) => (
            <Text strong style={{ color: "#16a34a" }}>
                {formatCurrency(value)}
            </Text>
        ),
    },
    {
        title: "Insumos",
        dataIndex: "materials",
        key: "materials",
        width: 100,
        align: "center" as const,
        render: (mats: Product["materials"]) => (
            <Tag>
                {mats.length} insumo{mats.length !== 1 ? "s" : ""}
            </Tag>
        ),
    },
    {
        title: "Ações",
        key: "actions",
        width: 100,
        align: "center" as const,
        render: (_: unknown, record: Product) => (
            <Space size="small">
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => onEdit(record)}
                />
                <Popconfirm
                    title="Excluir produto"
                    description="Tem certeza que deseja excluir este produto?"
                    onConfirm={() => onDelete(record.id)}
                    okText="Sim"
                    cancelText="Não"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                </Popconfirm>
            </Space>
        ),
    },
];

const ProductsList = () => {
    const {
        form,
        modalOpen,
        editingProduct,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
        products,
        isLoadingGetProducts,
        rawMaterialOptions,
        isLoadingRawMaterials,
        hasMoreRawMaterials,
        onSearchRawMaterials,
        onLoadMoreRawMaterials,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
    } = useProducts();

    return (
        <Space orientation="vertical" size="middle" style={{ display: "flex" }}>
            <Flex justify="space-between" align="center">
                <Space orientation="vertical" size={0}>
                    <Title level={4} style={{ margin: 0 }}>
                        Produtos
                    </Title>
                    <Text type="secondary">
                        {products?.totalItems ?? 0}{" "}
                        {products?.totalItems === 1
                            ? "produto cadastrado"
                            : "produtos cadastrados"}
                    </Text>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreateModal}
                >
                    Novo Produto
                </Button>
            </Flex>

            <Table
                dataSource={products?.data || []}
                columns={columns(openEditModal, handleDelete)}
                locale={{
                    emptyText: "Não há produtos registrados",
                }}
                loading={isLoadingGetProducts}
                rowKey="id"
                size="middle"
                pagination={{
                    current: currentPage,
                    pageSize: itemsPerPage,
                    total: products?.totalItems,
                    showSizeChanger: false,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setItemsPerPage(pageSize);
                    },
                }}
                scroll={{ x: 600 }}
            />

            <ProductModal
                open={modalOpen}
                editingProduct={editingProduct}
                form={form}
                rawMaterialOptions={rawMaterialOptions}
                isLoadingRawMaterials={isLoadingRawMaterials}
                hasMoreRawMaterials={hasMoreRawMaterials}
                onSearchRawMaterials={onSearchRawMaterials}
                onLoadMoreRawMaterials={onLoadMoreRawMaterials}
                onOk={handleSubmit}
                onCancel={closeModal}
            />
        </Space>
    );
};

export default ProductsList;
