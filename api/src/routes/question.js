const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  addQuestion,
  deleteQuestion,
  toggleLike,
  toggleSave,
  addComment,
  deleteComment,
  searchQuestion,
} = require("../controllers/question");
const { protect } = require("../middlewares/auth");

router.route("/").get(getQuestions).post(protect, addQuestion);
router.route("/search").get(searchQuestion);
router.route("/:id").get(protect, getQuestion).delete(protect, deleteQuestion);
router.route("/:id/togglelike").get(protect, toggleLike);
router.route("/:id/togglesave").get(protect, toggleSave);
router.route("/:id/discussions").post(protect, addComment);
router.route("/:id/discussions/:discussionId").delete(protect, deleteComment);

module.exports = router;
