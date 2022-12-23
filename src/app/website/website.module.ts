import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WebsiteRoutingModule } from "./website-routing.module";
import { WebsiteComponent } from "../website/website.component";
import { MainTemplateModule } from "./shared/main-template/main-template.module";
import { HomeModule } from "./module/home/home.module";

@NgModule({
  declarations: [WebsiteComponent],
  imports: [CommonModule, WebsiteRoutingModule, MainTemplateModule, HomeModule],
})
export class WebsiteModule {}
