import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup, FormGroupName } from "@angular/forms";

@Component({
  selector: "app-form-control",
  templateUrl: "./form-control.component.html",
  styleUrls: ["./form-control.component.scss"],
})
export class FormControlComponent implements OnInit {
  @Input() field: any;
  @Input() parentForm: UntypedFormGroup = {} as UntypedFormGroup;

  constructor() {}

  ngOnInit(): void {}
}
