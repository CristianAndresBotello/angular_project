// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// Guard
import { AuthGuard } from "./helpers/guards/auth.guard";
// Shared
import { TemplateComponent } from "./shared/template/template.component";
// Components
import { AdminComponent } from "./admin.component";
import { LoginComponent } from "./module/login/login.component";
import { DashboardComponent } from "./module/dashboard/dashboard.component";
import { ConfigurationComponent } from "./module/configuration/configuration.component";
import { HttpClientModule } from "@angular/common/http";

const routes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    children: [
      { path: "login", component: LoginComponent },
      {
        path: "",
        component: TemplateComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "dashboard",
            component: DashboardComponent,
          },
          {
            path: "admin-user",
            loadChildren: () =>
              import("./module/admin-user/admin-user.module").then(
                (m) => m.AdminUserModule
              ),
          },
          {
            path: "site-user",
            loadChildren: () =>
              import("./module/site-user/site-user.module").then(
                (m) => m.SiteUserModule
              ),
          },
          {
            path: "product-configuration",
            loadChildren: () =>
              import(
                "./module/product-configuration/product-configuration.module"
              ).then((m) => m.ProductConfigurationModule),
          },
          {
            path: "product",
            loadChildren: () =>
              import("./module/product/product.module").then(
                (m) => m.ProductModule
              ),
          },
          {
            path: "configuration",
            component: ConfigurationComponent,
          },
          {
            path: "categories",
            loadChildren: () =>
              import("./module/category/category.module").then(
                (m) => m.CategoryModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
