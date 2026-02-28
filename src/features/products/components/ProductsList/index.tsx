import { Table, Tag, Space, Typography } from "antd";
import { useProducts } from "./hooks/useProducts";
import ProductModal from "./components/ProductModal";
import type { Product } from "../../types";
import { EntityListHeader, buildIdColumn, buildActionColumn, ErrorAlert } from "../../../../components/_ui";
import { formatCurrency } from "../../../../app/utils/formatters";

const { Text } = Typography;


const columns = (
    onEdit: (r: Product) => void,
    onDelete: (id: number) => void,
) => [
    buildIdColumn<Product>(),
    {
        title: "Nome do Produto",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Valor Unitário",
        dataIndex: "value",
        key: "value",
        width: 130,
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
    buildActionColumn<Product>({ onEdit, onDelete, deleteLabel: "produto" }),
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
        isErrorGetProducts,
        isErrorCreateProduct,
        isErrorUpdateProduct,
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
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <ErrorAlert
                visible={isErrorGetProducts}
                message="Erro ao carregar produtos. Tente novamente."
            />
            <ErrorAlert
                visible={isErrorCreateProduct}
                message="Erro ao cadastrar produto. Verifique os dados e tente novamente."
            />
            <ErrorAlert
                visible={isErrorUpdateProduct}
                message="Erro ao atualizar produto. Verifique os dados e tente novamente."
            />
            <EntityListHeader
                title="Produtos"
                subtitle={`${products?.totalItems ?? 0} ${
                    products?.totalItems === 1
                        ? "produto cadastrado"
                        : "produtos cadastrados"
                }`}
                addLabel="Novo Produto"
                onAdd={openCreateModal}
                addButtonTestId="add-product-button"
            />

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
                scroll={{ x: 700 }}
                data-testid="products-table"
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
