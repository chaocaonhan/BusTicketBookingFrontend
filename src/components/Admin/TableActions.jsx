// src/components/Admin/TableActions.jsx
import React from "react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";

const TableActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <button onClick={onEdit} className="text-orange-400 " title="Chỉnh sửa">
        <Pencil className="h-7 w-7" />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 focus:outline-none"
        title="Xóa"
      >
        <Trash2 />
      </button>
    </div>
  );
};

export default TableActions;
