import { read } from "fs";
import { readJSON, writeJSON } from "../utils/fileUtils.js";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOOKS_FILE = path.join(__dirname, "../data/books.json");

export const addBooks = async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;

  if (
    !title ||
    typeof title !== "string" ||
    !author ||
    typeof author !== "string" ||
    !genre ||
    typeof genre !== "string" ||
    typeof publishedYear !== "number"
  ) {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }
  try {
    const books = await readJSON(BOOKS_FILE);

    const newBook = {
      id: uuidv4(),
      title,
      genre,
      author,
      publishedYear,
      userId: req.user.id,
    };
    books.push(newBook);

    await writeJSON(BOOKS_FILE, books);

    res.status(201).json({
      message: "new book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Book Add Error:", err);
    res.status(500).json({ message: "Failed to add book", error: err.message });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;
   console.log("Requested Book ID:", id);
  try {
    const books = await readJSON(BOOKS_FILE);
    console.log("Books loaded:", books.length);
    const book = books.find((b) => b.id === id);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publishedYear } = req.body;

  try {
    const books = await readJSON(BOOKS_FILE);

    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    const book = books[index];
    console.log("Existing Book:", book);
    console.log("Logged-in user:", req.user.id);

    if (book.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own book" });
    }

    books[index] = {
      ...book,
      title: title ?? book.title,
      author: author ?? book.author,
      genre: genre ?? book.genre,
      publishedYear: publishedYear ?? book.publishedYear
    };

    await writeJSON(BOOKS_FILE, books);

    res.status(200).json({ message: "Book updated", book: books[index] });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const books = await readJSON(BOOKS_FILE);
    const book = books.find((b) => b.id === id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this book" });
    }

    const updatedBooks = books.filter((b) => b.id !== id);
    await writeJSON(BOOKS_FILE, updatedBooks);

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const searchBooksByGenre = async (req, res) => {
  const { genre } = req.query;

  try {
    const books = await readJSON(BOOKS_FILE);

    if (!genre) {
      return res.status(400).json({ message: "Genre query is required" });
    }

    const filteredBooks = books.filter((book) =>
      book.genre.toLowerCase() === genre.toLowerCase()
    );

    res.status(200).json({ results: filteredBooks.length, books: filteredBooks });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPaginatedBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const books = await readJSON(BOOKS_FILE);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedBooks = books.slice(startIndex, endIndex);

    res.status(200).json({
      page,
      limit,
      total: books.length,
      totalPages: Math.ceil(books.length / limit),
      books: paginatedBooks
    });
  } catch (error) {
    console.error("Pagination error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




