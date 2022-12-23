import { Component, Input, OnInit } from "@angular/core";
import { CountriesService } from "src/app/admin/service/contries/countries.service";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.scss"],
})
export class GeneralComponent implements OnInit {
  @Input() parentForm: any;
  @Input() validateForm: Boolean = false;

  public countriesList: { name: string; code: string }[];

  constructor(private countriesService: CountriesService) {
    // Get countries and states
    this.countriesList = countriesService.countries;
  }

  ngOnInit(): void {}
}
