import { useState } from "react";
import { Layout, Menu, Button, Drawer, Typography, Grid } from "antd";
import {
    DatabaseOutlined,
    ShoppingOutlined,
    BarChartOutlined,
    MenuOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type ActiveView = "products" | "rawMaterials" | "production";

const NAV_ITEMS = [
    { key: "products", icon: <ShoppingOutlined />, label: "Produtos" },
    { key: "rawMaterials", icon: <DatabaseOutlined />, label: "Insumos" },
    { key: "production", icon: <BarChartOutlined />, label: "Simulador" },
];

const VIEW_TITLES: Record<ActiveView, string> = {
    products: "Gestão de Produtos",
    rawMaterials: "Gestão de Insumos",
    production: "Simulador de Produção",
};

const SIDEBAR_BG = "#1e3a5f";

export default function Dashboard() {
    const [activeView, setActiveView] = useState<ActiveView>("products");
    const [siderCollapsed, setSiderCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const screens = useBreakpoint();
    const isMobileLayout = !screens.md;

    const navigate = useNavigate();

    const menuEl = (isMobile = false) => (
        <Menu
            mode="inline"
            selectedKeys={[activeView]}
            items={NAV_ITEMS}
            theme="dark"
            inlineCollapsed={!isMobile && siderCollapsed}
            style={{ background: "transparent", border: "none" }}
            onClick={({ key }) => {
                setActiveView(key as ActiveView);
                if (isMobile) setDrawerOpen(false);
                navigate(`/${key}`);
            }}
        />
    );

    const logoEl = (collapsed = false) => (
        <Layout.Header
            style={{
                background: SIDEBAR_BG,
                height: 64,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                lineHeight: "normal",
            }}
        >
            <ExperimentOutlined style={{ fontSize: 22, color: "#facc15" }} />
            {!collapsed && (
                <span>
                    <Title
                        level={5}
                        style={{ color: "#fff", margin: 0, lineHeight: 1.2 }}
                    >
                        Autoflex
                    </Title>
                    <Text
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
                    >
                        Gestão Industrial
                    </Text>
                </span>
            )}
        </Layout.Header>
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Desktop Sider */}
            <Sider
                collapsible
                collapsed={siderCollapsed}
                onCollapse={setSiderCollapsed}
                trigger={null}
                width={220}
                collapsedWidth={0}
                breakpoint="md"
                onBreakpoint={(broken) => setSiderCollapsed(broken)}
                style={{ background: SIDEBAR_BG }}
            >
                {logoEl(siderCollapsed)}
                {menuEl(false)}
            </Sider>

            {/* Mobile Drawer */}
            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                placement="left"
                width={220}
                styles={{
                    body: { padding: 0, background: SIDEBAR_BG },
                    header: { display: "none" },
                }}
            >
                {logoEl(false)}
                {menuEl(true)}
            </Drawer>

            <Layout>
                <Header
                    style={{
                        background: "#fff",
                        padding: "0 24px",
                        borderBottom: "1px solid #e8edf3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        height: 56,
                        lineHeight: "56px",
                    }}
                >
                    {/* Left: toggle + title */}
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        {/* Mobile hamburger */}
                        {isMobileLayout && (
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setDrawerOpen(true)}
                            />
                        )}
                        {/* Desktop collapse */}
                        {!isMobileLayout && (
                            <Button
                                type="text"
                                icon={
                                    siderCollapsed ? (
                                        <MenuUnfoldOutlined />
                                    ) : (
                                        <MenuFoldOutlined />
                                    )
                                }
                                onClick={() => setSiderCollapsed((v) => !v)}
                            />
                        )}
                        <Title level={5} style={{ margin: 0 }}>
                            {VIEW_TITLES[activeView]}
                        </Title>
                    </span>
                </Header>

                <Content
                    style={{
                        background: "#f0f4f9",
                        padding: isMobileLayout ? "12px 8px" : 24,
                        minHeight: "calc(100vh - 56px)",
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
