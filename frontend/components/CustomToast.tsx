import { toast } from "sonner";

export const CustomToast = ({
  message,
  type,
  description,
}: {
  message: string;
  type: "success" | "error" | "warning" | "info";
  description?: string;
}) => {
  return toast[type](message, {
    description,
    duration: 3000,
    position: "top-right",
    style: {
      background: "var(--background)",
      color: "var(--foreground)",
      border: "1px solid var(--border)",
    },
  });
};
