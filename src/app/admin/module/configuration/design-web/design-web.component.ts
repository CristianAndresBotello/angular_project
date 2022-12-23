import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup, Validators } from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
  selector: "app-design-web",
  templateUrl: "./design-web.component.html",
  styleUrls: ["./design-web.component.scss"],
})
export class DesignWebComponent implements OnInit {
  @Input() parentForm: any;
  @Input() validateForm: Boolean = false;
  @Input() imagesSrc: any = {};

  public robotsOptions = [
    { key: "INDEX,FOLLOW", value: "INDEX, FOLLOW" },
    { key: "NOINDEX,FOLLOW", value: "NOINDEX, FOLLOW" },
    { key: "INDEX,NOFOLLOW", value: "INDEX, NOFOLLOW" },
    { key: "NOINDEX,NOFOLLOW", value: "NOINDEX, NOFOLLOW" },
  ];

  public editorConfig: AngularEditorConfig = {
    editable: true,
    height: "100",
    placeholder: "Miscellaneous HTML",
  };

  constructor() {}

  get head() {
    return this.parentForm.get("head");
  }
  get header() {
    return this.parentForm.get("header");
  }
  get footer() {
    return this.parentForm.get("footer");
  }

  ngOnInit(): void {}

  /**
   * Get the selected field and save to the form
   *
   * @param event Event
   * @param formGroup From group where the event was fired
   * @param formControlName Name of control in form
   */
  onFileChange(event: any, formGroup: UntypedFormGroup, formControlName: string) {
    if (event.target.files.length > 0) {
      // Get file data
      const [file] = event.target.files;

      // Valid file types
      if (file.type != "image/png" && file.type != "image/jpeg") {
        // Reset value
        event.target.value = null;
        this.imagesSrc[formControlName] = "";
        formGroup.get(formControlName)?.setValue("");
        formGroup.get(formControlName)?.markAsDirty();
      } else {
        // Save value to form
        formGroup.get(formControlName)?.setValue(file);
        formGroup.get(formControlName)?.markAsDirty();

        // Read file data and save base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const fileData = reader.result as string;
          this.imagesSrc[formControlName] = fileData;
        };
      }
    } else {
      // Reset value
      event.target.value = null;
      this.imagesSrc[formControlName] = "";
      formGroup.get(formControlName)?.setValue("");
      formGroup.get(formControlName)?.markAsDirty();
    }
  }

  /**
   * Removes the image of the email logo
   *
   * @param formGroup Form image location
   * @param formControlName Form control name
   */
  removeImage(formGroup: UntypedFormGroup, formControlName: string) {
    this.imagesSrc[formControlName] = "";
    formGroup.get(formControlName)?.setValue("");
    formGroup.get(formControlName)?.markAsDirty();
    // Set validators
    formGroup.get(formControlName)?.setValidators([Validators.required]);
    formGroup.get(formControlName)?.updateValueAndValidity();
  }
}
