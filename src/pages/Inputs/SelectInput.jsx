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
  readonly = false,
  onChange,
}) => {
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
  } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
    readonly ? "pointer-events-none" : ""
  }`}
  value={value}
  onChange={onChange}
  disabled={disabled || readonly} // Disables select if readonly or disabled
>
  <option value="" disabled selected>
    {/* Placeholder for empty option */}
  </option>
  {options.map((option) => (
    <option key={option.value} value={option.value} disabled={readonly}>
      {option.label}
    </option>
  ))}
</select>

      <label
        htmlFor={id}
        className="pointer-events-none absolute left-2 z-[1] -top-3 px-2 text-[1rem] text-[#ff5001] transition-all before:absolute before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-[#000000] peer-valid:text-[1rem] peer-focus:text-[1rem] peer-focus:text-[#ff5001] peer-disabled:cursor-not-allowed peer-disabled:text-[#ff5001] peer-disabled:before:bg-white"
      >
        {label}
      </label>
    </div>
  );
};

export default SelectInput;
