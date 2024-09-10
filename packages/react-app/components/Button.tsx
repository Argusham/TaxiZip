type Props = {
  title: string;
  onClick: () => void;
  widthFull?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

function PrimaryButton({
  title,
  onClick,
  widthFull = false,
  disabled,
  loading,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled ?? loading}
      className={`${
        widthFull ? "w-60" : "px-4"
      } ${className} font-bold bg-yellow-500 rounded-2xl text-white py-3 flex justify-center items-center`}
    >
      {loading ? <>Loading...😶‍🌫️</> : title}
    </button>
  );
}

export default PrimaryButton;
