export type TeamIntervalsOverviewDto = {
  teamName: string;
  intervals: Interval[];
};

export type Interval = {
  start: number;
  end: number;
  score: number;
};

export type ScoreIntervalDto = {
  eTime: number;
  sTime: number;
  value: number;
};
