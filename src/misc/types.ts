export interface IExperiment {
  name: string;
  trafficPercentRange?: [number, number] | number;
  groups: IExperimentGroup[];
}

export interface IExperimentGroup {
  weight: number;
  name: string;
}
