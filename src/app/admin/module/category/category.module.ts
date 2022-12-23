import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { CoreModule } from "../../core/core.module";

import { CategoryRoutingModule } from "./category-routing.module";
import { EditComponent } from "./edit/edit.component";
import { ListComponent } from "./list/list.component";

@NgModule({
  declarations: [EditComponent, ListComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    CoreModule,
    ReactiveFormsModule,
  ],
})
export class CategoryModule {}
