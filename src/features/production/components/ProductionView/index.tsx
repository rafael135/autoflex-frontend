import { Table, Statistic, Badge, Card, Row, Col, Typography, Alert } from 'antd';
import {
  DollarOutlined,
  ProductOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useGetProductionCapacityQuery } from '../../api';
import type { ProductDetail } from '../../types';

const { Text } = Typography;

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const columns = [
  {
    title: '#',
    key: 'rank',
    width: 56,
    align: 'center' as const,
    render: (_: unknown, __: ProductDetail, index: number) => (
      <Badge
        count={index + 1}
        style={{ backgroundColor: index === 0 ? '#d4a017' : '#1e3a5f' }}
      />
    ),
  },
  {
    title: 'Nome do Produto',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Capacidade Máxima',
    dataIndex: 'maxProductionCapacity',
    key: 'maxProductionCapacity',
    width: 180,
    align: 'right' as const,
    render: (qty: number) => (
      <Text strong>
        {qty.toLocaleString('pt-BR')} un.
      </Text>
    ),
  },
  {
    title: 'Valor Total',
    dataIndex: 'totalValue',
    key: 'totalValue',
    width: 180,
    align: 'right' as const,
    render: (v: number) => (
      <Text strong type="success">
        {formatCurrency(v)}
      </Text>
    ),
  },
];

export default function ProductionView() {
  const { data, isLoading, isError } = useGetProductionCapacityQuery();

  const topProduct = data?.products.length
    ? data.products.reduce((best, p) =>
        p.maxProductionCapacity > best.maxProductionCapacity ? p : best,
      )
    : null;

  return (
    <>
      {isError && (
        <Alert
          type="error"
          message="Não foi possível carregar os dados de produção."
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Valor Total de Produção"
              value={data?.totalProductionValue ?? 0}
              prefix={<DollarOutlined />}
              formatter={(v) => formatCurrency(Number(v))}
              styles={{
                content: {
                    color: '#1e3a5f', fontWeight: 700
                }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Produtos Simulados"
              value={data?.products.length ?? 0}
              prefix={<ProductOutlined />}
              valueStyle={{ color: '#1e3a5f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Maior Capacidade"
              value={
                topProduct
                  ? `${topProduct.maxProductionCapacity.toLocaleString('pt-BR')} un.`
                  : '—'
              }
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1e3a5f' }}
            />
            {topProduct && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {topProduct.name}
              </Text>
            )}
          </Card>
        </Col>
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
          locale={{ emptyText: 'Nenhum produto pode ser produzido com o estoque atual.' }}
        />
      </Card>
    </>
  );
}
