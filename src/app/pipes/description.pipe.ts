import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description'
})
export class DescriptionPipe implements PipeTransform {

  transform(value: string): string {
    let newVal = value
      .replaceAll('<b>', '').replaceAll('</b>', '')
      .replaceAll('<br>', '').replaceAll('</br>', '')
      .replaceAll('<i>', '').replaceAll('</i>', '')
      .replaceAll('<p>', '').replaceAll('</p>', '')
      .trim();
    return newVal
  }

}
