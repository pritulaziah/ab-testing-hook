import clsx from "clsx";
import { useExperimentVariant } from "ab-testing-hook";

const defaultClasses = ["bg-blue-700", "hover:bg-blue-800"];
const variantClasses = {
  variantA: ["bg-red-700", "hover:bg-red-800"],
  variantB: ["bg-purple-700", "hover:bg-purple-800"],
};

const MyButton = () => {
  const variantName = useExperimentVariant("new_button");
  const currentClasses = variantName
    ? variantClasses[variantName as "variantA" | "variantB"]
    : defaultClasses;

  return (
    <button
      type="button"
      className={clsx(
        "text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors",
        currentClasses
      )}
    >
      {`This is ${variantName || "default"} button`}
    </button>
  );
};

export default MyButton;
