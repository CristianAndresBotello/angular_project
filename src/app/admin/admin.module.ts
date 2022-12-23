// Angular modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Other modules
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
// Routing module
import { AdminRoutingModule } from "./admin-routing.module";

// Interceptors
import { JwtInterceptor } from "./helpers/interceptors/jwt.interceptor";
import { LoadingInterceptor } from "./helpers/interceptors/loading.interceptor";

// Components
import { ConfirmDialogComponent } from "./core/confirm-dialog/confirm-dialog.component";
import { LeftNavigationComponent } from "./shared/left-navigation/left-navigation.component";
import { MainNavigationComponent } from "./shared/main-navigation/main-navigation.component";
import { TemplateComponent } from "./shared/template/template.component";
import { AdminComponent } from "../admin/admin.component";
import { LoginComponent } from "./module/login/login.component";

// Modules
import { CoreModule } from "./core/core.module";
import { ConfigurationModule } from "./module/configuration/configuration.module";

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    LeftNavigationComponent,
    MainNavigationComponent,
    TemplateComponent,
    AdminComponent,
    LoginComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    CoreModule,
    ConfigurationModule,
  ],
  providers: [
    NgbActiveModal,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
})
export class AdminModule {}
