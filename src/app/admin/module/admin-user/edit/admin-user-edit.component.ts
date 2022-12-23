import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AdminUser,
  FormType,
  StatusOption
} from "src/app/admin/model/admin-user-list.model";
import { AdminUserService } from "src/app/admin/service/admin-user/admin-user.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-admin-user-edit",
  templateUrl: "./admin-user-edit.component.html",
  styleUrls: ["./admin-user-edit.component.scss"]
})
export class AdminUserEditComponent implements OnInit {
  // Public
  public currentForm: FormType = "";
  public showPassword: boolean = false;
  public submitDisabled: boolean = false;
  public statusOptions: StatusOption[] = [
    { value: "Active", key: 1 },
    { value: "Inactive", key: 2 }
  ];
  public adminUser: AdminUser = {
    admuse_id: 0,
    admuse_status: 0,
    admuse_user: "",
    admuse_password: "",
    admuse_name: "",
    admuse_email: ""
  };
  // Define formGroup
  public adminUserForm = this.fb.group({
    status: [2, [Validators.required, Validators.min(1)]],
    user: ["", [Validators.required, Validators.minLength(4)]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    name: ["", [Validators.required, Validators.minLength(6)]],
    email: ["", [Validators.required, Validators.email]]
  });
  public validateForm: boolean = false;

  // Getters
  get status(): any {
    return this.adminUserForm.get("status");
  }
  get user(): any {
    return this.adminUserForm.get("user");
  }
  get password(): any {
    return this.adminUserForm.get("password");
  }
  get name(): any {
    return this.adminUserForm.get("name");
  }
  get email(): any {
    return this.adminUserForm.get("email");
  }

  constructor(
    private activatedRouter: ActivatedRoute,
    private adminUserService: AdminUserService,
    private fb: UntypedFormBuilder,
    private location: Location,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get path parameter
    this.activatedRouter.params.subscribe((params) => {
      if (params.id) {
        // Define form type
        this.currentForm = "edit";
        // Remove password required validation
        this.password.removeValidators(Validators.required);
        // Get admin user data
        this.getAdminInformation(params.id);
      } else {
        // Define form type
        this.currentForm = "new";
      }
    });
  }

  /**
   * Get admin user information from database
   *
   * @param adminId Identification number
   */
  getAdminInformation(adminId: number) {
    this.adminUserService.getAdminUser(adminId).subscribe({
      next: (data: any) => {
        // Load data in adminUser
        this.adminUser = data;
        // Load form data
        this.status.setValue(data.admuse_status);
        this.user.setValue(data.admuse_user);
        // this.password.setValue(data.admuse_password);
        this.name.setValue(data.admuse_name);
        this.email.setValue(data.admuse_email);
      },
      error: (response) => {
        this.toastService.error(response.error.message);
      }
    });
  }

  /**
   * When user submits form
   * @returns void
   */
  onSubmit() {
    this.validateForm = true;

    if (this.adminUserForm.invalid) return;

    let adminData: any = {};
    // Status
    if (this.status.value != this.adminUser.admuse_status) {
      adminData.status = this.status.value;
    }
    // User
    if (this.user.value != this.adminUser.admuse_user) {
      adminData.user = this.user.value;
    }
    // Password
    if (
      this.password.value != "" &&
      this.password.value != this.adminUser.admuse_password
    ) {
      adminData.password = this.password.value;
    }
    // Name
    if (this.name.value != this.adminUser.admuse_name) {
      adminData.name = this.name.value;
    }
    // Email
    if (this.email.value != this.adminUser.admuse_email) {
      adminData.email = this.email.value;
    }

    // Validate if there area information to save
    if (Object.keys(adminData).length > 0) {
      // Save new information
      if (this.currentForm === "edit") {
        // Update changed information
        this.updateAdminUser(adminData);
      } else if (this.currentForm === "new") {
        // Save new admin user
        this.createAdminUser(adminData);
      }
    } else {
      console.log("nothing to save");
    }
  }

  /**
   * Update the admin user information
   *
   * @param modifiedAdmin Object with information
   */
  updateAdminUser(modifiedAdmin: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.adminUserService
      .updateAdminUser(this.adminUser.admuse_id, modifiedAdmin)
      .subscribe({
        next: (response: any) => {
          // Show succes message
          this.toastService.success(response.message);
          // Go to the list
          setTimeout(() => {
            this.location.back();
          }, 1000);
        },
        error: (error) => {
          // Enable submit button
          this.submitDisabled = false;
          // Show error message
          this.toastService.error(error.error.message);
          // Do nothing
        }
      });
  }

  /**
   * Create new admin user
   *
   * @param newAdmin Object with new information
   */
  createAdminUser(newAdmin: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.adminUserService.createAdminUser(newAdmin).subscribe({
      next: (response: any) => {
        // Show succes message
        this.toastService.success(response.message);
        // Go to the list
        setTimeout(() => {
          this.location.back();
        }, 1000);
      },
      error: (error) => {
        // Enable submit button
        this.submitDisabled = false;
        // Show error message
        this.toastService.error(error.error.message);
        // Do nothing
      }
    });
  }
}
