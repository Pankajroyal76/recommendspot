import { BaseRequestOptions, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Injectable } from '@angular/core';
import { config } from './config';

@Injectable()
export class ApilinkService extends BaseRequestOptions {
constructor () {
    super();
    //this.headers.append('Auth_Token','MyCustomHeaderValue');
  }
  merge(options?: RequestOptionsArgs): RequestOptions {
    return new CommonRequestOptions(super.merge(extracted(options)));
  }
}

/**
 * for inner merge when using post put patch delete...others method
 */
export class CommonRequestOptions extends RequestOptions {
  merge(options?: RequestOptionsArgs): RequestOptions {
    return new RequestOptions(super.merge(extracted(options)));
  }
}

/**
 * inject default values
 *
 * @param options
 * @returns {RequestOptionsArgs}
 */
export function extracted(options: RequestOptionsArgs) {
  if (!validUrl(options.url)) {
    options.url = config.API_URL +'/'+ (options.url ? options.url : "");
  }

  return options;
}

/**
 * validate url
 *
 * @param url
 * @returns {boolean}
 */
export function validUrl(url: string) {
  return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);
}
