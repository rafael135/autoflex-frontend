import { Table, Button, Popconfirm, Tag, Space, Typography, Flex } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRawMaterials } from "./hooks/useRawMaterials";
import RawMaterialModal from "./components/RawMaterialModal";
import type { RawMaterial } from "../../types";

const { Title, Text } = Typography;

const columns = (
    onEdit: (r: RawMaterial) => void,
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
    {
        title: "Ações",
        key: "actions",
        width: 100,
        align: "center" as const,
        render: (_: unknown, record: RawMaterial) => (
            <Space size="small">
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => onEdit(record)}
                />
                <Popconfirm
                    title="Excluir insumo"
                    description="Tem certeza que deseja excluir este insumo?"
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
            <Flex justify="space-between" align="center">
                <Space direction="vertical" size={0}>
                    <Title level={4} style={{ margin: 0 }}>
                        Insumos
                    </Title>
                    <Text type="secondary">
                        {rawMaterials?.totalItems ?? 0}{" "}
                        {rawMaterials?.totalItems === 1
                            ? "insumo cadastrado"
                            : "insumos cadastrados"}
                    </Text>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreateModal}
                >
                    Novo Insumo
                </Button>
            </Flex>

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
