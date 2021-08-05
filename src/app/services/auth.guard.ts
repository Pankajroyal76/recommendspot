// Angular
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
// RxJS
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiserviceService } from "./apiservice.service";
// NGRX

@Injectable()
export class AuthGuard implements CanActivate {
  errors: any = ["", null, undefined, "undefined", "null"];
  constructor(private router: Router, public apiService: ApiserviceService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
    // if (!this.apiService.gettoken()) {
    //   this.router.navigateByUrl("/");
    // }
    // return this.apiService.gettoken();

    var token = localStorage.getItem("userId");
    if (this.errors.indexOf(token) == -1) {
      return true;
    } else {
      this.apiService.presentToast("Please Login To Access Page", "danger");
      return this.router.navigate(["/landing-page"]);
    }
  }
}
