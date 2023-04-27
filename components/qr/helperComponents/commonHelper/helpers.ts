export interface NameSecretProps {
  handleValue: (prop: string) => (payload: any) => void;
  qrName?: string;
  secret?: string;
  secretOps?: string;
  hideSecret: boolean;
  errors: string[];
  openValidationErrors: () => void;
}

export const iconColor = (disabled: boolean) => ({color: !disabled ? 'primary.main' : 'text.disabled'});
