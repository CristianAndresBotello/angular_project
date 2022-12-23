import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../helpers/guards/auth.guard";

import { SiteUserEditComponent } from "./edit/site-user-edit.component";
import { SiteUserListComponent } from "./list/site-user-list.component";

const routes: Routes = [
  {
    path: "",
    component: SiteUserListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: SiteUserEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: SiteUserEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteUserRoutingModule {}
