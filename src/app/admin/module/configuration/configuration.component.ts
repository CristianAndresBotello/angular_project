import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfigurationService } from "../../service/configuration/configuration.service";
import { ToastService } from "../../service/toast/toast.service";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.scss"],
})
export class ConfigurationComponent implements OnInit {
  public submitDisabled: boolean = false;
  public activeTab: string = "general-tab";

  public validateForm: boolean = false;
  public designImages: any = { favicon: "", logo: "" };
  public emailImages: any = { logo: "" };

  // General Form
  public generalForm = this.fb.group({
    id: 0,
    storeName: ["", Validators.required],
    storePhone: ["", Validators.required],
    storeCountry: ["", Validators.required],
    storeAddress: ["", Validators.required],
  });
  // Design Form
  public designWebForm = this.fb.group({
    id: 0,
    head: this.fb.group({
      favicon: [""],
      title: ["", Validators.required],
      titlePrefix: ["", Validators.required],
      titleSufix: ["", Validators.required],
      description: ["", Validators.required],
      keywords: ["", Validators.required],
      robots: ["", Validators.required],
      scripts: ["", Validators.required],
    }),
    header: this.fb.group({
      logo: [""],
      logoAlt: ["", Validators.required],
      welcomeText: ["", Validators.required],
    }),
    footer: this.fb.group({
      copyright: ["", Validators.required],
      html: ["", Validators.required],
    }),
  });
  // Payment Form
  public paymentMethodForm = this.fb.group({
    paypal: this.fb.group({
      creditCard: this.fb.group({
        id: 0,
        status: ["", Validators.required],
        title: ["", Validators.required],
        user: ["", Validators.required],
        password: ["", Validators.required],
        clientId: ["", Validators.required],
        secret: ["", Validators.required],
        mode: ["", Validators.required],
        sort: ["", Validators.required],
        type: ["cc", Validators.required],
      }),
      expressCheckout: this.fb.group({
        id: 0,
        status: ["", Validators.required],
        title: ["", Validators.required],
        user: ["", Validators.required],
        password: ["", Validators.required],
        clientId: ["", Validators.required],
        secret: ["", Validators.required],
        mode: ["", Validators.required],
        sort: ["", Validators.required],
        type: ["ec", Validators.required],
      }),
    }),
    stripe: this.fb.group({
      id: 0,
      status: ["", Validators.required],
      title: ["", Validators.required],
      secretKey: ["", Validators.required],
      publishableKey: ["", Validators.required],
      walletPay: ["", Validators.required],
    }),
  });
  // Email Form
  public emailAddressesForm = this.fb.group({
    id: 0,
    generalContact: this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    }),
    customerSupport: this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    }),
    designerSupport: this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    }),
    sales: this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    }),
    addressVerification: this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    }),
    emailLogo: [""],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private configurationService: ConfigurationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get configuration on init
    this.getConfiguration();
  }

  /**
   * Get the modified values from a form group
   * @param form FormGroup to check
   * @param ignoreFields Array of fields to ignore the validation
   * @returns Object with modified controls values
   */
  getDirtyValues(form: any, ignoreFields: any = ["id"]) {
    let dirtyValues: any = {};

    Object.keys(form.controls).forEach((key) => {
      const currentControl = form.controls[key];

      if (currentControl.dirty || ignoreFields.includes(key)) {
        if (currentControl.controls)
          dirtyValues[key] = this.getDirtyValues(currentControl, ignoreFields);
        else dirtyValues[key] = currentControl.value;
      }
    });

    return dirtyValues;
  }

  /**
   * Form submit handler
   * @returns
   */
  onSubmit() {
    let configurationData: any = {};
    if (this.generalForm.dirty) {
      // Validate form if was modified
      this.validateForm = true;

      // Go to tab if form is invalid
      if (this.generalForm.invalid) {
        this.activeTab = "general-tab";
        return;
      }

      // Get data to save
      configurationData.general = this.getDirtyValues(this.generalForm);
    }
    if (this.designWebForm.dirty) {
      // Validate form if was modified
      this.validateForm = true;

      // Go to tab if form is invalid
      if (this.designWebForm.invalid) {
        this.activeTab = "design-tab";
        return;
      }

      // Get data to save
      configurationData.designWeb = this.getDirtyValues(this.designWebForm);
    }
    if (this.paymentMethodForm.dirty) {
      // Validate form if was modified
      this.validateForm = true;

      // Go to tab if form is invalid
      if (this.paymentMethodForm.invalid) {
        this.activeTab = "payment-tab";
        return;
      }

      // Get data to save
      configurationData.paymentMethods = this.getDirtyValues(
        this.paymentMethodForm,
        ["id", "type"]
      );
    }
    if (this.emailAddressesForm.dirty) {
      // Validate form if was modified
      this.validateForm = true;

      // Go to tab if form is invalid
      if (this.emailAddressesForm.invalid) {
        this.activeTab = "email-tab";
        return;
      }

      // Get data to save
      configurationData.emailAddresses = this.getDirtyValues(
        this.emailAddressesForm,
        ["id", "type"]
      );
    }

    // Validate if there is information to save
    if (Object.keys(configurationData).length > 0) {
      this.saveConfiguration(configurationData);
    } else {
      console.log("No information to save");
    }
  }

  /**
   * Get current configuration from backend and set to forms
   */
  getConfiguration() {
    this.configurationService.getConfiguration().subscribe({
      next: (data: any) => {
        if (data.general) {
          this.generalForm.patchValue(data.general);
        }
        if (data.designWeb) {
          this.designWebForm.patchValue(data.designWeb);
        }
        if (data.designImages) {
          this.designImages.favicon = data.designImages.favicon || "";
          this.designImages.logo = data.designImages.logo || "";
        }
        if (data.paymentMethods) {
          this.paymentMethodForm.patchValue(data.paymentMethods);
        }
        if (data.emailAddresses) {
          this.emailAddressesForm.patchValue(data.emailAddresses);
        }
        if (data.emailImages) {
          this.emailImages.logo = data.emailImages.logo || "";
        }
      },
      error: (response) => {
        // Show error message
        this.toastService.error(response.error.message);
      },
    });
  }

  /**
   * Update or create the configuration
   * @param configurationData Object with data to save
   */
  saveConfiguration(configurationData: any) {
    // Disable submit button
    this.submitDisabled = true;

    this.configurationService.saveConfiguration(configurationData).subscribe({
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
      error: (response) => {
        // Enable submit button
        this.submitDisabled = false;
        // Show error message
        this.toastService.error(response.error.message);
      },
    });
  }
}
