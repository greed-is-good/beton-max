type ActionButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
};

export default function ActionButton({
  label,
  onClick,
  disabled,
  variant = "primary",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl px-3 py-2 text-sm font-semibold transition ${
        variant === "ghost"
          ? "border border-slatey-200 bg-white text-slatey-600 hover:bg-slatey-50"
          : "bg-accent-600 text-white hover:bg-accent-700"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {label}
    </button>
  );
}
