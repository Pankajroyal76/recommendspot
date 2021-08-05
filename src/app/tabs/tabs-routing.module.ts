import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { AuthGuard } from "../services/auth.guard";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("../home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "saved",
        loadChildren: () =>
          import("../saved-posts/saved-posts.module").then(
            (m) => m.SavedPostsPageModule
          ),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("../profile/profile.module").then((m) => m.ProfilePageModule),
      },
      {
        path: "following",
        loadChildren: () =>
          import("../following/following.module").then(
            (m) => m.FollowingPageModule
          ),
      },
      {
        path: "add-recommendation",
        loadChildren: () =>
          import("../add-recommendation/add-recommendation.module").then(
            (m) => m.AddRecommendationPageModule
          ),
      },
      {
        path: "notification",
        loadChildren: () =>
          import("../notification/notification.module").then(
            (m) => m.NotificationPageModule
          ),
      },
      {
        path: "addlocalrecommendation",
        loadChildren: () =>
          import(
            "../addlocalrecommendation/addlocalrecommendation.module"
          ).then((m) => m.AddlocalrecommendationPageModule),
      },
      {
        path: "add-recommend",
        loadChildren: () =>
          import("../add-recommend/add-recommend.module").then(
            (m) => m.AddRecommendPageModule
          ),
      },
      {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/home",
    canActivate: [AuthGuard],
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
