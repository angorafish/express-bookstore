const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeEach(async () => {
  await db.query("DELETE FROM books");
  await db.query(`
    INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
    VALUES ('1234567890', 'http://a.co/eobPtX2', 'Author', 'english', 100, 'Publisher', 'Title', 2020)
  `);
});

afterAll(async () => {
  await db.end();
});

describe("GET /books", () => {
  test("Get a list of books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("books");
  });
});

describe("GET /books/:isbn", () => {
  test("It should respond with details of a single book", async () => {
    const response = await request(app).get("/books/1234567890");
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toHaveProperty("isbn");
  });
  
  test("It should return 404 for nonexistent book", async () => {
    const response = await request(app).get("/books/nonexistingisbn");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /books", () => {
  const newBook = {
    isbn: "0987654321",
    amazon_url: "http://a.co/eobPtX2",
    author: "Test Author",
    language: "english",
    pages: 123,
    publisher: "Test Publisher",
    title: "Test Title",
    year: 2021,
  };

  test("It should create a new book", async () => {
    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toHaveProperty("isbn");
  });

  test("It should return 400 for invalid data", async () => {
    const invalidBook = { ...newBook, year: "invalid-year" };
    const response = await request(app).post("/books").send(invalidBook);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
  });
});

describe("PUT /books/:isbn", () => {
  const updatedBook = {
    amazon_url: "http://a.co/eobPtX2",
    author: "Updated Author",
    language: "english",
    pages: 456,
    publisher: "Updated Publisher",
    title: "Updated Title",
    year: 2022,
  };

  test("It should update an existing book", async () => {
    const response = await request(app).put("/books/1234567890").send(updatedBook);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toHaveProperty("isbn");
    expect(response.body.book.author).toBe("Updated Author");
  });

  test("It should return 404 for a non-existing book", async () => {
    const response = await request(app).put("/books/nonexistingisbn").send(updatedBook);
    expect(response.statusCode).toBe(404);
  });

  test("It should return 400 for invalid data", async () => {
    const invalidBook = { ...updatedBook, year: "invalid-year" };
    const response = await request(app).put("/books/1234567890").send(invalidBook);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
  });
});

describe("DELETE /books/:isbn", () => {
  test("It should delete an existing book", async () => {
    const response = await request(app).delete("/books/1234567890");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });

  test("It should return 404 for a non-existing book", async () => {
    const response = await request(app).delete("/books/nonexistingisbn");
    expect(response.statusCode).toBe(404);
  });
});
