
const apiVersion = 'v1';
let backendHost = {
    backendLoginsvc: "",
    backendAPIGWsvc: "",
    backendSecuritysvc: "",
    backendHostName : ""
}
let apiroot = "";

const hostname = window && window.location && window.location.hostname;
backendHost.backendHostName = hostname;
console.log(hostname);

//if(hostname === 'http://hvsuniverse.s3-website-us-east-1.amazonaws.com/')
if (/amazonaws/.test(hostname)) {
    backendHost.backendLoginsvc = 'http://ec2-54-89-25-220.compute-1.amazonaws.com:4001/';
    backendHost.backendAPIGWsvc = 'http://ec2-54-89-25-220.compute-1.amazonaws.com:4003/';
    backendHost.backendSecuritysvc = 'http://ec2-54-89-25-220.compute-1.amazonaws.com:4031/';

}
 else if (/^localhost/.test(hostname)) {
     apiroot = 'http://hvs.selfip.net:4001/';
    backendHost.backendLoginsvc = process.env.REACT_APP_BACKEND_HOST || 'http://hvs.selfip.net:4001/';
    backendHost.backendAPIGWsvc = 'http://hvs.selfip.net:4003/';
    backendHost.backendSecuritysvc = 'http://hvs.selfip.net:4031/';

}
//backendHost.backendLoginsvc = 'http://ec2-54-89-25-220.compute-1.amazonaws.com:4001/';
//backendHost.backendAPIGWsvc = 'http://ec2-54-89-25-220.compute-1.amazonaws.com:4003/';
//backendHost.backendSecuritysvc = 'http://ec2-54-89-25-220.compute-1.amazonaws.com:4031/';
//export const API_ROOT = `${apiroot}`;
console.log(backendHost.backendLoginsvc);
export const   API_ROOT = backendHost;
