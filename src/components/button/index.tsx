import React, { PureComponent } from 'react';
import styles from './button.module.css';

type TButtonProps = {
  primary?: boolean;
  secondary?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export class Button extends PureComponent<TButtonProps> {
  render() {
    const { primary, secondary, children, ...props } = this.props;
    return (
      <button {...props} className={primary ? styles.primary : styles.secondary}>
        {children}
      </button>
    );
  }
}