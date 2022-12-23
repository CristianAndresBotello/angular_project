import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { CoreModule } from "../../core/core.module";

import { AdminUserRoutingModule } from "./admin-user-routing.module";
import { AdminUserEditComponent } from "./edit/admin-user-edit.component";
import { AdminUserListComponent } from "./list/admin-user-list.component";

@NgModule({
  declarations: [AdminUserEditComponent, AdminUserListComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    AdminUserRoutingModule,
  ],
})
export class AdminUserModule {}
