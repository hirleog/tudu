import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateTime',
})
export class FormatDateTimePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    // Ex: "2024-05-21 14:30"
    const [datePart, timePart] = value.split(' ');
    const [year, month, day] = datePart.split('-');

    if (!year || !month || !day || !timePart) return value;

    return `${day}/${month}/${year} - ${timePart}`;
  }
}
