//var MAIN_URL = 'http://3.138.151.178';
var MAIN_URL = 'https://recommendspot.com';
var MAIN_URL_PORT = '3001';
//var MAIN_URL_PORT = '3003';
var SOCKET_URL_PORT = '3002';

export const config = {
  	API_URL : MAIN_URL+':'+MAIN_URL_PORT,
  	ENC_SALT: 'gd58_N9!ysS',
  	BASE_URL: MAIN_URL+'/',
  	IMAGES_URL: MAIN_URL+':'+MAIN_URL_PORT,
  	IMAGE_EXTENSIONS: ['image/png','image/jpg','image/jpeg','image/gif','image/bmp','image/webp'],
    errors: ['', null, undefined, 'undefined', 'null']
};



export const social_config = {
  	FACEBOOK_ID: '1258918517636754',
  	GOOLGLE_CLIENT_ID: '6931280620-93qt1j81vl7n3k9j25339ji5uqdsj1h2.apps.googleusercontent.com'
};

export const socket_config = {
  	SOCKET_URL: MAIN_URL+':'+SOCKET_URL_PORT,
}; 

