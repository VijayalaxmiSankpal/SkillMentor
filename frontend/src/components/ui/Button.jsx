import Spinner from "./Spinner";

const Button = ({ children, loading, disabled, type, onClick, variant, fullWidth }) => {
  const base = fullWidth ? "w-full" : "";

  const getClass = () => {
    if (variant === "secondary") {
      return base + " btn-secondary";
    }
    if (variant === "ghost") {
      return base + " btn-ghost";
    }
    return base + " btn-primary";
  };

  const isDisabled = loading || disabled;

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={isDisabled}
      className={getClass()}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;