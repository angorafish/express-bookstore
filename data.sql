CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  amazon_url TEXT,
  author TEXT,
  language TEXT, 
  pages INTEGER,
  publisher TEXT,
  title TEXT, 
  year INTEGER
);

INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
VALUES ('1234567890', 'http://a.co/eobPtX2', 'Author', 'english', 100, 'Publisher', 'Title', 2020);