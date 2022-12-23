import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AdminModule } from "./admin/admin.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { WebsiteModule } from "./website/website.module";
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AdminModule, WebsiteModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
