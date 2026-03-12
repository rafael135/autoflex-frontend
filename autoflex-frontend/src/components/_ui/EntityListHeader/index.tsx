import { Button, Flex, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

interface EntityListHeaderProps {
    title: string;
    subtitle: ReactNode;
    addLabel: string;
    onAdd: () => void;
    addButtonTestId?: string;
}

const EntityListHeader = ({ title, subtitle, addLabel, onAdd, addButtonTestId = 'add-button' }: EntityListHeaderProps) => (
    <Flex justify="space-between" align="center" wrap="wrap" gap={"8px"}>
        <Space direction="vertical" size={0}>
            <Title level={4} style={{ margin: 0 }}>
                {title}
            </Title>
            <Text type="secondary">{subtitle}</Text>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd} data-testid={addButtonTestId}>
            {addLabel}
        </Button>
    </Flex>
);

export default EntityListHeader;
