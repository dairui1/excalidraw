import React, { useState, useEffect, useRef, useCallback } from "react";
import { KEYS } from "@excalidraw/common";

import type {
  ExcalidrawTableElement,
  TableCellData,
} from "@excalidraw/element/types";

import type App from "../components/App";
import type { AppState } from "../types";

interface TableCellEditorProps {
  tableElement: ExcalidrawTableElement;
  cellRow: number;
  cellCol: number;
  app: App;
  appState: AppState;
  onClose: () => void;
}

export const TableCellEditor: React.FC<TableCellEditorProps> = ({
  tableElement,
  cellRow,
  cellCol,
  app,
  appState,
  onClose,
}) => {
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize text from cell data
    const cellData = tableElement.cellData[cellRow]?.[cellCol];
    setText(cellData?.text || "");
    setIsEditing(true);

    // Focus editor after mount
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.select();
      }
    }, 0);
  }, [tableElement, cellRow, cellCol]);

  const submitChanges = useCallback(() => {
    const newCellData: TableCellData = {
      text: text.trim(),
      backgroundColor:
        tableElement.cellData[cellRow]?.[cellCol]?.backgroundColor,
    };

    const updatedCellData = [...tableElement.cellData];
    if (!updatedCellData[cellRow]) {
      updatedCellData[cellRow] = [];
    }
    updatedCellData[cellRow][cellCol] = newCellData;

    app.mutateElement(tableElement, {
      cellData: updatedCellData,
    });
  }, [text, tableElement, cellRow, cellCol, app]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE) {
        onClose();
        return;
      }

      if (event.key === KEYS.ENTER && !event.shiftKey) {
        event.preventDefault();
        submitChanges();
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        submitChanges();
        onClose();
      }
    };

    if (isEditing) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, onClose, submitChanges]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  if (!isEditing) {
    return null;
  }

  // Calculate cell position and size
  const cellWidth =
    tableElement.colWidths[cellCol] || tableElement.width / tableElement.cols;
  const cellHeight =
    tableElement.rowHeights[cellRow] || tableElement.height / tableElement.rows;

  let cellX = tableElement.x;
  for (let i = 0; i < cellCol; i++) {
    cellX +=
      tableElement.colWidths[i] || tableElement.width / tableElement.cols;
  }

  let cellY = tableElement.y;
  for (let i = 0; i < cellRow; i++) {
    cellY +=
      tableElement.rowHeights[i] || tableElement.height / tableElement.rows;
  }

  const editorStyle: React.CSSProperties = {
    position: "absolute",
    left: cellX,
    top: cellY,
    width: cellWidth,
    height: cellHeight,
    padding: "4px",
    border: "2px solid #4f46e5",
    backgroundColor: "white",
    fontFamily: "inherit",
    fontSize: "14px",
    resize: "none",
    outline: "none",
    zIndex: 1000,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      <textarea
        ref={editorRef}
        value={text}
        onChange={handleChange}
        style={editorStyle}
        placeholder="Enter text..."
        spellCheck={false}
      />
    </div>
  );
};
