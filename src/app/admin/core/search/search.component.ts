import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  //Get information from parent
  @Input() data: any;
  @Input() options: any;

  searchForm!: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder, private router: Router) {}

  ngOnInit(): void {
    // Get pagination Data
    const pagination = this.data;

    // Initialize form values
    let searchForm = { option: this.options[0].key, term: "" };
    if (pagination.filter.length > 0) {
      // Get current filter
      pagination.filter.map((filter: {}) => {
        [searchForm.option, searchForm.term] = Object.entries(filter)[0] as any;
      });
    }

    // Set initial form values
    this.searchForm = this.formBuilder.group({
      searchTerm: searchForm.term,
      searchOption: searchForm.option
    });
  }

  get searchTerm(): any {
    return this.searchForm.get("searchTerm");
  }

  get searchOption(): any {
    return this.searchForm.get("searchOption");
  }

  /**
   * Submit user information
   */
  onSubmit() {
    this.doNavigation();
  }

  /**
   * Clear search input and do navigation
   */
  clearSearch() {
    this.searchForm.get("searchTerm")?.setValue("");
    this.doNavigation();
  }

  /**
   * Navigate to the route
   */
  doNavigation() {
    // Get form data
    const term = this.searchForm.get("searchTerm")?.value.trim();
    const option = this.searchForm.get("searchOption")?.value;

    // Current pagination data
    const pagination = this.data;

    // Build url parameters
    const urlParameters: any = {
      page: pagination.page,
      sort: pagination.sort,
      items: pagination.itemsPerPage
    };

    /* // Uncomment to add more filters //
    // Map current filters
    pagination.filter.map((filter: {}) => {
      // Get option and term
      const [key, value] = Object.entries(filter)[0];
      // Set filter
      urlParameters[key as any] = value;
    });
    */

    // Add new filter
    if (term != "") {
      this.searchForm.get("searchTerm")?.setValue(term);
      urlParameters[option] = term;
    } else {
      delete urlParameters[option];
    }

    //Redirect
    this.router.navigate([pagination.baseUrl], { queryParams: urlParameters });
  }
}
