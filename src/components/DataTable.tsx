import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Grid, List } from "lucide-react";
import React from "react";

export interface DataTableColumn {
  key: string;
  label?: string;
  show?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableConfig {
  columns: DataTableColumn[];
  columnOrder?: string[];
  actions?: React.ReactNode;
  actionRender?: (row: any) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;

  // NEW
  search?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  viewType?: "table" | "grid";
  onViewChange?: (view: "table" | "grid") => void;
}

interface DataTableProps {
  data: any[];
  config: DataTableConfig;
}

const DataTable = ({ data, config }: DataTableProps) => {
  const getColumnLabel = (key: string, customLabel?: string): string => {
    if (customLabel) return customLabel;

    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const getVisibleColumns = (): DataTableColumn[] => {
    const visibleCols = config.columns.filter(
      (col) => col.show !== false
    );

    if (config.columnOrder && config.columnOrder.length > 0) {
      return visibleCols.sort((a, b) => {
        const indexA =
          config.columnOrder?.indexOf(a.key) ?? Infinity;

        const indexB =
          config.columnOrder?.indexOf(b.key) ?? Infinity;

        return indexA - indexB;
      });
    }

    return visibleCols;
  };

  const visibleColumns = getVisibleColumns();

  return (
    <Card className="p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        {config.search && (
          <div className="max-w-sm w-full">
            <Input
              placeholder={
                config.searchPlaceholder || "Search..."
              }
              value={config.searchValue || ""}
              onChange={(e) =>
                config.onSearchChange?.(e.target.value)
              }
            />
          </div>
        )}

        {/* View Toggle */}
        {config.onViewChange && (
          <div className="flex gap-2">
            <Button
              variant={
                config.viewType === "table"
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => config.onViewChange?.("table")}
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              variant={
                config.viewType === "grid"
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => config.onViewChange?.("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableHead key={col.key}>
                {getColumnLabel(col.key, col.label)}
              </TableHead>
            ))}

            {config.actions && (
              <TableHead className="text-right">
                {config.actions}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {config.isLoading ? (
            <TableRow>
              <TableCell
                colSpan={
                  visibleColumns.length +
                  (config.actions ? 1 : 0)
                }
                className="text-center py-8"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {visibleColumns.map((col) => (
                  <TableCell
                    key={`${rowIndex}-${col.key}`}
                  >
                   {col.render
  ? col.render(row?.[col.key as keyof typeof row], row)
  : row?.[col.key as keyof typeof row] || "-"}
                  </TableCell>
                ))}

                {config.actionRender && (
                  <TableCell className="text-right">
                    {config.actionRender(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  visibleColumns.length +
                  (config.actions ? 1 : 0)
                }
                className="text-center py-8"
              >
                {config.emptyMessage ||
                  "No data available"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DataTable;