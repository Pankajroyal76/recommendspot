import { SeeFriendRecomendationsComponent } from "./see-friend-recomendations.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: SeeFriendRecomendationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeeFriendRecomendationsRoutingModule {}
