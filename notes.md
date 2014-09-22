myxtape 
-------

"the greatest cms, is no cms" - me. 



"content" can broadly be said to have the following properties.

- has some metadata relating to the 'nature' of the document. these are simple key value pairs. we assume this to be yaml front matter

- has a body. this is a string. the 'type' of this string can be defined in the yaml.

- this body can be of any format. markdown, json, yaml, html, jsx(!!!) whatever

- _alternately_, use jsx + a list of 'known tags', to generate type/props/children json trees 

- groups of content are common. we call these 'collections'

# - content from one collection could link to content in another

- all these collections must be searchable. all the data, metadata, all of it.



- there needs to exist a topnotch development story for this 


the solution is to provide hammers, blueprints, and concrete. 


store - a simplified key vaue store. sqlite in development, mysql for anything else. comes with scripts for quickly setting up/tearing down tables 	

compile - converts strings into json, based on format. ideally node only. 

client - store + compile - using the store, sets up a configurable get/set/query api, that compiles down to json

transformers - asynchronous tree walkers that convert the json to whatever you please. comes with a bunch of useful defaults. 

routes - configurable routes that setup http api endpoints for get/set/query/compile(!) on the content clients. customize to your heart's desire. includes admin!

http - js client to talk to said http endpoints

admin - a configurable express/react app to quickly list, find, edit(!), save, publish(?) content collections. included in routes(!)


bloom - todo - a generic bloom filter that implements counter,s ttls, and whatnot 

search - todo - feed json into elastic search, and expose it's http api. BOOM. 

history - todo - store diffs. lightweight git, somewhat

samples - android/ios/web layouts (!)



etcetera -

- this is the tricky part - based on who's asking, content could appear differently. 


