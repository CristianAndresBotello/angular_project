import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "../home/home.component";
import { TrendingDesignsComponent } from "./trending-designs/trending-designs.component";
import { TrendingBundlesComponent } from "./trending-bundles/trending-bundles.component";
import { ProductCardComponent } from "../../shared/products/product-card/product-card.component";
import { AddToCartComponent } from "../../shared/products/resources/add-to-cart/add-to-cart.component";
import { RatingComponent } from "../../shared/products/resources/rating/rating.component";
import { ViewLikeComponent } from "../../shared/products/resources/view-like/view-like.component";
import { ProductInformationComponent } from "../../shared/products/resources/product-information/product-information.component";

@NgModule({
  declarations: [
    HomeComponent,
    TrendingDesignsComponent,
    TrendingBundlesComponent,
    ProductCardComponent,
    AddToCartComponent,
    RatingComponent,
    ViewLikeComponent,
    ProductInformationComponent
  ],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
