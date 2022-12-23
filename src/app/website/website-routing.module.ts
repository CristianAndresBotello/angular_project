import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./module/home/home.component";
import { MainTemplateComponent } from "./shared/main-template/main-template.component";
import { WebsiteComponent } from "./website.component";

const routes: Routes = [
  {
    path: "",
    component: MainTemplateComponent,
    children: [{ path: "", component: HomeComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
