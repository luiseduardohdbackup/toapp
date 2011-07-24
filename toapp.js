/*
 * ToApp - redirect your iPhone and Android users to your mobile app
 * 
 * (c) Infinum Ltd, 2011
 */
var ToApp = {
  USER_AGENTS: [
    { type: 'iphone', regexp: /iPhone/ },
    { type: 'android', regexp: /Android/ },
    { type: 'ipad', regexp: /iPad/ } // currently only for choice type "prompt" 
  ],
  
  DEFAULT_CONFIG: {
    choice: 'lightbox',
    confirm_text: 'Install app',
    reject_text: 'Continue to website',
    title: 'This website has a mobile application. Would you like to install it?'
  },
  
  // init ToApp. For a sample and configuration options, view the Readme
  init: function(config){
    // ToApp.util.eraseCookie('toapp_user_action') // for debugging on phone uncomment this
    
    if(ToApp.util.readCookie('toapp_user_action') != 'skip'){
      if(/Webkit/i.test(navigator.userAgent)){
        var _timer=setInterval(function(){
        if(/loaded|complete/.test(document.readyState)){
          clearInterval(_timer)
          ToApp.start(config)
        }}, 10)   
      }          
    }
  },
  
  // check the User Agent against USER_AGENTS. 
  start: function(global_config){
    var forced_type = ToApp.check_for_forced_type()
    
    for (var i=0; i<ToApp.USER_AGENTS.length; i++) {
      if( navigator.userAgent.match(ToApp.USER_AGENTS[i].regexp) || forced_type == ToApp.USER_AGENTS[i].type ){
        // get the configuration for this specific user agent variation
        var config = global_config.variations[ToApp.USER_AGENTS[i].type]
        config.type = ToApp.USER_AGENTS[i].type
        global_config.variations = null

        // merge with global (root) values
        config = ToApp.util.merge(config, global_config)        
        // add type forcing if needed
        config = ToApp.util.merge(config, {type: forced_type})
        // merge with default values
        config = ToApp.util.merge(config, ToApp.DEFAULT_CONFIG)        
        // run the action for the prefered choice type
        ToApp[config.choice](config)        
      }
    }
  },
  
  // generate and show a lightbox-like div over the website. Additional styling provided via toapp.css
  lightbox: function(config){
    // prefer generating HTML like this, as opposed to document.createElement, easier to maintain and read
    var html = "";
    html+= '<div id="toapp" class="' + config.type + '">'
    html+= '  <div id="toapp_window">'
    html+= '    <h1>' + config.title + '</h1>'
    if(config.description){
      html+= '  <p>' + config.description + '</p>';      
    }
    html+= '    <a href="javascript:;" id="toapp_confirm_link">' + config.confirm_text + '</a>'
    html+= '    <a href="javascript:;" id="toapp_reject_link">' + config.reject_text + '</a>'
    html+= '  </div>'
    html+= '</div>'
    
    document.getElementsByTagName('body')[0].innerHTML += html
    
    document.getElementById('toapp_confirm_link').onclick = function(){
      ToApp.redirect_to_store(config)
    }    
    
    document.getElementById('toapp_reject_link').onclick = function(){
      document.getElementById('toapp').outerHTML = ''
      ToApp.skip(config)
    }
  },
  
  // popup the browser native prompt window, much simpler and gives a native look and feel, though without styling and description
  prompt: function(config){
    var choice = confirm(config.title)
    if(choice){
      ToApp.redirect_to_store(config)
    }else{
      ToApp.skip(config)
    }
  },
  
  // redirect the user to the store for app download
  redirect_to_store: function(config){
    ToApp.setCookie()
    ToApp.runHandler(config, 'onConfirm')
    window.location = config.url
  },
  
  // skip prompting the user next time
  skip: function(config){
    ToApp.runHandler(config, 'onReject')
    ToApp.setCookie()
  },
  
  // set the cookie and not bug the user the next time
  setCookie: function(){
    ToApp.util.createCookie('toapp_user_action', 'skip')  
  },
  
  runHandler: function(config, handler){
    if(config[handler])
      config[handler]()
  },
  
  // add ?iphone=1 or ?android=1 to the URL to force ToApp to appear. Useful for debugging and development
  check_for_forced_type: function(){
    var forced_type = null
    for (var i=0; i<ToApp.USER_AGENTS.length; i++) {
      if(window.location.toString().match(ToApp.USER_AGENTS[i].type + '=1'))
        forced_type = ToApp.USER_AGENTS[i].type
    }
    return forced_type    
  },  
  
  util: {
    // extend obj1 with values from obj2 only if they are not defined in obj1
    merge: function(obj1, obj2){
      for (prop in obj2) { 
         if (prop in obj1) { continue; }
         obj1[prop] = obj2[prop];
      }  
      return obj1
    },
    
    // cookie manipulation methods, courtesy of http://www.quirksmode.org/js/cookies.html
    createCookie: function(name,value,days) {
    	if (days) {
    		var date = new Date();
    		date.setTime(date.getTime()+(days*24*60*60*1000));
    		var expires = "; expires="+date.toGMTString();
    	}
    	else var expires = "";
    	document.cookie = name+"="+value+expires+"; path=/";
    },

    readCookie: function(name) {
    	var nameEQ = name + "=";
    	var ca = document.cookie.split(';');
    	for(var i=0;i < ca.length;i++) {
    		var c = ca[i];
    		while (c.charAt(0)==' ') c = c.substring(1,c.length);
    		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    	}
    	return null;
    },

    eraseCookie: function(name) {
    	ToApp.util.createCookie(name,"",-1);
    }
  }  
}