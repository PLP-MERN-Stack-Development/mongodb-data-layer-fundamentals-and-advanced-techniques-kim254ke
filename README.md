# PLP Bookstore Assignment

## Overview
This project uses MongoDB Atlas to manage a bookstore database.  
We practice CRUD operations, queries, aggregation, and indexing.

Database: `plp_bookstore`  
Collection: `books`  

---

## Files
- `insert_books.js` → Adds sample books to the collection  
- `queries.js` → Runs queries, updates, deletions, aggregation, and indexing  

---

## How to Run

1. Install Node.js and the MongoDB driver if not done yet:
```bash
npm install mongodb

## Run the script to add books:
node insert_books.js

## Run the script to perform queries and other operations:
node queries.js

##Check your database in MongoDB Atlas to see the updates.

Notes

##insert_books.js drops the collection if it already exists, so you can safely re-run it

##Queries include finding books by genre, author, year, updating prices, deleting books, sorting, pagination, and aggregation pipelines

##Indexes are created on title and author + published_year for faster searches