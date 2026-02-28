import { Card, Col, Statistic } from "antd";
import type { ColProps } from "antd";
import type { StatisticProps } from "antd";
import type { ReactNode } from "react";

interface StatisticCardProps extends StatisticProps {
    loading?: boolean;
    colProps?: ColProps;
    extra?: ReactNode;
}

const StatisticCard = ({
    loading,
    colProps = { xs: 24, md: 12, sm: 8 },
    extra,
    ...statisticProps
}: StatisticCardProps) => (
    <Col {...colProps}>
        <Card loading={loading}>
            <Statistic {...statisticProps} />
            {extra}
        </Card>
    </Col>
);

export default StatisticCard;
