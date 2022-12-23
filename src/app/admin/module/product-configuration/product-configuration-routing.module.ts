import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../helpers/guards/auth.guard";

import { ProductConfigurationEditComponent } from "./edit/product-configuration-edit.component";
import { ProductConfigurationListComponent } from "./list/product-configuration-list.component";

const routes: Routes = [
  {
    path: "",
    component: ProductConfigurationListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: ProductConfigurationEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: ProductConfigurationEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductConfigurationRoutingModule {}
