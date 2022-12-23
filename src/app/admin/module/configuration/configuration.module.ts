import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { NgbAccordionModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularEditorModule } from "@kolkov/angular-editor";

// Modules
import { CoreModule } from "../../core/core.module";

// Components
import { ConfigurationComponent } from "../configuration/configuration.component";
import { DesignWebComponent } from "./design-web/design-web.component";
import { EmailAddressesComponent } from "./email-addresses/email-addresses.component";
import { GeneralComponent } from "./general/general.component";
import { PaymentMethodsComponent } from "./payment-methods/payment-methods.component";

@NgModule({
  declarations: [
    ConfigurationComponent,
    DesignWebComponent,
    EmailAddressesComponent,
    GeneralComponent,
    PaymentMethodsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbAccordionModule,
    AngularEditorModule,
    CoreModule,
  ],
})
export class ConfigurationModule {}
