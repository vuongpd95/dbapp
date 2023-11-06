# Setup the environment variables

Create the .env file in dbapp
```terminal
cd dbapp
touch .env
```
Add these variables to your .env file

```
PORT=9000
DB_USER='postgres'
DB_PASSWORD='your-password'
DB_HOST='localhost'
DB_PORT=5432
DB_NAME='postgres'
```

# Start the app

```js
node app.js
```
