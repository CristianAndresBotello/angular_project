import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

//Interfaces
import {
  AdminStatus,
  AdminUserList,
  UrlParameters,
} from "../../../model/admin-user-list.model";

//Services
import { AdminUserService } from "src/app/admin/service/admin-user/admin-user.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";
import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";

@Component({
  selector: "app-admin-user",
  templateUrl: "./admin-user-list.component.html",
  styleUrls: [
    "../../../shared/template/template.component.scss",
    "./admin-user-list.component.scss",
  ],
})
export class AdminUserListComponent implements OnInit {
  pageTitle: string = "Manage admin users";
  moduleUrl = "admin-user";
  actionNewLink: string = "";
  actionEditLink: string = "";
  actionDeleteLink: string = "";
  paginationInfo: any = {
    baseUrl: "/admin/" + this.moduleUrl,
    total: 100,
    page: 1,
    itemsPerPage: 32,
    sort: "desc",
    filter: [],
  };
  searchOptions: any = [
    { key: "user", value: "User" },
    { key: "email", value: "Email" },
  ];

  dataList: Array<AdminUserList> = [];

  constructor(
    private activatedRouter: ActivatedRoute,
    private adminUserService: AdminUserService,
    private titleService: Title,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    //Set page title
    this.titleService.setTitle(this.pageTitle + " | Zeerba");
  }

  ngOnInit(): void {
    //Set actions URL
    this.actionNewLink = "new";
    this.actionEditLink = "edit";
    this.actionDeleteLink = this.moduleUrl + "-delete";

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
      if (params.user !== undefined) {
        this.paginationInfo.filter.push({ user: params.user });
      }

      if (params.email !== undefined) {
        this.paginationInfo.filter.push({ email: params.email });
      }

      //Get data list
      this.getAdminUserList();
    });
  }

  /**
   * Get admin user list
   */
  getAdminUserList(): void {
    const requiredFields = [
      "id",
      "status",
      "user",
      "name",
      "email",
      "photo",
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
    this.adminUserService.getAdminUserList(parameters).subscribe({
      next: (data) => {
        // Map list and change the status text
        this.dataList = data.list
          .filter((a: any) => a.admuse_status != 3) // Filter not deleted users
          .map((admin: any) => ({
            ...admin,
            statusText: AdminStatus[admin.admuse_status],
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
   * @param item Admin user object
   */
  confirmDelete(item: any): void {
    // Launch confirmation modal
    this.confirmDialogService
      .confirm(
        "Delete admin user",
        `Are you sure you want to delete the user <span class="text-primary">"${item.admuse_user}"</span>?`,
        { text: "Delete" },
        { text: "Cancel" }
      )
      .then((confirmed) => {
        if (confirmed) {
          // Delete user
          this.adminUserService.deleteAdminUser(item.admuse_id).subscribe({
            next: (response: any) => {
              // Show succes message
              this.toastService.success(response.message);
              // Get list again
              this.getAdminUserList();
            },
            error: (error) => {
              // Show error message
              this.toastService.error(error.error.message);
              // Get list again
              this.getAdminUserList();
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
