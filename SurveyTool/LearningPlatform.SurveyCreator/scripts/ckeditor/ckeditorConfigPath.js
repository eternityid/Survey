var CLIENTAPP_BASEPATH = '/* @echo SURVEY_CREATOR_URL */';
var CKEDITOR_BASEPATH = CLIENTAPP_BASEPATH + 'ckeditor/';
var CKEDITOR_CUSTOMPLUGINS_BASEPATH = CLIENTAPP_BASEPATH + 'ckeditor/plugins/';

/* @ifndef SURVEY_CREATOR_URL */
CLIENTAPP_BASEPATH = window.location.protocol + '//' + window.location.host + window.location.pathname;
CKEDITOR_BASEPATH = window.location.protocol + '//' + window.location.host + '/thirdParties/ckeditor/';
CKEDITOR_CUSTOMPLUGINS_BASEPATH = window.location.protocol + '//' + window.location.host + '/scripts/ckeditor/plugins/';
/*@endif*/

