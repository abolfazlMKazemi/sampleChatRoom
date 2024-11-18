# Project Setup Instructions

Follow these steps to set up and run the project on your local environment.

---

## 1. Run PostgreSQL

You can either install PostgreSQL directly on your system or use Docker to run it. To run it on Docker, execute the following command:

```bash
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=42387373 \
  -e POSTGRES_DB=novindev \
  -p 5432:5432 \
  postgres:latest
```

This will start a PostgreSQL container with:

- **Username:** `root`
- **Password:** `42387373`
- **Database:** `novindev`
- **Port:** `5432`

---

## 2. Run Redis

Make sure Redis is available on your system. You can either install Redis or use Docker. To run Redis on Docker, execute the following command:

```bash
docker run -d \
  --name redis-server \
  -e ALLOW_EMPTY_PASSWORD=yes \
  -p 6379:6379 \
  redis:latest
```

This will start a Redis container on port `6379`.

---

## 3. Configure Environment Variables

- Locate the `sample.env` file in the project root.
- Create a `.env` file based on the `sample.env` template.
- Update the environment variable values to match your setup.

### Example `.env` file:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=root
DATABASE_PASSWORD=42387373
DATABASE_NAME=novindev

REDIS_HOST=localhost
REDIS_PORT=6379

EXPIRE_IN_ACCESS_KEY=5h
EXPIRE_IN_REFRESH_KEY=7d
JWT_SECRET_ACCESS_KEY=42387373
JWT_REFRESH_SECRET_KEY=42387373

APPLICATION_PORT=3002
```

---

## 4. Start the Project

To start the project, navigate to the root directory of the project and run the following command:

```bash
npm run start
```

This will start the project in development mode.

---

## 5. Access Swagger Documentation

Once the project is running, you can access the Swagger API documentation at:

```
http://localhost:3002/api
```

Replace `localhost` and `3002` with your setup values if you've changed the `APPLICATION_PORT` or host.

---

## Notes

- Ensure Docker is installed and running on your system if you plan to use Docker for PostgreSQL and Redis.
- For further customization, refer to the project configuration files.
