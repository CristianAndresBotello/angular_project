import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FooterComponent } from "./footer/footer.component";
import { MainTemplateComponent } from "./main-template.component";

import { MainTemplateRoutingModule } from "./main-template-routing.module";
import { HeaderModule } from "./header/header.module";

@NgModule({
  declarations: [MainTemplateComponent, FooterComponent],
  imports: [CommonModule, MainTemplateRoutingModule, HeaderModule],
})
export class MainTemplateModule {}
