import React, {
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { XMark } from "./svg";
import { classes } from "../utils";

export function Input({
  label,
  setValue: _setValue,
  value,
  placeholder,
  type = "text",
  isClearable,
  icon,
  error,
  preIcon,
}: {
  value: string;
  setValue: (_: string) => void;
  label?: string;
  placeholder: string;
  type?: "email" | "password" | "text";
  isClearable?: boolean;
  icon?: ReactNode;
  error?: string;
  preIcon?: ReactNode;
}) {
  const onChange = useMemo(() => {
    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
      _setValue && _setValue(e.target.value);
    };
    return onChange;
  }, []);

  return (
    <div className="flex flex-col gap-2 w-[300px]">
      {label && <label>{label}</label>}
      <div
        className={classes(
          "text-black p-2 rounded-xl bg-white flex flex-row justify-between",
          error && "border border-solid border-red-400"
        )}>
        {preIcon}
        <input
          type={type}
          className="focus-visible:[outline:unset]"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {isClearable && !!value && <XMark onClick={() => _setValue("")} />}
        {icon}
      </div>
      {!!error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  );
}
