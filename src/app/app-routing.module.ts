import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
var IsLoggedIn = localStorage.getItem('IsLoggedIn');
const routes: Routes = [

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    
    
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    
  },



  {
    path: '',
    loadChildren: () => IsLoggedIn == 'true' ? import("./tabs/tabs.module").then((m) => m.TabsPageModule) : import('./landing-page/landing-page.module').then( m => m.LandingPagePageModule) ,
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
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule),
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
    loadChildren: () => import('./following/following.module').then( m => m.FollowingPageModule)
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
  },
  {
    path: 'landing-page',
    loadChildren: () => import('./landing-page/landing-page.module').then( m => m.LandingPagePageModule),
  },
  {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule),
    canActivate: [AuthGuard] 
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash:true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
