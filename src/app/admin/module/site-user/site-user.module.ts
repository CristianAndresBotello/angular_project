import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { CoreModule } from "../../core/core.module";

import { SiteUserRoutingModule } from "./site-user-routing.module";
import { SiteUserEditComponent } from "./edit/site-user-edit.component";
import { SiteUserListComponent } from "./list/site-user-list.component";

@NgModule({
  declarations: [SiteUserEditComponent, SiteUserListComponent],
  imports: [
    CommonModule,
    CoreModule,
    NgbModule,
    ReactiveFormsModule,
    SiteUserRoutingModule,
  ],
})
export class SiteUserModule {}
