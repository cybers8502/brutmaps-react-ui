import type {ButtonProps} from './Button.interface';
import './_button.scss';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

export default function Button({
  variant = 'fillRed',
  href,
  target,
  a11Label,
  id,
  disabled,
  onClick,
  className,
  dataAttributes,
  isSubmit,
  children,
}: ButtonProps) {
  const buttonProps = {
    ...(dataAttributes || {}),
  };

  const classes = classNames('button', className, {
    'button--stroke-red': variant === 'strokeRed',
    'button--fill-red': variant === 'fillRed',
    'button--fill-dark-shade-gray': variant === 'fillDarkShadeGray',
  });

  if (href) {
    return (
      <Link {...buttonProps} className={classes} to={href} target={target} aria-label={a11Label} id={id}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={isSubmit ? 'submit' : 'button'}
      className={classes}
      onClick={onClick}
      aria-label={a11Label}
      disabled={disabled}
      {...buttonProps}>
      {children}
    </button>
  );
}
