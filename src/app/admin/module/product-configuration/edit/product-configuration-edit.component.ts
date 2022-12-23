import { Component, OnInit } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormType,
  ProductCategory,
  SelectOption,
} from "src/app/admin/model/product-configuration.model";
import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";
import { ProductConfigurationService } from "src/app/admin/service/product-configuration/product-configuration.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-product-configuration-edit",
  templateUrl: "./product-configuration-edit.component.html",
  styleUrls: ["./product-configuration-edit.component.scss"],
})
export class ProductConfigurationEditComponent implements OnInit {
  public currentForm: FormType = "";
  public submitDisabled: boolean = false;
  public statusOptions: SelectOption[] = [
    { value: "Active", key: 1 },
    { value: "Inactive", key: 2 },
  ];
  public inputFieldOptions: SelectOption[] = [
    { key: "input", value: "Input" },
    { key: "select", value: "Select" },
    { key: "checkbox", value: "Checkbox" },
    { key: "radio", value: "Radio Button" },
  ];
  public productCategory: ProductCategory = {
    id: 0,
    status: 0,
    name: "",
    options: [],
  };
  public categoryForm = this.fb.group({
    status: [1, [Validators.required]],
    name: ["", [Validators.required, Validators.minLength(6)]],
    options: this.fb.array([]),
  });
  public validateForm: boolean = false;

  constructor(
    private activatedRouter: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private productConfigurationService: ProductConfigurationService,
    private toastService: ToastService,
    private router: Router,
    private fb: UntypedFormBuilder
  ) {}

  // Getters
  get status(): any {
    return this.categoryForm.get("status");
  }
  get name(): any {
    return this.categoryForm.get("name");
  }
  get options(): any {
    return this.categoryForm.get("options") as UntypedFormArray;
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

    let categoryData: any = {};
    // Status
    if (this.status.value != this.productCategory.status) {
      categoryData.status = this.status.value;
    }
    // Name
    if (this.name.value != this.productCategory.name) {
      categoryData.name = this.name.value;
    }
    // Options
    if (this.options.value.length) {
      categoryData.options = this.options.value;
    }

    // Validate if there area information to save
    if (Object.keys(categoryData).length > 0) {
      // Save new information
      if (this.currentForm === "edit") {
        // Update changed information
        this.updateProductCategory(categoryData);
      } else if (this.currentForm === "new") {
        // Save new category
        this.createProductCategory(categoryData);
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
    this.productConfigurationService.getProductCategory(categoryId).subscribe({
      next: (data: any) => {
        // Load data in category
        this.productCategory = data;
        // Load form data
        this.status.setValue(data.status);
        this.name.setValue(data.name);

        this.loadOptionsForm();
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
  updateProductCategory(categoryInformation: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.productConfigurationService
      .updateProductCategory(this.productCategory.id, categoryInformation)
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
  createProductCategory(categoryInformation: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.productConfigurationService
      .createProductCategory(categoryInformation)
      .subscribe({
        next: (response: any) => {
          // Show succes message
          this.toastService.success(response.message);
          // Go to the list
          setTimeout(() => {
            this.router.navigateByUrl(
              `/admin/product-configuration/edit/${response.id}`
            );
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
   * Create and set the options form data
   */
  loadOptionsForm() {
    if (!this.productCategory.options) return;

    this.productCategory.options.forEach((option: any) =>
      this.addOption(this.newOption(option))
    );
  }

  /**
   * Set default values to the field type selected
   *
   * @param optionIndex Number Option index
   * @param fieldIndex Number  Field index
   */
  handleFieldChange(optionIndex: number, fieldIndex: number) {
    // Validate field type
    const fieldType = this.getField(optionIndex, fieldIndex, "type").value;
    if (fieldType != "input") {
      this.addValue(optionIndex, fieldIndex);
    } else {
      // Remove all values
      this.getValues(optionIndex, fieldIndex).clear();
    }
  }

  /** FORM GETTERS **/
  getOption(optionIndex: number, key: string) {
    return this.options.at(optionIndex).get(key);
  }
  getFields(optionIndex: number): any {
    return this.options.at(optionIndex).get("fields") as UntypedFormArray;
  }
  getField(optionIndex: number, fieldIndex: number, key: string) {
    return this.getFields(optionIndex).at(fieldIndex).get(key);
  }
  getValues(optionIndex: number, fieldIndex: number): any {
    return this.options
      .at(optionIndex)
      .get("fields")
      .at(fieldIndex)
      .get("values") as UntypedFormArray;
  }
  getValue(
    optionIndex: number,
    fieldIndex: number,
    valueIndex: number,
    key: string
  ) {
    return this.getValues(optionIndex, fieldIndex).at(valueIndex).get(key);
  }

  /** FORM CREATION **/

  /**
   * Create a new option with default data
   *
   * @param optionData Object with default data
   * @returns FormGroup with the new option
   */
  newOption(optionData: any = {}) {
    const id = optionData.id ? optionData.id : 0; // Default option id is 0
    const name = optionData.name ? optionData.name : "";
    const status = optionData.status ? optionData.status : 1;
    const description = optionData.description ? optionData.description : "";
    const required = optionData.required ? optionData.required : 0;
    const fields = optionData.options
      ? JSON.parse(optionData.options).map((f: any) => this.newField(f))
      : [this.newField()];
    const action = optionData.id ? "update" : "create";

    return this.fb.group({
      id: [id],
      name: [name, [Validators.required, Validators.minLength(4)]],
      status: [status, [Validators.required, Validators.min(1)]],
      description: [description],
      required: [required],
      fields: this.fb.array(fields),
      action: [action],
    });
  }

  /**
   * Create a new field with default data
   *
   * @param fieldData Objet with default data
   * @returns FormGroup with the new field
   */
  newField(fieldData: any = {}) {
    // Default values
    const uid = fieldData.uid ? fieldData.uid : this.getRandomId();
    const type = fieldData.type ? fieldData.type : "input";
    const values = fieldData.values
      ? fieldData.values.map((v: any) => this.newValue(v))
      : [];
    const action = fieldData.uid ? "update" : "create";

    // Return form group
    return this.fb.group({
      uid: [uid],
      type: [type, [Validators.required]],
      values: this.fb.array(values),
      action: [action],
    });
  }

  /**
   * Create a new value with default data
   *
   * @param valueData Objet with default data
   * @returns FormGroup with the new value
   */
  newValue(valueData: any = {}) {
    // Default values
    const uid = valueData.uid ? valueData.uid : this.getRandomId();
    const value = valueData.value ? valueData.value : "";
    const action = valueData.uid ? "update" : "create";

    // Return form group
    return this.fb.group({
      uid: [uid],
      value: [value, [Validators.required, Validators.minLength(2)]],
      action: [action],
    });
  }

  /** FORM ADDITION **/
  addOption(option: any = null) {
    const newOption = option ? option : this.newOption();
    this.options.push(newOption);
  }
  addField(optionIndex: number) {
    this.getFields(optionIndex).push(this.newField());
  }
  addValue(optionIndex: number, fieldIndex: number) {
    this.getValues(optionIndex, fieldIndex).push(this.newValue());
  }

  /** FORM DELETION **/

  /**
   * Remove the option from the form, if the option exists it will show a
   * confirmation message, then it removes the option from database.
   *
   * @param optionIndex Number option index
   */
  removeOption(optionIndex: number) {
    const optionId = this.getOption(optionIndex, "id").value;
    const action = this.getOption(optionIndex, "action").value;

    if (optionId && action == "update") {
      // Create information to save
      const newOptionsDb = this.productCategory.options.map(
        (o: any, i: any) => ({
          id: o.id,
          name: o.name,
          status: o.status,
          fields: JSON.parse(o.options),
          action: i == optionIndex ? "delete" : "update",
        })
      );

      // Launch confirmation modal
      this.confirmDialogService
        .confirm(
          "Delete option",
          `Are you sure you want to delete the option <span class="text-primary">"${
            this.getOption(optionIndex, "name").value
          }"</span>?`,
          { text: "Delete" },
          { text: "Cancel" }
        )
        .then((confirmed) => {
          if (confirmed) {
            this.getOption(optionIndex, "action").setValue("delete");
            this.updateProductCategory({ options: newOptionsDb });
            this.options.removeAt(optionIndex);
          }
        });
    } else {
      this.options.removeAt(optionIndex);
    }
  }

  /**
   * Remove the field from the form, if the field exists it will show a
   * confirmation message, then it removes the field from database.
   *
   * @param optionIndex Number option index
   * @param fieldIndex Number field index
   */
  removeField(optionIndex: number, fieldIndex: number) {
    const optionId = this.getOption(optionIndex, "id").value;
    const action = this.getField(optionIndex, fieldIndex, "action").value;

    if (optionId && action == "update") {
      // Get fields arary
      const fieldsArray = JSON.parse(
        this.productCategory.options[optionIndex].options
      );
      // Remove field and get new fields array as string
      const newFields = JSON.stringify(
        fieldsArray.filter((e: any, i: any) => i != fieldIndex)
      );
      // Get current db fields and replace fields
      const newOptions = this.productCategory.options.map((o: any, i: any) =>
        i == optionIndex ? { ...o, options: newFields } : o
      );

      // Create information to save
      const newOptionsDb = newOptions.map((o) => ({
        id: o.id,
        name: o.name,
        status: o.status,
        fields: JSON.parse(o.options),
        action: "update",
      }));

      // Launch confirmation modal
      this.confirmDialogService
        .confirm(
          "Delete option",
          `Are you sure you want to delete the field?`,
          { text: "Delete" },
          { text: "Cancel" }
        )
        .then((confirmed) => {
          if (confirmed) {
            this.getFields(optionIndex).removeAt(fieldIndex);
            this.updateProductCategory({ options: newOptionsDb });
          }
        });
    } else {
      this.getFields(optionIndex).removeAt(fieldIndex);
    }
  }

  /**
   * Remove the value from the form, if the value exists it will show a
   * confirmation message, then it removes the value from database.
   *
   * @param optionIndex Number option index
   * @param fieldIndex Number field index
   * @param valueIndex Number value index
   */
  removeValue(optionIndex: number, fieldIndex: number, valueIndex: number) {
    const optionId = this.getOption(optionIndex, "id").value;
    const action = this.getValue(
      optionIndex,
      fieldIndex,
      valueIndex,
      "action"
    ).value;

    if (optionId && action == "update") {
      // Get fields arary
      const fieldsArray = JSON.parse(
        this.productCategory.options[optionIndex].options
      );
      // Remove value
      const newValues = fieldsArray[fieldIndex].values.filter(
        (e: any, i: any) => i != valueIndex
      );
      // Get new fields with modified values
      const newFields = JSON.stringify(
        fieldsArray.map((f: any, i: any) =>
          i == fieldIndex ? { ...f, values: newValues } : f
        )
      );
      // Get current db fields and replace fields
      const newOptions = this.productCategory.options.map((o: any, i: any) =>
        i == optionIndex ? { ...o, options: newFields } : o
      );

      // Create information to save
      const newOptionsDb = newOptions.map((o) => ({
        id: o.id,
        name: o.name,
        status: o.status,
        fields: JSON.parse(o.options),
        action: "update",
      }));

      // Launch confirmation modal
      this.confirmDialogService
        .confirm(
          "Delete option",
          `Are you sure you want to delete the value?`,
          { text: "Delete" },
          { text: "Cancel" }
        )
        .then((confirmed) => {
          if (confirmed) {
            this.getValues(optionIndex, fieldIndex).removeAt(valueIndex);
            this.updateProductCategory({ options: newOptionsDb });
          }
        });
    } else {
      this.getValues(optionIndex, fieldIndex).removeAt(valueIndex);
    }
  }

  /**
   * Generate a new unique id with 12 characters length
   * @returns unique id
   */
  getRandomId() {
    return Math.random().toString(16).slice(2, 14); // 12 chars hex number
  }
}
