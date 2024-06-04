/** Common config for bookstore. */

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql://localhost/books-test";
} else {
  DB_URI = process.env.DATABASE_URL || "postgresql://localhost/books";
}

module.exports = { DB_URI };
