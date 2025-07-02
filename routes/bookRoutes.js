import express from "express"
import { authenticate } from "../middleware/authMiddleware.js"
import { addBooks, deleteBookById, getBookById, getPaginatedBooks, searchBooksByGenre, updateBookById } from "../controllers/bookController.js"

const router = express.Router()

router.post("/add-book", authenticate, addBooks)
router.get("/", authenticate, getPaginatedBooks)
router.get("/search", authenticate, searchBooksByGenre)
router.get("/:id", authenticate, getBookById)
router.get("/search", authenticate, searchBooksByGenre)
router.put("/update-book/:id", authenticate, updateBookById)
router.delete("/delete-book/:id", authenticate, deleteBookById)

export default router