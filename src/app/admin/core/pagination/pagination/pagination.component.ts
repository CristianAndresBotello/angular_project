import { Component, Input, SimpleChanges, OnChanges } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent implements OnChanges {
  //Get information
  @Input() data: any;

  total: number = 0;
  range: number = 9;
  page: number = 1;
  itemsPerPage: number = 32;
  filter: Array<string> = [];
  sort: string = "desc";
  baseUrl: string = "";

  numberOfPages: number = 0;
  pageList: Array<any> = [];
  previousLinkStatus: boolean = false;
  previousPage: number = 0;
  previousLink: any;
  nextLinkStatus: boolean = false;
  nextPage: number = 0;
  nextLink: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Set pagination info
    this.previousLinkStatus = false;
    this.nextLinkStatus = false;
    this.total = this.data.total;
    this.page = this.data.page;
    this.itemsPerPage = this.data.itemsPerPage;
    this.filter = this.data.filter;
    this.sort = this.data.sort;
    this.baseUrl = this.data.baseUrl;

    this.getPagination();
  }

  /**
   * Generate pagination
   */
  getPagination() {
    //Calculate number of pages
    if (this.total >= 0) {
      this.numberOfPages = Math.ceil(this.total / this.itemsPerPage);
    }

    //Set previous Link
    if (this.page > 1 && this.total >= 10) {
      this.previousLinkStatus = true;
      this.previousPage = this.page - 1;
      this.previousLink = {
        baseUrl: this.baseUrl,
        params: this.getParams(this.previousPage)
      };
    }

    //Set next link
    if (this.page < this.numberOfPages && this.total >= 10) {
      this.nextLinkStatus = true;
      this.nextPage = this.page + 1;
      this.nextLink = {
        baseUrl: this.baseUrl,
        params: this.getParams(this.nextPage)
      };
    }

    //Page list
    this.pageList = Array.from({ length: this.numberOfPages }, (v, k) => {
      return {
        type: "page",
        page: k + 1,
        link: {
          baseUrl: this.baseUrl,
          params: this.getParams(k + 1)
        }
      };
    });

    //Validate number of items
    if (this.numberOfPages > 10) {
      //Caluculate page range
      let startRange = this.page - Math.floor(this.range / 2);
      let endRange = this.page + Math.floor(this.range / 2);

      if (startRange <= 0) {
        endRange += Math.abs(startRange) + 1;
        startRange = 1;
      }

      if (endRange > this.numberOfPages) {
        startRange -= endRange - this.numberOfPages;
        endRange = this.numberOfPages;
      }
      let pageRange: Array<number> = [...Array(endRange - startRange + 1)].map(
        (el, ind) => ind + startRange
      );

      let newPageList: Array<any> = [];
      Array.from({ length: this.numberOfPages + 1 }, (v, k) => {
        //Validate previous dots number
        if (pageRange[0] > 2 && k == pageRange[0]) {
          newPageList.push({
            type: "dots"
          });
        }

        //Set page list
        if (k == 1 || k == this.numberOfPages || pageRange.includes(k)) {
          newPageList.push({
            type: "page",
            page: k,
            link: {
              baseUrl: this.baseUrl,
              params: this.getParams(k)
            }
          });
        }

        //Validate next dots number
        if (
          pageRange[this.range - 1] < this.numberOfPages - 1 &&
          k == pageRange[this.range - 1]
        ) {
          newPageList.push({
            type: "dots"
          });
        }
      });

      //Set new page list
      this.pageList = newPageList;
    }
  }

  /**
   * Get param list
   * @param page
   * @returns {Object}
   */
  getParams(page: number) {
    let paramList = {
      page,
      sort: this.sort,
      items: this.itemsPerPage
    };

    //Add filters as param
    if (this.filter.length) {
      this.filter.forEach((element) => {
        let filterObject: any = Object.assign({}, element);
        paramList = { ...paramList, ...filterObject };
      });
    }
    return paramList;
  }
}
