import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ReactiveFormsModule } from "@angular/forms";

import { CoreModule } from "../../core/core.module";

import { ProductRoutingModule } from "./product-routing.module";
import { ProductEditComponent } from "./edit/product-edit.component";
import { ProductListComponent } from "./list/product-list.component";
import { FormControlComponent } from "../../core/form-control/form-control.component";

@NgModule({
  declarations: [
    FormControlComponent,
    ProductEditComponent,
    ProductListComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    DragDropModule,
    NgbModule,
    ReactiveFormsModule,
    ProductRoutingModule,
  ],
})
export class ProductModule {}
