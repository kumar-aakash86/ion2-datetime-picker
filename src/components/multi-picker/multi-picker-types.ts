import moment from 'moment';
import _ from 'lodash';
import { PickerColumn } from 'ionic-angular';

import { MultiPicker } from './multi-picker'
import { MultiPickerColumn, MultiPickerColumnDays, MultiPickerColumnMinutes, MultiPickerColumnHours } from './multi-picker-columns';

export interface IMultiPickerDateTypeColumns {
  daysCol: MultiPickerColumnDays,
  monthsCol: MultiPickerColumn,
  yearsCol: MultiPickerColumn
}

export interface IMultiPickerTimeColumns {
  hoursCol: MultiPickerColumn,
  minutesCol: MultiPickerColumn
}

export class MultiPickerType {
  protected _columns: IMultiPickerDateColumns |  IMultiPickerTimeColumns;

  get(): IMultiPickerDateColumns |  IMultiPickerTimeColumns {
    return this._columns
  }

  dealDoneVisibleBnt(columns: PickerColumn[], button): void {
    let isSomeDisabled = _.some(
      _.map(columns, (col, index) => col.options[col.selectedIndex].disabled)
    );
    button.cssRole = isSomeDisabled ? 'hide' : '';
  }

  protected allSelectedIndexesBlank(columns: PickerColumn[]): boolean {
    return _.every(columns.map(col => !_.isNumber(col.selectedIndex)))
  }

  protected setDefaultSelectedIndexes(columns: PickerColumn[], values: Array<number>): void {
    _(columns).each((col, i) => {
      col.selectedIndex = col.selectedIndex || _.findIndex(col.options, (option)=> option['value'] == values[i])
    })
  }

  protected disableInvalid(columns: PickerColumn[], colName: string, pickerColIndex: number, rest: Array<number>): void {
    let allowed = this._columns[colName].filter(...rest);
    _(columns[pickerColIndex].options).each(option => {
      option.disabled = !_(allowed).includes(option.value);
    });
  }
}
