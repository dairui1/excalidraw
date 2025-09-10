import React, { useState } from "react";

import { useUIAppState } from "../context/ui-appState";

import { t } from "../i18n";

import { useExcalidrawSetAppState } from "./App";

import type { AppClassProperties, AppState, ExcalidrawProps } from "../types";

import { Dialog } from "./Dialog";
import { TextField } from "./TextField";
import { FilledButton } from "./FilledButton";

import "./TableDimensionDialog.scss";

export interface TableDimensionDialogProps {
  onTableCreate: (rows: number, columns: number) => void;
}

export const TableDimensionDialog: React.FC<TableDimensionDialogProps> = ({
  onTableCreate,
}) => {
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  if (appState.openDialog?.name !== "tableDimensions") {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTableCreate(rows, columns);
    setAppState({ openDialog: null });
  };

  const handleCancel = () => {
    setAppState({ openDialog: null });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog
      onCloseRequest={handleCancel}
      title={t("labels.tableDialog.createTable")}
      className="table-dimension-dialog"
      size="small"
    >
      <form onSubmit={handleSubmit}>
        <div className="table-dimension-fields">
          <div className="table-dimension-field">
            <label htmlFor="table-rows">{t("labels.tableDialog.rows")}:</label>
            <TextField
              type="number"
              min="1"
              max="20"
              value={rows.toString()}
              onChange={(value) => setRows(parseInt(value) || 1)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="table-dimension-field">
            <label htmlFor="table-columns">{t("labels.tableDialog.columns")}:</label>
            <TextField
              type="number"
              min="1"
              max="20"
              value={columns.toString()}
              onChange={(value) => setColumns(parseInt(value) || 1)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="table-dimension-actions">
          <FilledButton
            label={t("buttons.cancel")}
            variant="outlined"
            color="primary"
            onClick={handleCancel}
          />
          <FilledButton
            label={t("buttons.create")}
            color="primary"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </Dialog>
  );
};
