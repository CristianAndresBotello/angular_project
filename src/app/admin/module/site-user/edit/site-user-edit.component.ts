import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Address,
  FormType,
  SiteUser,
  StatusOption,
} from "src/app/admin/model/site-user-list.model";
import { CountriesService } from "src/app/admin/service/contries/countries.service";
import { SiteUserService } from "src/app/admin/service/site-user/site-user.service";
import { ToastService } from "src/app/admin/service/toast/toast.service";

@Component({
  selector: "app-site-user-edit",
  templateUrl: "./site-user-edit.component.html",
  styleUrls: ["./site-user-edit.component.scss"],
})
export class SiteUserEditComponent implements OnInit {
  // Public
  public currentForm: FormType = "";
  public showPassword: boolean = false;
  public submitDisabled: boolean = false;
  public statusOptions: StatusOption[] = [
    { value: "Active", key: 1 },
    { value: "Inactive", key: 2 },
  ];

  public siteUser: SiteUser = {
    id: 0,
    status: 0,
    user: "",
    password: "",
    name: "",
    email: "",
    gender: "",
    photo: "",
    address: [],
  };
  // Define formGroup
  public siteUserForm = this.fb.group({
    status: [2, [Validators.required, Validators.min(1)]],
    user: ["", [Validators.required, Validators.minLength(4)]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    name: ["", [Validators.required, Validators.minLength(6)]],
    email: ["", [Validators.required, Validators.email]],
    gender: ["", [Validators.required]],
    photo: [""],
    address: this.fb.group({
      status: ["1"],
      title: [""],
      name: [""],
      telephone: [""],
      fax: [""],
      street: [""],
      country: [""],
      state: [""],
      city: [""],
      zipcode: [""],
      type: [""], // Billing or shipping
      default: [true],
    }),
  });
  public validateForm: boolean = false;
  public userPhotoSrc: string = "";
  public activeTab: number = 1;
  public countriesList: any;
  public statesList: any;
  public userAddresses: Address[] = [];
  public userAddressesView: Address[] = [];
  public showAddressForm: boolean = false;

  // Getters
  get status(): any {
    return this.siteUserForm.get("status");
  }
  get user(): any {
    return this.siteUserForm.get("user");
  }
  get password(): any {
    return this.siteUserForm.get("password");
  }
  get name(): any {
    return this.siteUserForm.get("name");
  }
  get email(): any {
    return this.siteUserForm.get("email");
  }
  get gender(): any {
    return this.siteUserForm.get("gender");
  }
  get photo(): any {
    return this.siteUserForm.get("photo");
  }
  // Address
  get address() {
    return this.siteUserForm.get("address") as UntypedFormArray;
  }
  get addressStatus() {
    return this.siteUserForm.get("address.status");
  }
  get addressTitle() {
    return this.siteUserForm.get("address.title");
  }
  get addressName() {
    return this.siteUserForm.get("address.name");
  }
  get addressTelephone() {
    return this.siteUserForm.get("address.telephone");
  }
  get addressFax() {
    return this.siteUserForm.get("address.fax");
  }
  get addressStreet() {
    return this.siteUserForm.get("address.street");
  }
  get addressCountry() {
    return this.siteUserForm.get("address.country");
  }
  get addressState() {
    return this.siteUserForm.get("address.state");
  }
  get addressCity() {
    return this.siteUserForm.get("address.city");
  }
  get addressZipcode() {
    return this.siteUserForm.get("address.zipcode");
  }
  get addressDefault() {
    return this.siteUserForm.get("address.default");
  }

  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private location: Location,
    private router: Router,
    private siteUserService: SiteUserService,
    private toastService: ToastService,
    private countriesService: CountriesService
  ) {
    // Get countries and states
    this.countriesList = countriesService.countries;
    this.statesList = countriesService.states;
  }

  ngOnInit(): void {
    // Get path parameter
    this.activatedRouter.params.subscribe((params) => {
      if (params.id) {
        // Define form type
        this.currentForm = "edit";
        // Remove password required validation
        this.password.removeValidators(Validators.required);
        // Get user data
        this.getUserInformation(params.id);
      } else {
        // Define form type
        this.currentForm = "new";
      }
    });
  }

  /**
   * Get user user information from database
   *
   * @param userId Identification number
   */
  getUserInformation(userId: number) {
    this.siteUserService.getSiteUser(userId).subscribe({
      next: (data: any) => {
        // Load data in siteUser
        this.siteUser = data;
        // Load form data
        this.status.setValue(data.status);
        this.user.setValue(data.user);
        // this.password.setValue(data.password);
        this.name.setValue(data.name);
        this.email.setValue(data.email);
        this.gender.setValue(data.gender);

        // Photo
        this.photo.setValue(data.photo);
        this.userPhotoSrc = data.photo;

        // Address
        this.userAddresses = data.addresses;
        this.userAddressesView = this.userAddresses;
      },
      error: (response) => {
        this.toastService.error(response.error.message);
      },
    });
  }

  /**
   * When user submits form
   * @returns void
   */
  onSubmit() {
    this.validateForm = true;

    if (this.siteUserForm.invalid) {
      // Go to the tab with errors
      this.activeTab = this.address?.invalid ? 2 : 1;
      return;
    }

    let userData: any = {};
    // Status
    if (this.status.value != this.siteUser.status) {
      userData.status = this.status.value;
    }
    // User
    if (this.user.value != this.siteUser.user) {
      userData.user = this.user.value;
    }
    // Password
    if (
      this.password.value != "" &&
      this.password.value != this.siteUser.password
    ) {
      userData.password = this.password.value;
    }
    // Name
    if (this.name.value != this.siteUser.name) {
      userData.name = this.name.value;
    }
    // Email
    if (this.email.value != this.siteUser.email) {
      userData.email = this.email.value;
    }
    // Gender
    if (this.gender.value != this.siteUser.gender) {
      userData.gender = this.gender.value;
    }
    // Photo
    if (this.photo.value != "" && this.photo.value != this.siteUser.photo) {
      userData.photo = this.photo.value;
    }

    // Validate address changes
    if (this.showAddressForm) {
      // Add the current form address
      this.userAddresses.push({
        id: 0,
        status: this.address.value.status,
        title: this.address.value.title,
        name: this.address.value.name,
        telephone: this.address.value.telephone,
        fax: this.address.value.fax,
        street: this.address.value.street,
        country: this.address.value.country,
        state: this.address.value.state,
        city: this.address.value.city,
        zipcode: this.address.value.zipcode,
        type: "",
        action: "add",
        default: this.address.value.default,
      });
      userData.addresses = JSON.stringify(this.userAddresses);
    } else {
      // Validate if there is an action
      if (this.userAddresses.filter((a) => a.action).length) {
        userData.addresses = JSON.stringify(this.userAddresses);
      }
    }

    // Validate if there area information to save
    if (Object.keys(userData).length > 0) {
      // Save new information
      if (this.currentForm === "edit") {
        // Update changed information
        this.updateSiteUser(userData);
      } else if (this.currentForm === "new") {
        // Save new user
        this.createSiteUser(userData);
      }
    } else {
      console.log("nothing to save");
    }
  }

  /**
   * Update the user information
   *
   * @param modifiedAdmin Object with information
   */
  updateSiteUser(modifiedAdmin: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.siteUserService
      .updateSiteUser(this.siteUser.id, modifiedAdmin)
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
          // Remove addresses added
          this.userAddresses = this.userAddresses.filter(
            (a) => a.action != "add"
          );
          // Enable submit button
          this.submitDisabled = false;
          // Show error message
          this.toastService.error(error.error.message);
          // Do nothing
        },
      });
  }

  /**
   * Create new user
   *
   * @param newUser Object with new information
   */
  createSiteUser(newUser: {}) {
    // Disable submit button
    this.submitDisabled = true;

    this.siteUserService.createSiteUser(newUser).subscribe({
      next: (response: any) => {
        // Show succes message
        this.toastService.success(response.message);
        // Go to the list
        setTimeout(() => {
          this.router.navigateByUrl(`/admin/site-user/edit/${response.id}`);
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
   * Handle onchange photo event
   * @param event Event
   */
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      // Get file data
      const [file] = event.target.files;

      // Valid file types
      if (file.type != "image/png" && file.type != "image/jpeg") {
        // Reset value
        event.target.value = null;
        this.photo.setValue("");
        this.userPhotoSrc = "";
      } else {
        // Save value to form
        this.photo.setValue(file);

        // Read file data and save base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const fileData = reader.result as string;
          this.userPhotoSrc = fileData;
          // this.photo.setValue({
          //   fileName: file.name,
          //   mimeType: file.type,
          //   content: fileData.replace(/^data:image\/png;base64,/, ""),
          // });
        };
      }
    } else {
      // Reset value
      event.target.value = null;
      this.photo.setValue("");
    }
  }

  /**
   * Edit form: update user photo in back
   * New form: remove user photo from form
   */
  removeUserPhoto() {
    if (this.currentForm === "edit") {
      this.updateSiteUser({ photo: "" });
    } else if (this.currentForm === "new") {
      this.photo.setValue("");
      this.userPhotoSrc = "";
    }
  }

  /**
   * Show address form when user clicks button,
   * then activate the validators or remove them
   */
  viewAddressForm() {
    this.showAddressForm = !this.showAddressForm;

    if (this.showAddressForm) {
      // Add validators
      this.addressName?.setValidators([Validators.required]);
      this.addressTelephone?.setValidators([Validators.required]);
      this.addressStreet?.setValidators([Validators.required]);
      this.addressCountry?.setValidators([Validators.required]);
      this.addressState?.setValidators([Validators.required]);
      this.addressCity?.setValidators([Validators.required]);
      this.addressZipcode?.setValidators([Validators.required]);
    } else {
      this.validateForm = false;
      // Remove validators
      this.addressName?.clearValidators();
      this.addressTelephone?.clearValidators();
      this.addressStreet?.clearValidators();
      this.addressCountry?.clearValidators();
      this.addressState?.clearValidators();
      this.addressCity?.clearValidators();
      this.addressZipcode?.clearValidators();
    }

    // Update validation
    this.addressName?.updateValueAndValidity();
    this.addressTelephone?.updateValueAndValidity();
    this.addressStreet?.updateValueAndValidity();
    this.addressCountry?.updateValueAndValidity();
    this.addressState?.updateValueAndValidity();
    this.addressCity?.updateValueAndValidity();
    this.addressZipcode?.updateValueAndValidity();
  }

  /**
   * Remove user address in backend
   * @param address Address to remove
   */
  removeAddress(address: any) {
    // Delete alternative saving changes
    // this.userAddresses = this.userAddresses.map((a) =>
    //   a.id == address.id ? { ...a, action: "delete" } : a
    // );
    // this.userAddressesView = this.userAddresses.filter(
    //   (a) => a.action != "delete"
    // );

    // Set data to update
    this.updateSiteUser({
      addresses: JSON.stringify([{ ...address, action: "delete" }]),
    });
  }

  /**
   * Set default addres in backend
   * @param address Addres to update
   */
  setDefaultAddress(address: any) {
    // Set data to update
    let userData = {
      addresses: JSON.stringify([
        { id: address.id, action: "update", default: true },
      ]),
    };

    this.updateSiteUser(userData);
  }
}
