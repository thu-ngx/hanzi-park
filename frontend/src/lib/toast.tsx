import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, Info, type LucideIcon } from "lucide-react";

const toastStyle = {
    background: "white",
    color: "#374151",
    border: "1px solid hsl(150, 87%, 13%)",
};

const showToast = (message: string, Icon: LucideIcon) => {
    sonnerToast(message, {
        style: toastStyle,
        icon: <Icon className="w-5 h-5 text-primary" />,
    });
};

export const toast = {
    success: (message: string) => showToast(message, CheckCircle),
    error: (message: string) => showToast(message, XCircle),
    info: (message: string) => showToast(message, Info),
};
