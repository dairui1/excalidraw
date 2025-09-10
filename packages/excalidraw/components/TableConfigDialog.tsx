import { useState } from "react";
import { t } from "../i18n";
import { Island } from "./Island";

interface TableConfigDialogProps {
  onConfirm: (rows: number, columns: number) => void;
  onClose: () => void;
}

const TableConfigDialog: React.FC<TableConfigDialogProps> = ({
  onConfirm,
  onClose,
}) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(rows, columns);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="excalidraw-dialog-overlay" onClick={onClose}>
      <Island padding={3} className="excalidraw-dialog">
        <div
          className="excalidraw-dialog-content"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          <h3 className="excalidraw-dialog-title">
            Configure Table
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="excalidraw-dialog-row">
              <label htmlFor="table-rows">
                Rows:
              </label>
              <input
                id="table-rows"
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                autoFocus
              />
            </div>
            <div className="excalidraw-dialog-row">
              <label htmlFor="table-columns">
                Columns:
              </label>
              <input
                id="table-columns"
                type="number"
                min="1"
                max="20"
                value={columns}
                onChange={(e) => setColumns(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              />
            </div>
            <div className="excalidraw-dialog-actions">
              <button type="button" onClick={onClose}>
                {t("buttons.cancel")}
              </button>
              <button type="submit" className="primary">
                {t("buttons.create")}
              </button>
            </div>
          </form>
        </div>
      </Island>
    </div>
  );
};

export default TableConfigDialog;