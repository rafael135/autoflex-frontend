import { Button, Popconfirm, Space, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

const { Text } = Typography;

export const buildIdColumn = <T extends object>(): ColumnType<T> => ({
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    render: (id: number) => (
        <Tag color="geekblue">
            <Text code>{id}</Text>
        </Tag>
    ),
});

interface ActionColumnOptions<T> {
    onEdit: (record: T) => void;
    onDelete: (id: number) => void;
    deleteLabel: string;
}

export const buildActionColumn = <T extends { id: number }>({
    onEdit,
    onDelete,
    deleteLabel,
}: ActionColumnOptions<T>): ColumnType<T> => ({
    title: 'Ações',
    key: 'actions',
    width: 90,
    align: 'center' as const,
    render: (_: unknown, record: T) => (
        <Space size="small">
            <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record)}
            />
            <Popconfirm
                title={`Excluir ${deleteLabel}`}
                description={`Tem certeza que deseja excluir este(a) ${deleteLabel}?`}
                onConfirm={() => onDelete(record.id)}
                okText="Sim"
                cancelText="Não"
            >
                <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
        </Space>
    ),
});
