import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FormType, SelectOption } from "src/app/admin/model/category.model";
import { CategoryService } from "src/app/admin/service/category/category.service";

import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";
import { ProductConfigurationService } from "src/app/admin/service/product-configuration/product-configuration.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit {
  public submitDisabled: boolean = false;
  public statusOptions: SelectOption[] = [
    { value: "Active", key: 1 },
    { value: "Inactive", key: 2 },
  ];

  // Form
  public currentForm: FormType = "";
  public validateForm: boolean = false;
  public categoryForm = this.fb.group({
    id: 0,
    status: ["", [Validators.required]],
    name: ["", [Validators.required, Validators.minLength(6)]],
    sort: ["", [Validators.required, Validators.min(1)]],
    title: ["", [Validators.required, Validators.minLength(6)]],
    description: ["", [Validators.required]],
  });

  constructor(
    private activatedRouter: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private categoryService: CategoryService,
    private toastService: ToastService,
    private router: Router,
    private fb: UntypedFormBuilder
  ) {}

  // Getters
  get id(): any {
    return this.categoryForm.get("id");
  }
  get status(): any {
    return this.categoryForm.get("status");
  }
  get name(): any {
    return this.categoryForm.get("name");
  }
  get sort(): any {
    return this.categoryForm.get("sort");
  }
  get title(): any {
    return this.categoryForm.get("title");
  }
  get description(): any {
    return this.categoryForm.get("description");
  }

  ngOnInit(): void {
    // Get path parameter
    this.activatedRouter.params.subscribe((params) => {
      if (params.id) {
        // Define form type
        this.currentForm = "edit";
        // Get category data
        this.getCategoryInformation(params.id);
      } else {
        // Define form type
        this.currentForm = "new";
      }
    });
  }

  /**
   * When user submits form
   * @returns void
   */
  onSubmit() {
    this.validateForm = true;

    if (this.categoryForm.invalid) return;

    const categoryData: any = {};
    if (this.status.dirty) categoryData.status = this.status.value;
    if (this.name.dirty) categoryData.name = this.name.value;
    if (this.sort.dirty) categoryData.sort = this.sort.value;
    if (this.title.dirty) categoryData.title = this.title.value;
    if (this.description.dirty)
      categoryData.description = this.description.value;

    // Validate if there area information to save
    if (Object.keys(categoryData).length > 0) {
      // Save new information
      if (this.currentForm === "edit") {
        // Update changed information
        this.updateCategory(categoryData);
      } else if (this.currentForm === "new") {
        // Save new category
        this.createCategory(categoryData);
      }
    } else {
      console.log("nothing to save");
    }
  }

  /**
   * Get category information from database
   *
   * @param categoryId Identification number
   */
  getCategoryInformation(categoryId: number) {
    this.categoryService.getCategory(categoryId).subscribe({
      next: (data: any) => {
        this.categoryForm.patchValue(data);
      },
      error: (response) => {
        this.toastService.error(response.error.message);
      },
    });
  }

  /**
   * Update the category information
   *
   * @param modifiedAdmin Object with information
   */
  updateCategory(categoryInformation: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.categoryService
      .updateCategory(this.id.value, categoryInformation)
      .subscribe({
        next: (response: any) => {
          // Show succes message
          this.toastService.success(response.message);

          // Reload current url
          setTimeout(() => {
            let currentUrl = this.router.url;
            this.router
              .navigateByUrl("/", { skipLocationChange: true })
              .then(() => {
                this.router.navigate([currentUrl]);
              });
          }, 1000);
        },
        error: (error) => {
          // Enable submit button
          this.submitDisabled = false;
          // Show error message
          this.toastService.error(error.error.message);
          // Do nothing
        },
      });
  }

  /**
   * Create new category
   *
   * @param categoryInformation Object with new information
   */
  createCategory(categoryInformation: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.categoryService.createCategory(categoryInformation).subscribe({
      next: (response: any) => {
        // Show succes message
        this.toastService.success(response.message);
        // Go to the list
        setTimeout(() => {
          this.router.navigateByUrl(`/admin/categories/edit/${response.id}`);
        }, 1000);
      },
      error: (error) => {
        // Enable submit button
        this.submitDisabled = false;
        // Show error message
        this.toastService.error(error.error.message);
        // Do nothing
      },
    });
  }
}
