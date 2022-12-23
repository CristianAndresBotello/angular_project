import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import {
  CdkDragEnter,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from "rxjs";
import {
  FormType,
  Product,
  ProductImage,
  SelectOption,
  Tag,
  UrlParameters,
} from "src/app/admin/model/product.model";
import { CategoryService } from "src/app/admin/service/category/category.service";
import { ConfirmDialogService } from "src/app/admin/service/confirm-dialog/confirm-dialog.service";
import { ProductConfigurationService } from "src/app/admin/service/product-configuration/product-configuration.service";
import { ProductService } from "src/app/admin/service/product/product.service";
import { SiteUserService } from "src/app/admin/service/site-user/site-user.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-product-edit",
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.scss"],
})
export class ProductEditComponent implements OnInit {
  // Public properties
  public product: Product = {
    id: 0,
    status: 0,
    name: "",
    description: "",
    price: 0.0,
    images: [],
    url: "",
    tags: "",
    user: { id: 0 },
    category: { id: 0 },
    productCategory: { id: 0 },
    productCategoryOptions: [],
    productCategoryOptionsValue: {},
  };
  public productTags: Tag[] = [];
  public invalidTag: Boolean = false;
  public productImages: ProductImage[] = [];

  // Form
  public currentForm: FormType = "";
  public submitDisabled: boolean = false;
  public validateForm: boolean = false;
  public statusOptions: SelectOption[] = [
    { value: "Active", key: 1 },
    { value: "Inactive", key: 2 },
  ];
  public productForm = this.fb.group({
    status: [1, [Validators.required]],
    name: ["", [Validators.required, Validators.minLength(6)]],
    description: [""],
    price: [0.0, [Validators.pattern("^[0-9]\\d*(\\.\\d{1,2})?$")]],
    images: [[]],
    tags: ["", [Validators.pattern("[A-Za-z0-9!@#$]+")]],
    user: [null, [Validators.required]],
    category: [null, [Validators.required]],
    productCategory: [null, [Validators.required]],
    productCategoryOptions: this.fb.group({}),
  });

  constructor(
    private activatedRouter: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private productService: ProductService,
    private siteUserService: SiteUserService,
    private categoryService: CategoryService,
    private productConfigurationService: ProductConfigurationService,
    private toastService: ToastService,
    private router: Router,
    private fb: UntypedFormBuilder
  ) {}

  // Getters
  get status(): any {
    return this.productForm.get("status");
  }
  get name(): any {
    return this.productForm.get("name");
  }
  get description(): any {
    return this.productForm.get("description");
  }
  get price(): any {
    return this.productForm.get("price");
  }
  get images(): any {
    return this.productForm.get("images");
  }
  get tags(): any {
    return this.productForm.get("tags");
  }
  get user(): any {
    return this.productForm.get("user");
  }
  get category(): any {
    return this.productForm.get("category");
  }
  get productCategory(): any {
    return this.productForm.get("productCategory");
  }
  get productCategoryOptions(): any {
    return this.productForm.get("productCategoryOptions");
  }

  ngOnInit(): void {
    // Get path parameter
    this.activatedRouter.params.subscribe((params) => {
      if (params.id) {
        // Define form type
        this.currentForm = "edit";
        // Get product data
        this.getProductInformation(params.id);
      } else {
        // Define form type
        this.currentForm = "new";
      }
    });
  }

  /**
   * Handle form submit
   * @returns void
   */
  onSubmit() {
    // Reset tags
    this.tags.setValue("");

    this.validateForm = true;

    if (this.productForm.invalid) return;

    // Get information to send
    let productInformation: any = {};
    if (this.status.value != this.product.status) {
      productInformation.status = this.status.value;
    }
    if (this.name.value != this.product.name) {
      productInformation.name = this.name.value;
    }
    if (this.description.value != this.product.description) {
      productInformation.description = this.description.value;
    }
    if (JSON.stringify(this.productTags) != JSON.stringify(this.product.tags)) {
      productInformation.tags = this.productTags;
    }
    if (this.price.value != this.product.price) {
      productInformation.price = this.price.value;
    }
    if (this.user.value.id != this.product.user.id) {
      productInformation.user = this.user.value.id;
    }
    if (this.category.value.id != this.product.category.id) {
      productInformation.category = this.category.value.id;
    }
    if (this.productCategory.value.id != this.product.productCategory.id) {
      productInformation.productCategory = this.productCategory.value.id;
    }
    // Get current images to compare
    const currentImages = this.images.value.map((img: any) => {
      const image = { ...img };
      if (image.action == "create") {
        delete image.src;
      }
      return image;
    });
    if (JSON.stringify(currentImages) != JSON.stringify(this.product.images)) {
      productInformation.images = currentImages;
    }

    // Product category options
    if (this.productCategoryOptions.dirty) {
      productInformation.productCategoryOptionsValue =
        this.productCategoryOptions.value;
    }

    // Validate if there area information to save
    if (Object.keys(productInformation).length > 0) {
      // Save new information
      if (this.currentForm === "edit") {
        // Update changed information
        this.updateProduct(productInformation);
      } else if (this.currentForm === "new") {
        // Save new product
        this.createProduct(productInformation);
      }
    } else {
      console.log("nothing to save");
    }
  }

  /**
   * Update product with new information
   * @param productInformation Object with the modified product information
   */
  updateProduct(productInformation: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.productService
      .updateProduct(this.product.id, productInformation)
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
   * Create a product with the information
   * @param productInformation Object with new product information
   */
  createProduct(productInformation: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.productService.createProduct(productInformation).subscribe({
      next: (response: any) => {
        // Show succes message
        this.toastService.success(response.message);
        // Go to edit
        setTimeout(() => {
          this.router.navigateByUrl(`/admin/product/edit/${response.id}`);
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
   * Get product information from database
   * @param productId Identification number
   */
  public categoryOptions: any = [];
  getProductInformation(productId: number) {
    this.productService.getProduct(productId).subscribe({
      next: (data: any) => {
        // Load data in product
        this.product = { ...data };

        // Load form data
        this.status.setValue(data.status);
        this.name.setValue(data.name);
        this.description.setValue(data.description);
        this.price.setValue(data.price);
        this.productTags = [...data.tags];

        this.user.setValue(data.user);
        this.category.setValue(data.category);

        // Product Category
        this.productCategory.setValue(data.productCategory);

        // Create product category options form
        this.createProductCategoryOptionsForm(
          this.product.productCategoryOptions.filter((o: any) => o.status == 1)
        );

        // Set default options value
        if (Object.keys(data.productCategoryOptionsValue).length) {
          this.productCategoryOptions.patchValue(
            data.productCategoryOptionsValue
          );
        }

        // Images
        if (data.images) {
          this.images.setValue([...data.images]);
        }
      },
      error: (response) => {
        this.toastService.error(response.error.message);
      },
    });
  }

  /**
   * Build product category options form
   */
  public categoryOptionsView: any[] = [];
  createProductCategoryOptionsForm(productCategoryOptions: any) {
    this.categoryOptionsView = productCategoryOptions.map((option: any) => ({
      id: option.id,
      name: option.name,
      description: option.description,
      status: option.status,
      required: option.required,
      fields: JSON.parse(option.options).map((field: any) => ({
        id: field.uid,
        type: field.type,
        values: field.values.map((value: any) => ({
          id: value.uid,
          name: value.value,
        })),
      })),
    }));

    // Loop received options
    this.categoryOptionsView.forEach((option: any) => {
      // Create new fields
      let newFields: UntypedFormGroup = this.fb.group({});
      option.fields.forEach((field: any) => {
        if (field.type === "checkbox") {
          // Create checkboxes formgroup
          const checkboxes: UntypedFormGroup = this.fb.group({});

          // Add checkbox formcontrol
          field.values.forEach((value: any) => {
            checkboxes.addControl(value.id, this.fb.control(false));
          });

          // Add checkoxes validator
          if (option.required) {
            checkboxes.addValidators(this.checkboxesValidator());
          }

          // Add checkboxes formgroup to the newfields formgroup
          newFields.addControl(field.id, checkboxes);
        } else {
          const control = this.fb.control("");
          if (option.required) {
            control.addValidators(Validators.required);
          }
          // Add empty formcontrol to the newfields formgroup
          newFields.addControl(field.id, control);
        }
      });

      // Validate all fields
      if (option.required) {
        newFields.addValidators(this.categoryOptionsValidator());
      }

      // Create new option with the fields group
      this.productCategoryOptions.addControl(option.id, newFields);
    });
  }

  /**
   * Get category options from backend and create the dynamic form
   * @param event emitted right before an item is selected from the list
   */
  reloadCategoryOptionsForm(event: any) {
    this.categoryOptionsView = [];

    this.productConfigurationService
      .getProductCategory(event.item.id)
      .subscribe({
        next: (data: any) => {
          const options = data.options.filter((o: any) => o.status == 1);
          this.createProductCategoryOptionsForm(options);
        },
        error: (response) => {
          this.toastService.error(response.error.message);
        },
      });
  }

  /**
   * Get category menu list from the database.
   * @param term String to find
   * @returns Observable for Typeahead
   */
  getCategoryList(term: string) {
    const requiredFields = ["id", "status", "name"];

    // Load parameters to get information
    const parameters: UrlParameters = {
      page: "1",
      limit: "10",
      order: JSON.stringify({ field: "id", type: "ASC" }),
      fields: JSON.stringify(requiredFields),
      filter: JSON.stringify([{ name: term }]),
    };

    return this.categoryService
      .getCategoryList(parameters)
      .pipe(map((data) => data.list));
  }

  /**
   * Get product category list from the database. Typeahead
   * @param term String to find
   * @returns Observable for Typeahead
   */
  getProductCategoryList(term: string) {
    const requiredFields = ["id", "status", "name"];

    // Load parameters to get information
    const parameters: UrlParameters = {
      page: "1",
      limit: "10",
      order: JSON.stringify({ field: "id", type: "ASC" }),
      fields: JSON.stringify(requiredFields),
      filter: JSON.stringify([{ name: term }]),
    };

    return this.productConfigurationService
      .getProductCategoryList(parameters)
      .pipe(map((data) => data.list));
  }

  /**
   * Get site users list from the database. Typeahead
   * @param term String to find
   * @returns Observable for Typeahead
   */
  getSiteUserList(term: string) {
    const requiredFields = ["id", "status", "user", "name"];

    // Load parameters to get information
    const parameters: UrlParameters = {
      page: "1",
      limit: "10",
      order: JSON.stringify({ field: "id", type: "ASC" }),
      fields: JSON.stringify(requiredFields),
      filter: JSON.stringify([{ user: term }]),
    };

    return this.siteUserService
      .getSiteUserList(parameters)
      .pipe(map((data) => data.list));
  }

  /* SEARCH FORM */
  searching = false;
  searchFailed = false;

  /**
   * Typeahead formatter
   */
  searchFormatter = (x: { name: string }) => x.name;

  /**
   * Search user method for typeahead
   * @param text$ Typeahead observable text
   * @returns OperatorFunction for typeahead
   */
  searchUser: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        term.length < 2
          ? []
          : this.getSiteUserList(term).pipe(
              tap(() => (this.searchFailed = false)),
              catchError(() => {
                this.searchFailed = true;
                return of([]);
              })
            )
      ),
      tap(() => (this.searching = false))
    );
  };

  /**
   * Search category method for typeahead
   * @param text$ Typeahead observable text
   * @returns OperatorFunction for typeahead
   */
  searchCategory: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        term.length < 2
          ? []
          : this.getCategoryList(term).pipe(
              tap(() => (this.searchFailed = false)),
              catchError(() => {
                this.searchFailed = true;
                return of([]);
              })
            )
      ),
      tap(() => (this.searching = false))
    );
  };

  /**
   * Search product category method for typeahead
   * @param text$ Typeahead observable text
   * @returns OperatorFunction for typeahead
   */
  searchProductCategory: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        term.length < 2
          ? []
          : this.getProductCategoryList(term).pipe(
              tap(() => (this.searchFailed = false)),
              catchError(() => {
                this.searchFailed = true;
                return of([]);
              })
            )
      ),
      tap(() => (this.searching = false))
    );
  };

  /**
   * Add tag to the product tags if it is valid
   * @returns void
   */
  addTag() {
    // Validate errors before save
    if (this.tags.errors) {
      this.invalidTag = true;
      return;
    }

    // Clear tag errors
    this.invalidTag = false;

    // Tag validation before save
    const newTagName = this.tags.value.trim().toLowerCase();
    const validTag = newTagName != "";
    const tagNotExist =
      this.productTags.findIndex((t) => t.name == newTagName) == -1;

    // Valid tag?
    if (validTag && tagNotExist) {
      // Add tag to product tags
      this.productTags.push({ id: 0, name: newTagName, action: "create" });
    }

    // Reset value
    this.tags.setValue("");
  }

  /**
   * Remove tag from the product tags
   * @param tag Object with the tag to remove
   */
  removeTag(tag: Tag) {
    if (tag.id == 0) {
      // Not created yet then remove it from array
      this.productTags = this.productTags.filter((t) => t.name !== tag.name);
    } else {
      // Already created then send the action to the backend
      this.productTags = this.productTags.map((t) =>
        t.name == tag.name ? { ...t, action: "delete" } : t
      );
    }
  }

  /** IMAGES SECTION **/

  /**
   * Handle onchange images event
   *
   * @param event html event
   */
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      // Get file data
      const selectedFiles = event.target.files;

      for (const file of selectedFiles) {
        // Valid file types
        if (file.type != "image/png" && file.type != "image/jpeg") {
          // Reset value
          event.target.value = null;
        } else {
          // Get current images
          let currentImages = this.images.value;
          // Get next index
          const index = currentImages.filter(
            (img: any) => img.action != "delete"
          ).length;

          // Add file to the images
          currentImages.push({
            uid: this.getRandomId(),
            index,
            file,
            primary: index == 0 ? true : false,
            action: "create",
          });

          // Save updated images to the form
          this.images.setValue(currentImages);

          // Read file data and save base64
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const fileData = reader.result as string;
            // Set the image information to preview
            currentImages[index].src = fileData;
            this.images.setValue(currentImages);
          };
        }
      }
      // Reset the input
      event.target.value = null;
    } else {
      // Reset value
      event.target.value = null;
    }
  }

  /**
   * Make an image primary
   *
   * @param imageIndex Index number
   */
  makePrimary(imageIndex: number) {
    let currentImages = this.images.value.map((image: any) => ({
      ...image,
      primary: image.index == imageIndex,
    }));

    // Set current images to the form
    this.images.setValue(currentImages);
  }

  /**
   * Remove an image from the current images array,
   * reindex and validate the primary
   *
   * @param imageIndex Index number
   */
  removeImage(imageIndex: number) {
    let currentImages = this.images.value;

    // Get the image to remove
    const removingImage = currentImages.find(
      (img: any) => img.index == imageIndex && img.action != "delete"
    );

    // Verify if image is not in db
    if (removingImage.action == "create") {
      // Remove from current images
      currentImages = currentImages.filter(
        (img: any) => img.index != imageIndex
      );
    } else {
      // Already created then send the action to the backend
      currentImages = currentImages.map((img: any) =>
        img.index == imageIndex ? { ...img, action: "delete" } : img
      );
    }

    // Reindexing
    currentImages = this.indexImagesArray(currentImages);

    // Validate primary and reset
    if (removingImage.primary) {
      // Set the first image as primary
      currentImages = currentImages.map((img: any) => ({
        ...img,
        primary: img.action != "delete" && img.index == 0,
      }));
    }

    // Set current images to the form
    this.images.setValue(currentImages);
  }

  /**
   * Update the index property with the right order of array
   *
   * @param currentImages Images array to reindex
   * @returns Indexed array
   */
  indexImagesArray(currentImages: []) {
    let newIndex = 0;

    return currentImages.map((img: any) => {
      let image = img;
      if (img.action != "delete") {
        image = { ...img, index: newIndex };
        newIndex++;
      }

      return image;
    });
  }

  /**
   * Generate a new unique id with 12 characters length
   * @returns unique id
   */
  getRandomId() {
    return Math.random().toString(16).slice(2, 14); // 12 chars hex number
  }

  /* CUSTOM VALIDATORS */

  /**
   * Validate if checkboxes formgroup has been selected
   * @returns ValidatorFn
   */
  checkboxesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as UntypedFormGroup;

      let invalid = true;
      Object.entries(group.controls).map((c: any) => {
        const [key, control] = c;
        // Some checkbox selected
        if (control.value != false) invalid = false;
      });

      return invalid ? { required: true } : null;
    };
  }

  /**
   * Validate if the formgroup has errors
   * @returns ValidatorFn
   */
  categoryOptionsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as UntypedFormGroup;

      let invalid = false;
      Object.entries(group.controls).map((c: any) => {
        const [key, control] = c;

        if (control.errors) invalid = true;
      });

      return invalid ? { required: true } : null;
    };
  }

  /**
   *
   *  DRAG AND DROP LOGIC *
   *
   */

  @ViewChild(CdkDropListGroup) listGroup!: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder!: CdkDropList;

  public target!: CdkDropList | null;
  public targetIndex!: number;
  public source!: CdkDropList;
  public sourceIndex!: number;
  public activeContainer = null;

  // public items: Array<number> = Array(10)
  //   .fill(0)
  //   .map((_, i) => i + 1);

  // public itemTrackBy(item: any) {
  //   return item.id;
  // }

  ngAfterViewInit() {
    const phElement = this.placeholder.element.nativeElement;

    phElement.style.display = "none";
    phElement.parentElement?.removeChild(phElement);
  }

  dropListDropped() {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = "none";

    parent?.removeChild(phElement);
    parent?.appendChild(phElement);
    parent?.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null as any;
    this.activeContainer = null;

    if (this.sourceIndex !== this.targetIndex) {
      // moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
      let currentImages = this.images.value;
      moveItemInArray(currentImages, this.sourceIndex, this.targetIndex);
      currentImages = this.indexImagesArray(currentImages);
      this.images.setValue(currentImages);
    }
  }

  cdkDropListEntered(e: CdkDragEnter) {
    const drag = e.item;
    const drop = e.container;

    if (drop === this.placeholder) {
      return true;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    // sourceElement.style.backgroundColor = "red";

    // console.log(phElement.getBoundingClientRect());
    // console.log(sourceElement.getBoundingClientRect());
    // console.log(dropElement.getBoundingClientRect());

    const dragIndex = __indexOf(
      dropElement.parentElement?.children,
      this.source ? phElement : sourceElement
    );
    const dropIndex = __indexOf(
      dropElement.parentElement?.children,
      dropElement
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = dropElement.clientWidth / 2 + "px";
      phElement.style.height = dropElement.clientHeight + "px";
      // console.log("dCont", sourceElement.clientWidth);
      // console.log("ph", phElement.style.width, phElement.style.height);

      sourceElement.parentElement?.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = "";
    dropElement.parentElement?.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    requestAnimationFrame(() => {
      this.placeholder._dropListRef.enter(
        drag._dragRef,
        drag.element.nativeElement.offsetLeft,
        drag.element.nativeElement.offsetTop
      );
    });

    return;
  }
}

function __indexOf(collection: any, node: any) {
  return Array.prototype.indexOf.call(collection, node);
}
