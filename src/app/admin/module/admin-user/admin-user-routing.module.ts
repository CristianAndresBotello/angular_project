import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../helpers/guards/auth.guard";

import { AdminUserEditComponent } from "./edit/admin-user-edit.component";
import { AdminUserListComponent } from "./list/admin-user-list.component";

const routes: Routes = [
  {
    path: "",
    component: AdminUserListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: AdminUserEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: AdminUserEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminUserRoutingModule {}
