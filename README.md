# fhem-connect.js

## About

In order to let cloud services (e.g. [IFTTT](http://IFTTT.com)) communicate with [FHEM](http://fhem.org), you have to open a port in you home router. 
There are configurations where this is not possible or not wanted.

In this case, you can use fhem-connect.js with fhem.js.

It works like this:

![Overview image][logo]

[logo]: overview.png "Overview image"

## Step-By-Step
### registering on heroku.com
* click "sign up for free" on https://www.heroku.com/
* Enter the information asked for and choose "Node.js" as primary language
* Click "Create free Account"
* Wait for the confirmation email and click on the confirmation link
* choose a password and log in

### register on Github

* go to http://github.com and register for a free account
* verify you emailaddress
* go to https://github.com/MarcProe/fhem-connect.js and click "Fork" (upper right)

### starting fhem-connect.js
* click on "create new app"
* choose a name and a location near you
* click "create app"
* click on "Deploy"", then "Guthub", then "Connect to Github"
* authorize heroku on github
* click on "search", then "connect" next to the fhem-connect.js project
* on the bottom of the page, choose a release branch, and the "Deploy Branch"
* on the top of the page, click "more", then "View logs" to see whats happening

**you're done!**

