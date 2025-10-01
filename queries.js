const { MongoClient } = require("mongodb");

// Use your Atlas connection string
const uri = "mongodb+srv://Mernstack:Antony6497@mern-july.e211xod.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // connect to database and collection
    const db = client.db("plp_bookstore");
    const books = db.collection("books");

    console.log("BASIC CRUD ");

    // 1. Find all books in Fiction genre
    const fiction = await books.find({ genre: "Fiction" }).toArray();
    console.log("Fiction Books:", fiction);

    // 2. Find books published after 1950
    const after1950 = await books.find({ published_year: { $gt: 1950 } }).toArray();
    console.log("Books after 1950:", after1950);

    // 3. Find books by George Orwell
    const orwell = await books.find({ author: "George Orwell" }).toArray();
    console.log("George Orwell Books:", orwell);

    // 4. Update price of "1984"
    await books.updateOne({ title: "1984" }, { $set: { price: 12.99 } });
    console.log("Updated price of 1984");

    // 5. Delete "Moby Dick"
    await books.deleteOne({ title: "Moby Dick" });
    console.log("Deleted Moby Dick");

    console.log("ADVANCED QUERIES");

    // 6. Find books in stock after 2010
    const modern = await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
    console.log("In-stock after 2010:", modern);

    // 7. Projection: only title, author, price
    const projection = await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();
    console.log("Projection (title, author, price):", projection);

    // 8. Sort by price ascending
    const asc = await books.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: 1 }).toArray();
    console.log("Books sorted ascending:", asc);

    // 9. Sort by price descending
    const desc = await books.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: -1 }).toArray();
    console.log("Books sorted descending:", desc);

    // 10. Pagination: first 5 books
    const page1 = await books.find({}, { projection: { title: 1, _id: 0 } }).limit(5).toArray();
    console.log("Page 1 (5 books):", page1);

    // 11. Pagination: next 5 books
    const page2 = await books.find({}, { projection: { title: 1, _id: 0 } }).skip(5).limit(5).toArray();
    console.log("Page 2 (next 5 books):", page2);

    console.log("AGGREGATION ");

    // 12. Average price by genre
    const avgPrice = await books.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
    ]).toArray();
    console.log("Average price by genre:", avgPrice);

    // 13. Author with most books
    const topAuthor = await books.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log("Author with most books:", topAuthor);

    // 14. Books grouped by decade
    const byDecade = await books.aggregate([
      { $group: {
          _id: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log("Books by decade:", byDecade);

    console.log("INDEXING ");

    // 15. Create index on title
    await books.createIndex({ title: 1 });
    console.log("Index created on title");

    // 16. Compound index on author + year
    await books.createIndex({ author: 1, published_year: 1 });
    console.log("Compound index created on author + published_year");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
