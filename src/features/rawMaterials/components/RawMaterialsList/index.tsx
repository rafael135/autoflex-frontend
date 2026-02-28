import { Table, Space, Typography } from "antd";
import { useRawMaterials } from "./hooks/useRawMaterials";
import RawMaterialModal from "./components/RawMaterialModal";
import type { RawMaterial } from "../../types";
import { EntityListHeader, buildIdColumn, buildActionColumn } from "../../../../components/_ui";

const { Text } = Typography;

const columns = (
    onEdit: (r: RawMaterial) => void,
    onDelete: (id: number) => void,
) => [
    buildIdColumn<RawMaterial>(),
    {
        title: "Nome do Insumo",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Estoque",
        dataIndex: "stockQuantity",
        key: "stockQuantity",
        width: 140,
        align: "right" as const,
        render: (qty: number) => (
            <Text strong>
                {qty.toLocaleString("pt-BR")} un.
            </Text>
        ),
    },
    buildActionColumn<RawMaterial>({ onEdit, onDelete, deleteLabel: "insumo" }),
];

const RawMaterialsList = () => {
    const {
        form,
        modalOpen,
        editingRawMaterial,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
        rawMaterials,
        isLoadingGetRawMaterials,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
    } = useRawMaterials();

    return (
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <EntityListHeader
                title="Insumos"
                subtitle={`${rawMaterials?.totalItems ?? 0} ${
                    rawMaterials?.totalItems === 1
                        ? "insumo cadastrado"
                        : "insumos cadastrados"
                }`}
                addLabel="Novo Insumo"
                onAdd={openCreateModal}
            />

            <Table
                dataSource={rawMaterials?.data || []}
                columns={columns(openEditModal, handleDelete)}
                locale={{
                    emptyText: "Não há insumos registrados",
                }}
                loading={isLoadingGetRawMaterials}
                rowKey="id"
                size="middle"
                pagination={{
                    current: currentPage,
                    pageSize: itemsPerPage,
                    total: rawMaterials?.totalItems,
                    showSizeChanger: false,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setItemsPerPage(pageSize);
                    },
                }}
                scroll={{ x: 500 }}
            />

            <RawMaterialModal
                open={modalOpen}
                editingRawMaterial={editingRawMaterial}
                form={form}
                onOk={handleSubmit}
                onCancel={closeModal}
            />
        </Space>
    );
};

export default RawMaterialsList;
