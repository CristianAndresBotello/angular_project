import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { CoreModule } from "../../core/core.module";

import { ProductConfigurationRoutingModule } from "./product-configuration-routing.module";
import { ProductConfigurationEditComponent } from "./edit/product-configuration-edit.component";
import { ProductConfigurationListComponent } from "./list/product-configuration-list.component";

@NgModule({
  declarations: [
    ProductConfigurationEditComponent,
    ProductConfigurationListComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    ProductConfigurationRoutingModule,
  ],
})
export class ProductConfigurationModule {}
