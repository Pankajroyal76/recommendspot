import { Pipe, PipeTransform } from '@angular/core';
const errors = [null, undefined, 'undefined', ''];
@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: any[], searchText: string): any[] {

    console.log(items, searchText)
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();


    // return items.filter(it => {
    //   // console.log(errors.indexOf(it.user_name.toLowerCase().includes(searchText))
    //   if (errors.indexOf(it.user_name.toLowerCase().includes(searchText)) == -1) {
    //     return it.user_name.toLowerCase().includes(searchText);
    //   }
    //   if (errors.indexOf(it.category.toLowerCase().includes(searchText)) == -1) {
    //     return it.category.toLowerCase().includes(searchText);
    //   }
    //   if (errors.indexOf(it.sub_category.toLowerCase().includes(searchText)) == -1) {
    //     return it.sub_category.toLowerCase().includes(searchText);
    //   }
    //   if (errors.indexOf(it.description.toLowerCase().includes(searchText)) == -1) {
    //     return it.description.toLowerCase().includes(searchText);
    //   }
    //   if (errors.indexOf(it.title.toLowerCase().includes(searchText)) == -1) {
    //     return it.title.toLowerCase().includes(searchText);
    //   }
    // });


    return items.filter(it => {
      return (it.user_name.toLowerCase().includes(searchText)|| it.category.toLowerCase().includes(searchText)    ||   it.sub_category.toLowerCase().includes(searchText)  || it.title.toLowerCase().includes(searchText) || it.description.toLowerCase().includes(searchText) );
    });
  }
}