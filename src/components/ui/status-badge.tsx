import React from "react";

type TypeStatus = "success" | "warning" | "error" | "info";

const StatusLabel: Record<TypeStatus, string> = {
    success: "Success",
    warning: "Warning",
    error: "Error",
    info: "Info"
};

const StatusBadgeStyle: Record<TypeStatus, string> = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
};

export const StatusBadge = ({ TypeStatus }: { TypeStatus: TypeStatus }) => {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${StatusBadgeStyle[TypeStatus]}`}
        >
      {StatusLabel[TypeStatus]}
    </span>
    )
}