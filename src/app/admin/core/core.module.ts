import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AlertValidationComponent } from "./alert-validation/alert-validation.component";
import { SearchComponent } from "./search/search.component";
import { PaginationComponent } from "./pagination/pagination/pagination.component";
import { SortItemsComponent } from "./pagination/sort-items/sort-items.component";
import { LoadingComponent } from "./loading/loading.component";
import { ToastComponent } from "./toast/toast.component";

@NgModule({
  declarations: [
    AlertValidationComponent,
    LoadingComponent,
    PaginationComponent,
    SearchComponent,
    SortItemsComponent,
    ToastComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    AlertValidationComponent,
    LoadingComponent,
    PaginationComponent,
    SearchComponent,
    SortItemsComponent,
    ToastComponent,
  ],
})
export class CoreModule {}
