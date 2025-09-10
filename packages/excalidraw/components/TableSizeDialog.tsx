import React, { useState } from "react";

import { t } from "../i18n";

interface TableSizeDialogProps {
  onConfirm: (rows: number, cols: number) => void;
  onCancel: () => void;
}

export const TableSizeDialog: React.FC<TableSizeDialogProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const handleSubmit = () => {
    onConfirm(rows, cols);
  };

  const handleRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      setRows(value);
    }
  };

  const handleColsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      setCols(value);
    }
  };

  const handleQuickSelect = (r: number, c: number) => {
    setRows(r);
    setCols(c);
  };

  return (
    <div className="TableSizeDialog">
      <div className="TableSizeDialog-overlay" onClick={onCancel} />
      <div className="TableSizeDialog-content">
        <h3>{t("tableTool.title")}</h3>
        <div className="TableSizeDialog-size-inputs">
          <div className="TableSizeDialog-input-group">
            <label>{t("tableTool.rows")}</label>
            <input
              type="number"
              min="1"
              max="50"
              value={rows}
              onChange={handleRowsChange}
            />
          </div>
          <div className="TableSizeDialog-input-group">
            <label>{t("tableTool.columns")}</label>
            <input
              type="number"
              min="1"
              max="50"
              value={cols}
              onChange={handleColsChange}
            />
          </div>
        </div>

        <div className="TableSizeDialog-quick-select">
          <h4>{t("tableTool.quickSelect")}</h4>
          <div className="TableSizeDialog-grid">
            <button onClick={() => handleQuickSelect(1, 1)}>1×1</button>
            <button onClick={() => handleQuickSelect(2, 2)}>2×2</button>
            <button onClick={() => handleQuickSelect(3, 3)}>3×3</button>
            <button onClick={() => handleQuickSelect(4, 4)}>4×4</button>
            <button onClick={() => handleQuickSelect(5, 3)}>5×3</button>
            <button onClick={() => handleQuickSelect(6, 4)}>6×4</button>
          </div>
        </div>

        <div className="TableSizeDialog-preview">
          <h4>{t("tableTool.preview")}</h4>
          <div className="TableSizeDialog-preview-grid">
            {Array.from({ length: Math.min(rows, 8) }).map((_, rowIndex) => (
              <div key={rowIndex} className="TableSizeDialog-preview-row">
                {Array.from({ length: Math.min(cols, 8) }).map(
                  (_, colIndex) => (
                    <div
                      key={colIndex}
                      className="TableSizeDialog-preview-cell"
                    />
                  ),
                )}
              </div>
            ))}
          </div>
          {(rows > 8 || cols > 8) && <p>{t("tableTool.tooLargePreview")}</p>}
        </div>

        <div className="TableSizeDialog-actions">
          <button onClick={onCancel}>{t("buttons.cancel")}</button>
          <button onClick={handleSubmit} className="primary">
            {t("tableTool.create")}
          </button>
        </div>
      </div>
    </div>
  );
};
