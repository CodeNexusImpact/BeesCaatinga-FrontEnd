export interface ColunaRelatorio<T = any> {
  label: string;
  dataKey: keyof T;
  sortable?: boolean;
  flex?: number;
  renderCell?: (value: any, row: T) => React.ReactNode;
}