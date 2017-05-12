import cookie from 'cookie';

export default function cookieParser(req, res, next){
	req.getParamFromCookie = getParamFromCookie;
	req.getValueFromCookie = getValueFromCookie;
	res.setParamToCookie = setParamToCookie;
	res.removeParamFromCookie = removeParamFromCookie;
	return next();
}


function serialize_cookie_obj(cookie_object){
	let cookie_string = '';
	for(const key in cookie_object){
	cookie_string += `${key}=${cookie_object[key]};`;
	}
	return cookie_string;
};

function setParamToCookie(cookie_name, key, value, time){
	// this is current response
	if(!this.req.cookies[cookie_name])
	this.req.cookies[cookie_name]='{}';

	const cookie_str = this.req.cookies[cookie_name];
	var cookies = cookie.parse(cookie_str);
	cookies[key] = value;
	const serialized_cookie = serialize_cookie_obj(cookies);
	this.req.cookies[cookie_name] = serialized_cookie;

	const options = {path: '/', http: false}; //TODO:put domain

	if(time != 0){
	options.expires = new Date((Date.now())+ (time * 86400000));
	}

	this.cookie(cookie_name, serialized_cookie, options);
};

function removeParamFromCookie(cookie_name, key, time){
	// this is current response
	const cookie_string = this.req.cookies[cookie_name];
	if (!cookie_string){
	return false;
	}
	var cookies = cookie.parse(cookie_string);
	delete cookies[key];
	const serialized_cookie = serialize_cookie_obj(cookies);
	this.req.cookies[cookie_name] = serialized_cookie;
	const options = {path: '/', http: false};//TODO:domain
	if(time !== 0){
	options.expires = new Date((Date.now())+ (time * 86400000));
	}
	this.cookie(cookie_name, serialized_cookie, options);
};

function getParamFromCookie(cookie_name, key){
	// this is current request
	const cookie_string = this.cookies[cookie_name];
	if (!cookie_string){
	return false;
	}
	const cookie_object = cookie.parse(cookie_string);
	return cookie_object[key];
};

function getValueFromCookie(cookieKey){
	if(this.cookies[cookieKey]){
	return  this.cookies[cookieKey];
	}
	return null;
}

