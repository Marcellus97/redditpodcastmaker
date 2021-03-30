const express = require('express');
const path = require('path')
const fs = require('fs');
const app = express();

// local imports
const reddit = require('./reddit')
const tts = require('./tts')
const swagger = require('./swagger');

app.use(express.json());
app.listen(4000);


app.use('/docs', swagger.serve, swagger.setup(swagger.specs));


// Might be better suited as a post method, but we delete all trace of user data afterwards anyway... 
/**
 * @swagger
 * /generateMp3:
 *      post:
 *          descpription: generates mp3 from entered podcast name, post ids, and comment limits.
 *          responses:
 *              200:
 *                  description: returns mp3 file.
 *              400:
 *                  description: incorrect request body syntax.
 *              503:
 *                  description: reddit api rate limiting. Wait a minute...
 */
app.post("/generateMp3", function(request, response, next) {
    /*
    const {
        filename : 
        fullNames : [],
        commentLimit: 0,
        language:'',
    } = request.body;
    */
   
    const params = request.body;
    console.log(params)
    
    // use ip for filename just incase of naming conflicts. strip periods
    const filename = params.filename.replace('.', '') + '.mp3';

    // use helper method to unpack json object of reddit posts to stringify it
    const speech = 'this is just test text';
    // const speech = stringifyRedditPosts();
    tts.generateMp3(filename, speech);

    var filePath = path.join(__dirname, filename);
    response.download(filePath, function(err) {
       // delete file here once the file is done
       fs.unlink(filePath, ()=> {
           console.log(`deleting ${filePath}`);
        });
    }); 
});

/**
 * @swagger
 * /searchforsubreddits:
 *      get:
 *          descpription: finds matching subreddits similar to query
 *          responses:
 *              200:
 *                  description: returns a list reddit subreddits
 *              400:
 *                  description: incorrect parameter syntax.
 *              503:
 *                  description: reddit api rate limiting. Wait a minute...
 */
app.get('/searchforsubreddits', async (request, response, next) => {
    console.log(response.body);
    const search = {
        q : request.body.q,
        limit : request.body.limit
    };
    data = await reddit.getSearchForSubs(search);
    response.send(data.body);
    console.log(request.ip);
});

/**
 * @swagger
 * /hot/{subreddit}:
 *      get:
 *          descpription: finds posts inside desired subreddit with 'hot' sort order
 *          responses:
 *              200:
 *                  description: returns a list reddit posts
 *              400:
 *                  description: incorrect parameter syntax.
 *              503:
 *                  description: reddit api rate limiting. Wait a minute...
 */
app.get('/hot/:subreddit', async (request, response, next) => {
    const subreddit = request.params.subreddit;
    const data = await reddit.getHot(subreddit);
    response.send(data.body);
});

/**
 * @swagger
 * /top/{subreddit}:
 *      get:
 *          descpription: finds posts inside desired subreddit with 'top' sort order
 *          responses:
 *              200:
 *                  description: returns a list reddit posts
 *              400:
 *                  description: incorrect parameter syntax.
 *              503:
 *                  description: reddit api rate limiting. Wait a minute...
 */
app.get('/top/:subreddit', async (request, response, next) => {
    const subreddit = request.params.subreddit;
    data = await reddit.getTop(subreddit);
    response.send(data.body);
});


// This endpoint may not be needed by the end user
/**
 * @swagger
 * /ids/[names]:
 *      get:
 *          descpription: gets posts from array of post ids
 *          responses:
 *              200:
 *                  description: returns a list reddit posts with matching ids
 *              400:
 *                  description: incorrect parameter syntax.
 *              503:
 *                  description: reddit api rate limiting. Wait a minute...
 */
app.get('/ids/:names', async (request, response, next) => {
    const names = request.params.names;
    data = await reddit.getById(names);
    console.log(reddit.getRateLimit(data.headers))
    response.send(data.body);
});

/**
 * @swagger
 * /languages:
 *      get:
 *          descpription: returns list of languages supported by text to speech
 *          responses:
 *              200:
 *                  description: returns a list languages
 *              503:
 *                  description: reddit api rate limiting. Wait a minute...
 */
app.get('/languages', async (request, response, next) => {
    const langs = await tts.getLanguages();
    response.send(langs);
});
