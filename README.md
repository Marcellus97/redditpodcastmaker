# Reddit Podcast Maker
- makes an mp3 podcast out of reddit posts
- Choose your favorite posts from any subreddit
- text to speech reads posts and comments for you

## Tools and Resources Used
- Node
    - express - server
    - [reddit-with-headers](https://www.npmjs.com/package/reddit-with-headers) - reddit api wrapper on npm that i published
        - I forked an existing repo and altered it to return the json response AND the response headers. This is because reddit sends info about rate limiting in these headers, which can be useful to know. This was my first ever published npm package!
    - gtts - wrapper for google text to speech tool
    - swagger - An wrapper for OpenAPI doc generator
- [Reddit API](https://www.reddit.com/dev/api/)


## Current Status
Currently making this into a webapp, although this could very well just be a command line tool.
This is a work in progress, and there are a few things that still need done:

- API parameter validation. express-validation will be used here.
- Complete coverage of API edgecases and appropriate responses for these cases. For example, if there is an error in the reddit api, (Maybe my account got rate limited for example) then this needs to relayed.
- Fill out more info for API docs in swagger
- More stylish ui for the web app 

## Installation and Testing
Just clone the repo, and use "npm run dev" to start the server.

I use browser-sync to serve my html file to myself on localhost, although any local static file server will do.


