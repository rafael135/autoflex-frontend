import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#f0f4f9",
            }}
            data-testid="not-found-page"
        >
            <Result
                status="404"
                title="404"
                subTitle="Página não encontrada. O endereço acessado não existe."
                extra={
                    <Button
                        type="primary"
                        onClick={() => navigate("/products")}
                        data-testid="not-found-home-button"
                    >
                        Voltar ao início
                    </Button>
                }
            />
        </div>
    );
};

export default NotFound;
