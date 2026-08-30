import Database from "better-sqlite3"; 

const db = new Database("tasks.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0

    )
    `);


const countResult = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if(countResult.count === 0){
    const insertTask = db.prepare("INSERT INTO tasks (title, done) VALUES(?, ?)");

    const seed = db.transaction(() => {
        insertTask.run("Learn SQL", 0);
        insertTask.run("Read Documentation", 0);
        insertTask.run("Prepare database", 1);
    });

    seed();
    console.log("Database seeded with data");
    

}

export default db;