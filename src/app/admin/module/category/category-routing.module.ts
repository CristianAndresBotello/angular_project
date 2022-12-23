import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../helpers/guards/auth.guard";
import { EditComponent } from "./edit/edit.component";
import { ListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    component: ListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:id",
    component: EditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "new",
    component: EditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
