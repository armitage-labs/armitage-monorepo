export interface IntervalDtoJson {
  value: number;
  sTime: number;
  eTime: number;
}

export class IntervalDto {
  constructor(
    public value: number,
    public sTime: number,
    public eTime: number,
  ) {}

  toJSON() {
    return {
      value: this.value,
      sTime: this.sTime,
      eTime: this.eTime,
    };
  }

  static fromJSON(json: IntervalDtoJson): IntervalDto {
    return new IntervalDto(json.value, json.sTime, json.eTime);
  }
}
