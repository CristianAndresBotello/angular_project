import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SearchComponent } from "./search/search.component";
import { HeaderComponent } from "./header.component";
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HeaderComponent, SearchComponent, MenuComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
