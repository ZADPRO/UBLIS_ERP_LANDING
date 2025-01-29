import React from "react";

const SelectInput = ({
  id,
  name,
  label,
  options = [],
  required = false,
  isInvalid = false,
  disabled = false,
  value,
  readOnly = false,
  onChange,
}) => {
  const handleChange = (e) => {
    if (!readOnly && !disabled) {
      onChange(e);
    }
  };

  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        required={required}
        className={`relative w-full h-10 px-3 placeholder-transparent transition-all border-2 rounded outline-none focus-visible:outline-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white ${
          isInvalid
            ? "invalid:border-pink-500 invalid:text-pink-500 focus:invalid:border-pink-500"
            : "focus:border-[#ff5001]"
        } ${disabled ? "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" : ""}`}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        style={readOnly && !disabled ? { pointerEvents: "none" } : {}}
      >
        <option value="" disabled>
          {/* Placeholder for empty option */}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className={`cursor-text peer-focus:cursor-default -top-3 absolute left-2 z-[1] px-2 text-[1rem] text-[#ff5001] transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all ${
          isInvalid ? "peer-invalid:text-pink-500" : "peer-focus:text-[#ff5001]"
        } peer-placeholder-shown:text-bold ${
          required ? "peer-required:after:content-[]" : ""
        } peer-focus:-top-3 peer-focus:text-[1rem] peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-slate-50 `}
      >
        {label}
      </label>
    </div>
  );
};

export default SelectInput;
