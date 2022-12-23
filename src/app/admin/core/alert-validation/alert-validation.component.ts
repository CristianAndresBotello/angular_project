import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-alert-validation",
  templateUrl: "./alert-validation.component.html",
  styleUrls: ["./alert-validation.component.scss"],
})
export class AlertValidationComponent implements OnInit {
  @Input("data") control: any;

  constructor() {}

  ngOnInit(): void {}

  getInvalidCharacters() {
    if (this.control.errors.pattern) {
      const pattern = new RegExp(
        this.control.errors.pattern.requiredPattern.replace(/^\^|\$$/g, ""),
        "g"
      );
      return this.control.errors.pattern.actualValue.replaceAll(pattern, "");
    }
  }
}
