import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

//Interfaces
import {
  UserStatus,
  SiteUserList,
  UrlParameters,
} from "../../../model/site-user-list.model";

//Services
import { SiteUserService } from "src/app/admin/service/site-user/site-user.service";
import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-site-user-list",
  templateUrl: "./site-user-list.component.html",
  styleUrls: [
    "./site-user-list.component.scss",
    "../../../shared/template/template.component.scss",
  ],
})
export class SiteUserListComponent implements OnInit {
  pageTitle: string = "Manage site users";
  moduleUrl = "site-user";
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
  searchOptions: any = [
    { key: "user", value: "User" },
    { key: "email", value: "Email" },
  ];

  dataList: Array<SiteUserList> = [];

  constructor(
    private activatedRouter: ActivatedRoute,
    private siteUserService: SiteUserService,
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
      this.getSiteUserList();
    });
  }

  /**
   * Get site user list
   */
  getSiteUserList(): void {
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
    this.siteUserService.getSiteUserList(parameters).subscribe({
      next: (data) => {
        // Map list and change the status text
        this.dataList = data.list
          .filter((u: any) => u.status != 3) // Filter not deleted users
          .map((user: any) => ({
            ...user,
            statusText: UserStatus[user.status],
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
   * @param item Site user object
   */
  confirmDelete(item: any): void {
    // Launch confirmation modal
    this.confirmDialogService
      .confirm(
        "Delete user",
        `Are you sure you want to delete the user <span class="text-primary">"${item.user}"</span>?`,
        { text: "Delete" },
        { text: "Cancel" }
      )
      .then((confirmed) => {
        if (confirmed) {
          // Delete user
          this.siteUserService.deleteSiteUser(item.id).subscribe({
            next: (response: any) => {
              // Show succes message
              this.toastService.success(response.message);
              // Get list again
              this.getSiteUserList();
            },
            error: (error) => {
              // Show error message
              this.toastService.error(error.error.message);
              // Get list again
              this.getSiteUserList();
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
