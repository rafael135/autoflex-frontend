import { Alert } from 'antd';

interface ErrorAlertProps {
    visible: boolean;
    message?: string;
    testId?: string;
}

const ErrorAlert = ({ visible, message = 'Ocorreu um erro. Tente novamente.', testId = 'error-alert' }: ErrorAlertProps) => {
    if (!visible) return null;

    return (
        <Alert
            type="error"
            showIcon
            message={message}
            style={{ marginBottom: 24 }}
            data-testid={testId}
        />
    );
};

export default ErrorAlert;
