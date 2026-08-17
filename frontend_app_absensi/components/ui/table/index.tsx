import React, { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table
        className={`w-full border-collapse bg-white dark:bg-gray-900 ${className}`}
      >
        {children}
      </table>
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <thead
      className={`bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({
  children,
  className,
}) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tr
      className={`
        border-b border-gray-100
        dark:border-gray-800
        hover:bg-gray-50
        dark:hover:bg-gray-800/50
        transition-colors
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";

  return (
    <CellTag
      className={
        isHeader
          ? `
            px-6 py-4
            text-left
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-gray-700
            dark:text-gray-200
            ${className}
          `
          : `
            px-6 py-4
            text-sm
            text-gray-600
            dark:text-gray-300
            ${className}
          `
      }
    >
      {children}
    </CellTag>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
};