import clsx from "clsx";
import { useExperimentVariant } from "../../dist";

const defaultClasses = ['text-white', 'bg-blue-700'];
const variantClasses = {
  'variantA': ['text-gray-900', 'bg-white', 'border', 'border-gray-200'],
  'variantB': ['text-white', 'bg-gray-800'],
};

interface IProps {
  children: React.ReactNode
}

const Button = ({ children }: IProps) => {
  const variantName = useExperimentVariant('new_button');
  const currentClasses = variantName ? variantClasses[variantName as 'variantA' | 'variantB'] : defaultClasses;

  return (
    <button type="button" className={clsx('font-medium rounded-lg text-sm px-4 py-2', currentClasses)}>
      {children}
    </button>
  )
}

export default Button;