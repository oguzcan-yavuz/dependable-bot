### Running Locally

```
npm run docker:up
npm run start
```

Swagger is at => [`http://localhost:3000/api`](http://localhost:3000/api)

### TODO:

- Strict types on job payloads
- Graceful shutdown isn't working with redis/bull for some reason. Maybe the delayed queue needs advanced configuration for handling connection errors.
- Increase the test coverage
