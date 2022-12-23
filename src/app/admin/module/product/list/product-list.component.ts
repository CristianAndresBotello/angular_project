import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import {
  ProductList,
  ProductStatus,
  UrlParameters,
} from "src/app/admin/model/product.model";

// Services
import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";
import { ProductService } from "src/app/admin/service/product/product.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: [
    "./product-list.component.scss",
    "../../../shared/template/template.component.scss",
  ],
})
export class ProductListComponent implements OnInit {
  pageTitle: string = "Manage Product";
  moduleUrl = "product";
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

  dataList: Array<ProductList> = [];

  constructor(
    private activatedRouter: ActivatedRoute,
    private productService: ProductService,
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
      this.getProductList();
    });
  }

  /**
   * Get product list
   */
  getProductList(): void {
    const requiredFields = [
      "id",
      "status",
      "name",
      "price",
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
    this.productService.getProductList(parameters).subscribe({
      next: (data) => {
        // Map list and change the status text
        this.dataList = data.list
          .filter((u: any) => u.status != 3) // Filter not deleted categories
          .map((product: any) => ({
            ...product,
            statusText: ProductStatus[product.status],
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
   * @param item product object
   */
  confirmDelete(item: any): void {
    // Launch confirmation modal
    this.confirmDialogService
      .confirm(
        "Delete product",
        `Are you sure you want to delete the product <span class="text-primary">"${item.name}"</span>?`,
        { text: "Delete" },
        { text: "Cancel" }
      )
      .then((confirmed) => {
        if (confirmed) {
          // Delete product
          this.productService.deleteProduct(item.id).subscribe({
            next: (response: any) => {
              // Show succes message
              this.toastService.success(response.message);
              // Get list again
              this.getProductList();
            },
            error: (error) => {
              // Show error message
              this.toastService.error(error.error.message);
              // Get list again
              this.getProductList();
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
