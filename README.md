My first FlyRank assignment.
A "to do list".
This is a complete web loop. Full CRUD integrated system.
It fetches all the tasks, creates a task and adds it to the list, can fetch a singular task using its id, delete a task from the list and update a task's values.

To run this:
bash:
npm install && "npm start" or "node ./server.js"

Curl: 
curl -X 'GET' \
  'http://localhost:3000/tasks' \
  -H 'accept: */*'


<img width="1410" height="733" alt="image" src="https://github.com/user-attachments/assets/f6f24c18-fee3-4854-82e5-0c6ad938571a" />



<img width="1912" height="781" alt="image" src="https://github.com/user-attachments/assets/85e7ac49-e4b3-41e9-a62c-7a9af1698779" />

# WHY SQLITE WAS CHOSEN

It was chosen because it only requires a single file, works as a standard database (retains data after restart), and requires no additional setup. 

# WHERE DATA LIVES

Data lives in "tasks.db". It is a locally created SQLITE file. It is created automatically on the first startup. 

<img width="632" height="577" alt="image" src="https://github.com/user-attachments/assets/ba268b16-d98c-49be-9560-7c0df78d27ca" />

# Database Setup (PostgreSQL)

To start the PostgreSQL database container with persistent data:

```bash
docker run --name taskdb -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=tasks -p 5432:5432 -v taskdata:/var/lib/postgresql/data -d postgres


# Task Management REST API

A containerized CRUD REST API for managing tasks built with Node.js, Express, and PostgreSQL.

---

## Quick Start (One Command)

### 1. Environment Setup
Copy the example environment configuration:
```bash
cp backend/.env.example backend/.env

# One-Line Start

docker compose up --build

#API
http://localhost:3000/tasks