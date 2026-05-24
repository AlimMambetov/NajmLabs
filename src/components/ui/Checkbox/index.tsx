'use client'
import React from 'react';
import cls from './style.module.scss';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  error?: string | boolean;
  className?: string;
  name?: string;
  [key: string]: any;
}

export const Checkbox = (props: CheckboxProps) => {
  const {
    checked,
    onChange,
    label,
    disabled,
    error,
    className = '',
    name,
    ...rest
  } = props;

  const errorMessage = typeof error === 'string' ? error : error ? 'Обязательное поле' : '';
  const hasError = !!error;

  return (
    <div className={`${cls.checkboxWrapper} ${className}`}>
      <label className={`${cls.checkbox} ${hasError ? cls.error : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          name={name}
          {...rest}
        />
        <span className={cls.customCheckbox}></span>
        {label && <span className={cls.label}>{label}</span>}
      </label>
      {hasError && errorMessage && (
        <span className={cls.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
}

export default Checkbox;