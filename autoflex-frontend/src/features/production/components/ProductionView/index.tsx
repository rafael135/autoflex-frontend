import { Table, Badge, Card, Row, Typography } from "antd";
import {
    DollarOutlined,
    ProductOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import type { ProductDetail } from "../../types";
import { StatisticCard, ErrorAlert } from "../../../../components/_ui";
import { formatCurrency } from "../../../../app/utils/formatters";
import { useProduction } from "./hooks/useProduction";

const { Text } = Typography;

const columns = [
    {
        title: "#",
        key: "rank",
        width: 56,
        align: "center" as const,
        render: (_: unknown, __: ProductDetail, index: number) => (
            <Badge
                count={index + 1}
                style={{ backgroundColor: index === 0 ? "#d4a017" : "#1e3a5f" }}
            />
        ),
    },
    {
        title: "Nome do Produto",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Capacidade Máxima",
        dataIndex: "maxProductionCapacity",
        key: "maxProductionCapacity",
        width: 180,
        align: "right" as const,
        render: (qty: number) => (
            <Text strong>{qty.toLocaleString("pt-BR")} un.</Text>
        ),
    },
    {
        title: "Valor Total",
        dataIndex: "totalValue",
        key: "totalValue",
        width: 180,
        align: "right" as const,
        render: (v: number) => (
            <Text strong type="success">
                {formatCurrency(v)}
            </Text>
        ),
    },
];

const ProductionView = () => {
    const { data, isLoading, isError, topProduct } = useProduction();

    return (
        <>
            <ErrorAlert
                visible={isError}
                message="Não foi possível carregar os dados de produção."
            />

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <StatisticCard
                    loading={isLoading}
                    title="Valor Total de Produção"
                    value={data?.totalProductionValue ?? 0}
                    prefix={<DollarOutlined />}
                    formatter={(v) => formatCurrency(Number(v))}
                    colProps={{
                        xs: 24, md: 12, sm: 12
                    }}
                    styles={{ content: { color: "#1e3a5f", fontWeight: 700 } }}
                    testId="statistic-total-value"
                />
                <StatisticCard
                    loading={isLoading}
                    title="Produtos Simulados"
                    value={data?.products.length ?? 0}
                    prefix={<ProductOutlined />}
                    colProps={{
                        xs: 24, md: 12, sm: 12
                    }}
                    styles={{ content: { color: "#1e3a5f" } }}
                    testId="statistic-products-count"
                />
                <StatisticCard
                    loading={isLoading}
                    title="Maior Capacidade"
                    value={
                        topProduct
                            ? `${topProduct.maxProductionCapacity.toLocaleString("pt-BR")} un.`
                            : "—"
                    }
                    prefix={<BarChartOutlined />}
                    styles={{
                        content: {
                            color: "#1e3a5f",
                        },
                    }}
                    testId="statistic-max-capacity"
                    colProps={{
                        xs: 24, md: 24, sm: 24
                    }}
                    extra={
                        topProduct ? (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {topProduct.name}
                            </Text>
                        ) : undefined
                    }
                />
            </Row>

            <Card>
                <Table
                    dataSource={data?.products ?? []}
                    columns={columns}
                    rowKey="id"
                    size="middle"
                    loading={isLoading}
                    pagination={false}
                    scroll={{ x: 500 }}
                    locale={{
                        emptyText:
                            "Nenhum produto pode ser produzido com o estoque atual.",
                    }}
                    data-testid="production-table"
                />
            </Card>
        </>
    );
}

export default ProductionView;