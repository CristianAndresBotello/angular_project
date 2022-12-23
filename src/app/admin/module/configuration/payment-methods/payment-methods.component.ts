import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";

@Component({
  selector: "app-payment-methods",
  templateUrl: "./payment-methods.component.html",
  styleUrls: ["./payment-methods.component.scss"],
})
export class PaymentMethodsComponent implements OnInit {
  @Input() parentForm: any;
  @Input() validateForm: Boolean = false;

  // Select options
  public statusOptions = [
    { key: 1, value: "Active" },
    { key: 2, value: "Deactive" },
  ];
  public modeOptions = [
    { key: "sandbox", value: "Sandbox" },
    { key: "live", value: "Live" },
  ];
  public walletPayOptions = [
    { key: 0, value: "Deactive" },
    { key: 1, value: "Active All Wallets" },
    { key: 2, value: "Apple Pay Only" },
  ];
  public showPassword = false;

  constructor() {}

  // Getters
  get paypal() {
    return this.parentForm.get("paypal");
  }
  get paypalCredit() {
    return this.paypal.get("creditCard");
  }
  get paypalExpress() {
    return this.paypal.get("expressCheckout");
  }
  get stripe() {
    return this.parentForm.get("stripe");
  }

  ngOnInit(): void {}

  /**
   * Validates if the form control has errors
   * @param groupName Group name
   * @param controlName Control name
   * @returns boolean validation of form control
   */
  validateControl(form: UntypedFormGroup, controlName: string) {
    return this.validateForm && form.get(controlName)?.errors;
  }
}
