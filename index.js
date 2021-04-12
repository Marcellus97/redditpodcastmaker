const express = require('express');
const cors = require('cors')
const path = require('path')
const fs = require('fs');

// local imports
const reddit = require('./reddit')
const tts = require('./tts')
const swagger = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());
// swagger
app.use('/docs', swagger.serve, swagger.setup(swagger.specs));
app.listen(4000);


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
        podcastName : 
        fullNames : [],
        language:'',
    } = request.body;
    */

    //TODO
    //Need to store and parse these posts somehow
    //By parse, i mean get post text and comments, and stick them in one object
    // {posts : [{title, selftext, comments:[] }, ...] }
    const params = request.body;
    console.log(params);
    const posts = reddit.getById(params.fullNames);
    console.log(params.fullNames);
    posts.then(data => {
        let fullPosts = data.body.data.children;
        console.log(fullPosts);
    });
    //const parsedPosts = reddit.parsePosts();
    
    // use ip for filename just incase of naming conflicts. strip periods
    const podcastName = params.podcastName.replace('.', '') + '.mp3';

    // use helper method to unpack json object of reddit posts to stringify it
    const speech = 'this is just test text';
    // const speech = stringifyRedditPosts();
    tts.generateMp3(podcastName, speech);

    var filePath = path.join(__dirname, podcastName);
    response.download(filePath, function(err) {
       // delete file here once the file is done

       /*
        fs.unlink(filePath, ()=> {
           console.log(`deleting ${filePath}`);
        });
        */
    }); 
    response.send('done');
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
    const search = {
        q : request.query.q,
        limit : 25
    };
    const data = await reddit.getSearchForSubs(search);
    const children = data.body.data.children;
    let subreddits = [];
    children.forEach(element => subreddits.push({
        id: element.data.name,
        title: element.data.title,
        displayName: element.data.display_name_prefixed 
    }));

    //response.send(data);
    response.send({subreddits: subreddits});

    const headers = reddit.getRateLimit(data.headers);
    console.log(headers.remaining);
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
    
    const children = data.body.data.children;
    let posts = [];
    children.forEach(element => posts.push({
        id: element.data.name,
        title: element.data.title,
    }));
    response.send({posts: posts});
    const headers = reddit.getRateLimit(data.headers);
    console.log(headers.remaining)
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
    const data = await reddit.getTop(subreddit);

    const children = data.body.data.children;
    let posts = [];
    children.forEach(element => posts.push({
        id: element.data.name,
        title: element.data.title,
    }));
    response.send({posts: posts});
    const headers = reddit.getRateLimit(data.headers);
    console.log(headers.remaining)
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
    const headers = reddit.getRateLimit(data.headers);
    console.log(headers.remaining)
});

async function getIds(request, response, next) {

}
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
