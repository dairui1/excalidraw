import clsx from "clsx";
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";

import { Button } from "./Button";
import { eyeIcon, eyeClosedIcon } from "./icons";

import "./TextField.scss";

import type { KeyboardEvent } from "react";

type TextFieldProps = {
  onChange?: (value: string) => void;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;

  readonly?: boolean;
  fullWidth?: boolean;
  selectOnRender?: boolean;

  icon?: React.ReactNode;
  label?: string;
  className?: string;
  placeholder?: string;
  isRedacted?: boolean;
} & ({ value: string } | { defaultValue: string }) &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onKeyDown" | "value" | "defaultValue" | "readOnly"
  >;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      onChange,
      label,
      fullWidth,
      placeholder,
      readonly,
      selectOnRender,
      onKeyDown,
      isRedacted = false,
      icon,
      className,
      ...inputProps
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    useLayoutEffect(() => {
      if (selectOnRender) {
        // focusing first is needed because vitest/jsdom
        innerRef.current?.focus();
        innerRef.current?.select();
      }
    }, [selectOnRender]);

    const [isTemporarilyUnredacted, setIsTemporarilyUnredacted] =
      useState<boolean>(false);

    return (
      <div
        className={clsx("ExcTextField", className, {
          "ExcTextField--fullWidth": fullWidth,
          "ExcTextField--hasIcon": !!icon,
        })}
        onClick={() => {
          innerRef.current?.focus();
        }}
      >
        {icon}
        {label && <div className="ExcTextField__label">{label}</div>}
        <div
          className={clsx("ExcTextField__input", {
            "ExcTextField__input--readonly": readonly,
          })}
        >
          <input
            className={clsx({
              "is-redacted":
                "value" in inputProps &&
                inputProps.value &&
                isRedacted &&
                !isTemporarilyUnredacted,
            })}
            readOnly={readonly}
            placeholder={placeholder}
            ref={innerRef}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={onKeyDown}
            {...("value" in inputProps
              ? { value: inputProps.value }
              : { defaultValue: inputProps.defaultValue })}
            {...inputProps}
          />
          {isRedacted && (
            <Button
              onSelect={() =>
                setIsTemporarilyUnredacted(!isTemporarilyUnredacted)
              }
              style={{ border: 0, userSelect: "none" }}
            >
              {isTemporarilyUnredacted ? eyeClosedIcon : eyeIcon}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
