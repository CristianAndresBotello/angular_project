import { Component, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagination-sort-items',
  templateUrl: './sort-items.component.html',
  styleUrls: ['./sort-items.component.scss']
})
export class SortItemsComponent implements OnChanges {
  //Get information
  @Input() data: any;

  sortList: Array<any> = [
    { index: "asc", value: "Ascendent" },
    { index: "desc", value: "Descendent" },
  ];
  itemList: Array<number> = [32, 64];

  page: number = 1;
  itemsPerPage: number = 32;
  filter: Array<string> = [];
  sort: string = "desc";
  baseUrl: string = "";

  constructor(
    private router: Router
  ) { }

  ngOnChanges(): void {
    //Set pagination info 
    this.page = this.data.page;
    this.itemsPerPage = this.data.itemsPerPage;
    this.filter = this.data.filter;
    this.sort = this.data.sort;
    this.baseUrl = this.data.baseUrl;
  }

  /**
   * Items per page change value
   * @param event 
   */
  onChangeItemsPerPage(event: any): void {
    //Get value
    let getValue = event.target.value.split(":");
    getValue = parseInt(getValue[1]);
    //Get URL params
    let getUrlParams = this.getParamList("itemsPerPage", getValue);
    //Redirect
    this.router.navigate([this.baseUrl], { queryParams: getUrlParams });
  }

  /**
   * Sort change value
   * @param event 
   */
  onChangeSort(event: any) {
    //Get value
    let getValue = event.target.value.split(": ");
    getValue = getValue[1].toString();

    //Get URL params
    let getUrlParams = this.getParamList("sort", getValue);
    //Redirect
    this.router.navigate([this.baseUrl], { queryParams: getUrlParams });
  }

  /**
   * Get param list
   * @param {string} type 
   * @param {number | string} value 
   * @returns 
   */
   getParamList(type: string, value: number | string) {
    let paramList = {}
    if (type == "itemsPerPage") {
      paramList = {
        page: this.page,
        sort: this.sort,
        items: value
      };
    } else if (type == "sort") {
      paramList = {
        page: this.page,
        sort: value,
        items: this.itemsPerPage
      };
    }

    //Add filters as param
    if (this.filter.length) {
      this.filter.forEach(element => {
        let filterObject: any = Object.assign({}, element);
        paramList = { ...paramList, ...filterObject };
      });
    }

    return paramList;
  }

}
