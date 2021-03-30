const Reddit = require('reddit-with-headers');
const fs = require('fs');

/**
 * Everything here is implemented according to the official Reddit API
 * https://www.reddit.com/dev/api/
 */

const secretfile = fs.readFileSync('secret.json');
const secretjson = JSON.parse(secretfile);

const reddit = new Reddit({
  username: secretjson.username,
  password: secretjson.password,
  appId: secretjson.id,
  appSecret: secretjson.secret,
  userAgent: secretjson.agent
});

async function getHot(subreddit, params) {
    return reddit.get(`/r/${subreddit}/hot`, params);
}

async function getTop(subreddit, params) {
    return reddit.get(`/r/${subreddit}/top`, params);
}
 

async function getSearchForSubs(params) {
    return reddit.get(`/subreddits/search`, params);
}

async function getById(names) {
    return reddit.get(`/by_id/${names}`);
}

// use this after getting a response from the reddit api
function getRateLimit(headers) {
    return {
        remaining: headers['x-ratelimit-remaining'],
        used: headers['x-ratelimit-used'],
        reset: headers['x-ratelimit-reset']
    }
}

exports.getHot = getHot;
exports.getTop = getTop;
exports.getSearchForSubs = getSearchForSubs;
exports.getById = getById;
exports.getRateLimit = getRateLimit;