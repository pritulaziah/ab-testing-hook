import React, { useContext, useMemo } from 'react';
import md5 from 'blueimp-md5';

interface IExperiment {
  name: string;
  trafficPercentRange?: [number, number] | number;
  groups: IExperimentGroup[];
}

interface IExperimentGroup {
  weight: number;
  name: string;
}

interface ABTestContextProps {
  userId?: string | null;
  experiments: IExperiment[];
}

const ABTestContext = React.createContext<ABTestContextProps>(
  {} as ABTestContextProps,
);

interface ABTestProviderProps extends Omit<ABTestContextProps, 'experiments'> {
  children?: React.ReactNode;
  /**
   * Experiment or Exoeriment array
   */
  experiments?: IExperiment[] | IExperiment;
}

const ABTestProvider = ({
  children,
  userId,
  experiments = [],
}: ABTestProviderProps) => {
  const value = useMemo(
    () => ({
      userId,
      experiments: Array.isArray(experiments) ? experiments : [experiments],
    }),
    [userId, experiments],
  );

  return (
    <ABTestContext.Provider value={value}>{children}</ABTestContext.Provider>
  );
};

const useExperimentVariant = (experimentName: string) => {
  const { experiments, userId } = useContext(ABTestContext);

  const variant = useMemo(() => {
    const getExperimentGroup = (
      uuid: string,
      { name: experimentName, trafficPercentRange = 1, groups = [] }: IExperiment,
    ) => {
      const [minPercent, maxPercent] = Array.isArray(trafficPercentRange)
        ? trafficPercentRange
        : [0, trafficPercentRange];

      /*
        │   Exp 1   │   Exp 2   │  Exp 3  │ Exp 4 │
        │  A  |  B  |           |         |       |
        0           10                           100
      */

      // [0, 0.1] equals 10% traffics
      // [0, 1] equals 100% traffics
      // [0.6, 1] and [0, 0.4] equals 40% traffics, but different people,
      // this need to some experiment with not intersection

      const currentId =
        Number(`0x${md5(experimentName, uuid).slice(0, 8)}`) / 0xffffffff;

      if (currentId < minPercent || currentId >= maxPercent) {
        return null;
      }

      const preparedId = (currentId - minPercent) / (maxPercent - minPercent);
      let groupWeight = 0;
      const totalWeight = groups.reduce(
        (accumulativeWeight, { weight }) => accumulativeWeight + weight,
        0,
      );
      const currentGroup = groups.find((group) => {
        const currentWeight = group.weight / totalWeight;
        groupWeight += currentWeight;
        return preparedId < groupWeight;
      });

      return currentGroup?.name || null;
    };

    const currentExperiment =
      userId &&
      experiments.find((experiment) => experiment.name === experimentName);

    const variantName = currentExperiment
      ? getExperimentGroup(userId, currentExperiment)
      : null;

    return variantName;
  }, [userId, experiments, experimentName]);

  return variant;
};

export {
  ABTestProvider,
  ABTestProviderProps,
  useExperimentVariant,
  ABTestContextProps,
  IExperiment,
  IExperimentGroup,
};
