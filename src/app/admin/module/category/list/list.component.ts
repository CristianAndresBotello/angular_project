import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

import {
  CategoryList,
  CategoryStatus,
  UrlParameters,
} from "src/app/admin/model/category.model";
import { CategoryService } from "src/app/admin/service/category/category.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: [
    "./list.component.scss",
    "../../../shared/template/template.component.scss",
  ],
})
export class ListComponent implements OnInit {
  pageTitle: string = "Manage Categories";
  moduleUrl = "categories";
  actionNewLink: string = "";
  actionEditLink: string = "";
  paginationInfo: any = {
    baseUrl: "/admin/" + this.moduleUrl,
    total: 100,
    page: 1,
    itemsPerPage: 32,
    sort: "desc",
    filter: [],
  };
  searchOptions: any = [{ key: "name", value: "Name" }];

  dataList: Array<CategoryList> = [];

  constructor(
    private activatedRouter: ActivatedRoute,
    private categoryService: CategoryService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    //Set actions URL
    this.actionNewLink = "new";
    this.actionEditLink = "edit";

    //Get query params
    this.activatedRouter.queryParams.subscribe((params) => {
      if (params.page !== undefined) {
        this.paginationInfo = {
          ...this.paginationInfo,
          page: parseInt(params.page),
        };
      }
      if (params.sort !== undefined) {
        this.paginationInfo = { ...this.paginationInfo, sort: params.sort };
      }

      if (params.items !== undefined) {
        this.paginationInfo = {
          ...this.paginationInfo,
          itemsPerPage: parseInt(params.items),
        };
      }

      this.paginationInfo.filter = [];
      if (params.name !== undefined) {
        this.paginationInfo.filter.push({ name: params.name });
      }

      //Get data list
      this.getCategoryList();
    });
  }

  /**
   * Get category list
   */
  getCategoryList(): void {
    const requiredFields = [
      "id",
      "status",
      "name",
      "title",
      "created_at",
      "updated_at",
    ];

    // Load parameters to get information
    const parameters: UrlParameters = {
      page: this.paginationInfo.page,
      limit: this.paginationInfo.itemsPerPage,
      order: JSON.stringify({ field: "id", type: this.paginationInfo.sort }),
      fields: JSON.stringify(requiredFields),
      filter: JSON.stringify(this.paginationInfo.filter),
    };

    //Get API response
    this.categoryService.getCategoryList(parameters).subscribe({
      next: (data) => {
        // Map list and change the status text
        this.dataList = data.list
          .filter((u: any) => u.status != 3) // Filter not deleted categories
          .map((category: any) => ({
            ...category,
            statusText: CategoryStatus[category.status],
          }));
        // Update the total inside paginationInfo
        this.paginationInfo = { ...this.paginationInfo, total: data.total };
      },
      error: (error) => {
        console.log({ error });
        this.toastService.error(error.error.message);
      },
    });
  }

  /**
   * Show confirmation dialog before delete
   *
   * @param item product category object
   */
  confirmDelete(item: any): void {
    // Launch confirmation modal
    this.confirmDialogService
      .confirm(
        "Delete category",
        `Are you sure you want to delete the category <span class="text-primary">"${item.name}"</span>?`,
        { text: "Delete" },
        { text: "Cancel" }
      )
      .then((confirmed) => {
        if (confirmed) {
          // Delete category
          this.categoryService.deleteCategory(item.id).subscribe({
            next: (response: any) => {
              // Show succes message
              this.toastService.success(response.message);
              // Get list again
              this.getCategoryList();
            },
            error: (error) => {
              // Show error message
              this.toastService.error(error.error.message);
              // Get list again
              this.getCategoryList();
            },
          });
        } else {
          // console.log("User cancel the dialog");
        }
      })
      .catch(() => {
        // console.log("User dismissed the dialog");
      });
  }
}
