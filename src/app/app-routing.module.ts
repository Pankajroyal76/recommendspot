import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: "posts",
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
     canActivate: [AuthGuard] 
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'posts',
    loadChildren: () => import('./post/post.module').then( m => m.PostPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
     canActivate:[AuthGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule),
     canActivate:[AuthGuard]
  },

  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'profile-setting/:id',
    loadChildren: () => import('./profile-setting/profile-setting.module').then( m => m.ProfileSettingPageModule),
  },
  {
    path: 'following',
    loadChildren: () => import('./following/following.module').then( m => m.FollowingPageModule),
     canActivate:[AuthGuard]
  },
  {
    path: 'add-recommendation',
    loadChildren: () => import('./add-recommendation/add-recommendation.module').then( m => m.AddRecommendationPageModule),
  },
  {
    path: 'post-details',
    loadChildren: () => import('./post-details/post-details.module').then( m => m.PostDetailsPageModule),
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule),
  },
  {
    path: 'edit-reccomendation',
    loadChildren: () => import('./edit-reccomendation/edit-reccomendation.module').then( m => m.EditReccomendationPageModule),
  },
  {
    path: 'followingfollowers',
    loadChildren: () => import('./followingfollowers/followingfollowers.module').then( m => m.FollowingfollowersPageModule)
  },  {
    path: 'landing-page',
    loadChildren: () => import('./landing-page/landing-page.module').then( m => m.LandingPagePageModule)
  },
  {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash:true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
