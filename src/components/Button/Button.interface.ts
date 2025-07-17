import React, {ReactNode} from 'react';

interface BaseButtonProps {
  variant?: 'strokeRed' | 'fillRed' | 'fillDarkShadeGray';
  a11Label?: string;
  id?: string;
  className?: string;
  dataAttributes?: Record<string, string>;
  children: ReactNode;
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  disabled?: never;
  onClick?: never;
  isSubmit?: never;
}

interface ActionButtonProps extends BaseButtonProps {
  href?: never;
  target?: never;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  isSubmit?: boolean;
}

export type ButtonProps = LinkButtonProps | ActionButtonProps;
