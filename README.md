## Project setup

You’ll need to have NodeJS >= 22, npm >= 10 and Docker >= 27 on your machine.
<br>
Move Terminal (or CMD) to the [nestjs-test] directory.

## Install MySQL using docker

Use docker-compose.yml
```bash
docker-compose up -d
```
Or
```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=1 -p 3306:3306 -v mysql-data:/var/lib/mysql -d mysql
```

Use Dbeaver or MySQL Workbench to connect to the mysql container created in docker according to the information below, then create a database named "docker" to use for the test.
```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=1
```
## Install dependencies

```bash
npm install
```


## Migration database

```bash
npm run migration:generate
npm run migration:create
npm run migration:run
npm run migration:revert
```

- The "src/database/mysql/migrations/1737170016188-migration.ts" file is a migration to add the "devices" table and update the relationship with the "locations" table.<br>
- But running "npm run migration:run" is not necessary because all tables and relationships between tables have been set up in "entities".<br>
- After the application starts in development mode, the tables are automatically created and seed data is inserted if the table does not have data.


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## App introduction

- Cron job automatically runs when the app starts, supports Transaction and Rollback.<br>
- There will be 3 APIs to handle Cron status: cron/start (post), cron/stop (post), cron/run-now (post).<br>
- Use Filter to standardize Exception & Interceptor to standardize Response.<br>
- App config prettier and eslint for convention and format code.
