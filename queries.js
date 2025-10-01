const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Mernstack:Antony6497@mern-july.e211xod.mongodb.net/?retryWrites=true&w=majority';

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // Insert 10 sample books
    await books.insertMany([
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', published_year: 1960, price: 12.99, in_stock: true, pages: 336, publisher: 'J. B. Lippincott & Co.' },
      { title: '1984', author: 'George Orwell', genre: 'Dystopian', published_year: 1949, price: 10.99, in_stock: true, pages: 328, publisher: 'Secker & Warburg' },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', published_year: 1925, price: 9.99, in_stock: true, pages: 180, publisher: 'Charles Scribner\'s Sons' },
      { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', published_year: 1932, price: 11.50, in_stock: false, pages: 311, publisher: 'Chatto & Windus' },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', published_year: 1937, price: 14.99, in_stock: true, pages: 310, publisher: 'George Allen & Unwin' },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', published_year: 1951, price: 8.99, in_stock: true, pages: 224, publisher: 'Little, Brown and Company' },
      { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', published_year: 1813, price: 7.99, in_stock: true, pages: 432, publisher: 'T. Egerton, Whitehall' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', published_year: 1954, price: 19.99, in_stock: true, pages: 1178, publisher: 'Allen & Unwin' },
      { title: 'Animal Farm', author: 'George Orwell', genre: 'Political Satire', published_year: 1945, price: 8.50, in_stock: false, pages: 112, publisher: 'Secker & Warburg' },
      { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', published_year: 1988, price: 10.99, in_stock: true, pages: 197, publisher: 'HarperOne' }
    ]);

    // CRUD Operations
    const fictionBooks = await books.find({ genre: "Fiction" }).toArray();
    console.log("Fiction Books:", fictionBooks);

    const recentBooks = await books.find({ published_year: { $gt: 1950 } }).toArray();
    console.log("Books Published After 1950:", recentBooks);

    const orwellBooks = await books.find({ author: "George Orwell" }).toArray();
    console.log("George Orwell Books:", orwellBooks);

    await books.updateOne({ title: "1984" }, { $set: { price: 12.99 } });
    console.log('Updated price of "1984"');

    await books.deleteOne({ title: "Moby Dick" });
    console.log('Deleted "Moby Dick"');

    // Advanced Queries
    const modernInStock = await books.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log("In-stock Books After 2010:", modernInStock);

    const sortedAsc = await books.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: 1 }).toArray();
    console.log("Books sorted by price (ascending):", sortedAsc);

    const sortedDesc = await books.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: -1 }).toArray();
    console.log("Books sorted by price (descending):", sortedDesc);

    const page1 = await books.find({}, { projection: { title: 1, _id: 0 } }).skip(0).limit(5).toArray();
    const page2 = await books.find({}, { projection: { title: 1, _id: 0 } }).skip(5).limit(5).toArray();
    console.log("Page 1:", page1);
    console.log("Page 2:", page2);

    // Aggregation Pipelines
    const avgPriceByGenre = await books.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
    ]).toArray();
    console.log("Average Price by Genre:", avgPriceByGenre);

    const topAuthor = await books.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log("Author with most books:", topAuthor);

    const byDecade = await books.aggregate([
      {
        $group: {
          _id: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log("Books grouped by decade:", byDecade);

    // Indexing
    await books.createIndex({ title: 1 });
    await books.createIndex({ author: 1, published_year: 1 });

    console.log("All queries completed successfully.");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
