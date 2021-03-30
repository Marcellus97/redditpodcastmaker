### Simple Reddit API client (now with the headers)

This api was forked from the [original](https://github.com/feross/reddit) created by [Feross](https://github.com/feross)

All i Have done is change helper to return both the body and response, so you can get the headers about rate limiting from reddit.

Example:

```js	
const res = reddit.get('/r/Programming/hot', {
	g: 'US',
	count: 0,
	limit: 25,
	show: ''
});

console.log(res.headers);
console.log(res.body);

//headers print the headers, including rate limiting info
//body prints the json response from the reddit api

```
## License

The MIT License. Copyright (c) [Marcellus Mohanna](marcellus.dev).
