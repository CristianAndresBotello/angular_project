import { Component, Input, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-email-addresses",
  templateUrl: "./email-addresses.component.html",
  styleUrls: ["./email-addresses.component.scss"],
})
export class EmailAddressesComponent implements OnInit {
  @Input() parentForm: any;
  @Input() validateForm: Boolean = false;
  @Input() imagesSrc: any = {};

  // Array to generate the form dinamically
  public emailFormView = [
    { title: "General Contact", name: "generalContact" },
    { title: "Customer Support", name: "customerSupport" },
    { title: "Designer Support", name: "designerSupport" },
    { title: "Sales", name: "sales" },
    { title: "Address Verification", name: "addressVerification" },
  ];

  constructor() {}

  // Getters
  get emailLogo() {
    return this.parentForm.get("emailLogo");
  }

  ngOnInit(): void {}

  /**
   * Get the form group
   * @param groupName Group name
   * @returns requested form group
   */
  getGroup(groupName: string) {
    return this.parentForm.get(groupName);
  }

  /**
   * Get the form control inside the form group
   * @param groupName Group name
   * @param controlName Control name
   * @returns requested form control
   */
  getControl(groupName: string, controlName: string) {
    return this.getGroup(groupName).get(controlName);
  }

  /**
   * Validates if the form control has errors
   * @param groupName Group name
   * @param controlName Control name
   * @returns boolean validation of form control
   */
  validateControl(groupName: string, controlName: string) {
    return this.validateForm && this.getControl(groupName, controlName)?.errors;
  }

  /**
   * Get the selected field and save to the form
   *
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
        this.imagesSrc["logo"] = "";
        this.emailLogo.setValue("");
        this.emailLogo.markAsDirty();
      } else {
        // Save value to form
        this.emailLogo.setValue(file);
        this.emailLogo.markAsDirty();

        // Read file data and save base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const fileData = reader.result as string;
          this.imagesSrc["logo"] = fileData;
        };
      }
    } else {
      // Reset value
      event.target.value = null;
      this.imagesSrc["logo"] = "";
      this.emailLogo.setValue("");
      this.emailLogo.markAsDirty();
    }
  }

  /**
   * Removes the image of the email logo
   *
   * @param formGroup Form image location
   * @param formControlName Form control name
   */
  removeEmailLogo() {
    this.imagesSrc["logo"] = "";
    this.emailLogo.setValue("");
    this.emailLogo.markAsDirty();
    // Set validators
    this.emailLogo.setValidators([Validators.required]);
    this.emailLogo.updateValueAndValidity();
  }
}
