import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import {
  CategoryStatus,
  ProductCategory,
  ProductCategoryList,
  UrlParameters,
} from "src/app/admin/model/product-configuration.model";
import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";
import { ProductConfigurationService } from "src/app/admin/service/product-configuration/product-configuration.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-product-configuration-list",
  templateUrl: "./product-configuration-list.component.html",
  styleUrls: [
    "./product-configuration-list.component.scss",
    "../../../shared/template/template.component.scss",
  ],
})
export class ProductConfigurationListComponent implements OnInit {
  pageTitle: string = "Manage Product Category";
  moduleUrl = "product-configuration";
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

  dataList: Array<ProductCategoryList> = [];

  constructor(
    private activatedRouter: ActivatedRoute,
    private productConfigurationService: ProductConfigurationService,
    private titleService: Title,
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
      this.getProductCategoryList();
    });
  }

  /**
   * Get product category list
   */
  getProductCategoryList(): void {
    const requiredFields = ["id", "status", "name", "created_at", "updated_at"];

    // Load parameters to get information
    const parameters: UrlParameters = {
      page: this.paginationInfo.page,
      limit: this.paginationInfo.itemsPerPage,
      order: JSON.stringify({ field: "id", type: this.paginationInfo.sort }),
      fields: JSON.stringify(requiredFields),
      filter: JSON.stringify(this.paginationInfo.filter),
    };

    //Get API response
    this.productConfigurationService
      .getProductCategoryList(parameters)
      .subscribe({
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
          this.productConfigurationService
            .deleteProductCategory(item.id)
            .subscribe({
              next: (response: any) => {
                // Show succes message
                this.toastService.success(response.message);
                // Get list again
                this.getProductCategoryList();
              },
              error: (error) => {
                // Show error message
                this.toastService.error(error.error.message);
                // Get list again
                this.getProductCategoryList();
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
