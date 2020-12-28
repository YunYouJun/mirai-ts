export interface ILog {
  info: (data: any) => void;
  success: (data: any) => void;
  warning: (data: any) => void;
  error: (data: any) => void;
}
