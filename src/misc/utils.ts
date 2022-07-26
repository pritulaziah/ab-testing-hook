import md5 from "blueimp-md5";
import { IExperiment } from "./types";

// Was inspired by https://github.com/gyfchong/blue-red-testing/blob/master/lib/ab-testing.js

const getGroup = (
  uuid: string,
  { name: experimentName, trafficPercentRange = 1, groups = [] }: IExperiment
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
    0
  );

  const currentGroup = groups.find((group) => {
    const currentWeight = group.weight / totalWeight;
    groupWeight += currentWeight;
    return preparedId < groupWeight;
  });

  return currentGroup;
};

export { getGroup };
