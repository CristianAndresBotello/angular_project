import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../helpers/guards/auth.guard";

import { ProductEditComponent } from "./edit/product-edit.component";
import { ProductListComponent } from "./list/product-list.component";

const routes: Routes = [
  {
    path: "",
    component: ProductListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ProductEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ProductEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
