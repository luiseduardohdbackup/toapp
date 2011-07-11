# ToApp

The most efficient and cheapest way to market your mobile app - get the visitors accessing your website from a smartphone to download the app from the appropriate Application store.

# The idea

You've built a mobile app related to your website or web service. How do you get people to install the app on their phones?

You can put up banners all over your site, but people don't notice them. You can write articles promoting your apps, but that's mostly a one time thing.

The simplest and most intelligent way would be to go after the people that are already visiting your site, and if they're accessing your site with their smartphones, offer them a link to the appropriate app store for download.

# How does it work

When the user visits your webpage with their smartphone, they're offered a popup asking the user to download the app. If they accept, they're taken to the app store. If they refuse, nothing happens.

In any case, ToApp doesn't bug the user to download the app more than once - preferences are stored using the browsers cookie.

# Who created this and why?

The fine men and women (ok, mostly men) at [Infinum](http://www.infinumdigital.com). This technique was deployed on a recent mobile project we've worked on, and the results were staggering.

![ToApp statistics](http://labs.infinum.hr/toapp/toapp_statistics.png)

After implementing AppStore redirection, we received a 6x increase in new users, all for free.

# Install

Add the following code to the <tt><head></tt> section of your site.
    
    <script type="text/javascript" src="toapp.js"></script>
    <link href="toapp.css" rel="stylesheet" type="text/css" /> 


# Usage

After including <tt>toapp.js</tt> and <tt>toapp.css</tt>, run the following line the hook-up ToApp to the page loading process:

    ToApp.init({  
      variations: {
        iphone: {
          url: "http://itunes.apple.com/hn/app/24sata-hr/id442399892?mt=8",      
        }
      }
    })
    
The <tt>ToApp.init()</tt> method receives a configuration object as the only parameter. This configuration object has a couple of options:

* title: Used as the title for the popup the user receives
* description: [optional] Used only in "lightbox" mode, explain to your users what they are actually downloading.
* variations: All variations (like iPhone or Android) you wish to support. Each variation has it's own configuration options.
* choice: Possible values include "lightbox" and "prompt". See examples below.
* confirm_text: The text for the "Install app" button
* reject_text: The text for the "Continue to website" button

Each variation in the variations has several options:

* url [mandatory]: The url to the app in the app store
* title: Same as global title, only per-variation specific
* description: Same as global description, only per-variation specific
* choice: Same as global choice, only per-variation specific
* confirm_text: Same as global confirm_text, only per-variation specific
* reject_text: Same as global reject_text, only per-variation specific

# Examples

One of the configuration options is the <tt>choice</tt> parametar with 2 values - "lightbox" and "prompt".

Lightbox generates HTML content that you can style via <tt>toapp.css</tt>, and looks like this:

![ToApp popup](http://labs.infinum.hr/toapp/toapp_screen_lightbox.png)

Prompt uses the browser native popup, doesn't use any description text, and looks like this:

![ToApp popup](http://labs.infinum.hr/toapp/toapp_screen_prompt.png)

Here is an example of some particulary complex configuration code that uses lightbox and a description on the iPhone, but a prompt on the Android:

    ToApp.init({  
      title: "Download our awesome mobile app",
      variations: {
        iphone: {
          description: "This is app is awesome. You want this app. You NEED this app",
          url: "http://itunes.apple.com/hn/app/24sata-hr/id442399892?mt=8",      
          confirm_text: "Yes, I NEED it!",
          reject_text: "No, I don't"
        },
        android: {
          title: "I want a different title for android!",
          url: "market://details?id=com.infinum.dvadesetcetirisata"
        }
      }
    })

# Misc

Here is a picture of nera the dog, our office dog.

![Nera the dog](http://labs.infinum.hr/toapp/nera.jpg)

[Nera the dog](http://www.facebook.com/nera.the.dog)

# TODO

* full iPad support (currently something's screwy with the CSS on the ipad, choice 'prompt' works fine)
* Specific Android device targeting