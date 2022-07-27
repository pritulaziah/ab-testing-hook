import clsx from "clsx";
import { useExperimentVariant } from "ab-testing-hook";

const defaultClasses = ['text-white', 'bg-blue-700'];
const variantClasses = {
  'variantA': ['text-gray-900', 'bg-white', 'border', 'border-gray-200'],
  'variantB': ['text-white', 'bg-gray-800'],
};

const MyButton = () => {
  const variantName = useExperimentVariant('new_button');
  const currentClasses = variantName ? variantClasses[variantName as 'variantA' | 'variantB'] : defaultClasses;

  return (
    <button type="button" className={clsx('font-medium rounded-lg text-sm px-4 py-2', currentClasses)}>
      {`This is ${variantName || 'default'} button`}
    </button>
  )
}

export default MyButton;