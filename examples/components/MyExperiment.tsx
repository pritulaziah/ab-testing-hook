import clsx from "clsx";
import { useExperimentVariant } from "ab-testing-hook";
import { useEffect } from "react";

const defaultClasses = ["bg-blue-700", "hover:bg-blue-800"];
const variantClasses = {
  variantA: ["bg-red-700", "hover:bg-red-800"],
  variantB: ["bg-purple-700", "hover:bg-purple-800"],
};

const MyExperiment = () => {
  const variantName = useExperimentVariant("new_button");
  const currentClasses = variantName
    ? variantClasses[variantName as "variantA" | "variantB"]
    : defaultClasses;

  useEffect(() => {
    if (variantName) {
      console.log(`I'm a variant = ${variantName}`); // or go to push datalayer analytics
    }
  }, []);

  return (
    <div className="flex flex-row items-center">
      <h4 className="mr-4">Result my experiment:</h4>
      <button
        type="button"
        className={clsx(
          "text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors",
          currentClasses
        )}
      >
        {`This is ${variantName || "default"} button`}
      </button>
    </div>
  );
};

export default MyExperiment;
