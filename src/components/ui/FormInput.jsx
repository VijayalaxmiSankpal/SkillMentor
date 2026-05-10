import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const FormInput = ({ label, type, name, value, onChange, placeholder, error, icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const Icon = icon;

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon className="text-base" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={
            Icon
              ? "input pl-10 " + (error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "")
              : "input " + (error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "")
          }
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword
              ? <RiEyeOffLine className="text-base" />
              : <RiEyeLine className="text-base" />
            }
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default FormInput;