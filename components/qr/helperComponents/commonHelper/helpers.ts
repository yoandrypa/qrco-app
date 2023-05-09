interface HandlerProps {
  openValidationErrors: () => void;
  handleValue: (prop: string) => (payload: any) => void;
  handleSave: () => void;
  secret?: string;
  secretOps?: string;
  errors: string[];
}

export interface NameSecretProps extends HandlerProps {
  qrName?: string;
  hideSecret: boolean;
  code: string;
}

export interface SecretHandlerProps extends HandlerProps {
  disabled: boolean;
}

export const td = {width: '30px', verticalAlign: 'top'};

export const iconColor = (disabled: boolean) => ({color: !disabled ? 'primary.main' : 'text.disabled'});
