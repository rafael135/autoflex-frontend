import { ProductFilled } from "@ant-design/icons";
import { Layout } from "antd";
import type { FC, Key, ReactNode } from "react"



interface MenuItem {
    label: string;
    key: Key;
    icon?: ReactNode;
    children?: MenuItem[];
}


const menuItems: MenuItem[] = [
    {
        "label": "Produtos",
        "key": "products-menu",
        "icon": <ProductFilled />
    },
]


const MainLayout: FC = () => {
    

    return(
        <Layout style={{ minHeight: "100vh" }}>
            
        </Layout>
    )
}


export default MainLayout;