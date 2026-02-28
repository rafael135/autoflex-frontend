import { Alert } from 'antd';

interface ErrorAlertProps {
    visible: boolean;
    message?: string;
}

const ErrorAlert = ({ visible, message = 'Ocorreu um erro. Tente novamente.' }: ErrorAlertProps) => {
    if (!visible) return null;

    return (
        <Alert
            type="error"
            showIcon
            message={message}
            style={{ marginBottom: 24 }}
        />
    );
};

export default ErrorAlert;
