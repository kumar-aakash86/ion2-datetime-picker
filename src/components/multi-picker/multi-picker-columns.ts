import _ from 'lodash';
import moment from 'moment';

export interface IMultiPickerOption {
  text?: string
  value?: any;
  parentVal?: any | Array<any>;
  disabled?:boolean;
}

export interface IColumnFormat {
  pattern: string,
  is12: boolean,
  noons: Array<string>,
  hours: number,
  toISO: Function
}

export interface IColumnAttrs {
  name?: string,
  firstOptionValue?: number,
  lastOptionValue?: number,
  step?: number,
  format?: IColumnFormat,
  min?: moment.Moment,
  max?: moment.Moment
}

export interface IMultiPickerColumn extends IColumnAttrs {
  options: IMultiPickerOption[]
}

export class MultiPickerColumn implements IMultiPickerColumn {
  static get defaultFormat(): IColumnFormat {
    return {
      pattern: '',
      is12: false,
      noons: ['am', 'pm'],
      hours: 24,
      toISO: function (hour: number, noon: number): number {
        if (!noon || !this.is12) return hour;
        return hour + noon * 12
      }
    }
  };
  name: string;
  firstOptionValue: number = 1;
  lastOptionValue: number;
  step: number = 1;
  format: IColumnFormat = MultiPickerColumn.defaultFormat;
  options: Array<IMultiPickerOption>;
  min: moment.Moment;
  max: moment.Moment;

  constructor(attrs: IColumnAttrs) {
    _.merge(this, attrs);
  }

  get values(): number[] {
    return _.map(this.options, option => parseInt(option.value))
  }

  selectedOptionIndex(datetime: string, momentName: string = this.name): number {
    if (datetime) {
      const selectedValue = this.selectedValue(datetime, momentName);
      return _.findIndex(this.options, (option)=> option.value  == selectedValue )
    }
  }

  protected selectedValue(datetime: string, momentName: string = this.name): number {
    return moment(datetime)[momentName]()
  }

  protected generateOptions(): void {
    this.options = this.range(this.firstOptionValue, this.lastOptionValue);
  }

  protected range(from:number, to:number): Array<IMultiPickerOption> {
    return this.toOptions(_.range(from, to + 1, this.step))
  }

  protected optionText(num: number): string {
    return `${num}`
  }

  protected toOption(num: number, extend?: Object): IMultiPickerOption  {
    return _.extend({ text: this.optionText(num), value: num }, extend || {})
  };

  protected toOptions(nums: Array<number>): Array<IMultiPickerOption>  {
    return nums.map(val => { return this.toOption(val) })
  };

  protected toMoment(year, month, day): moment.Moment {
    return moment([year, month - 1, day])
  }
}
