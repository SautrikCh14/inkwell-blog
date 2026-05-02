import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory posts store
let posts = [
  {
    id: uuidv4(),
    title: "Welcome to Inkwell",
    excerpt: "A place for thoughts, stories, and ideas worth sharing.",
    content: `This is your new blog. Inkwell is a clean, distraction-free space where your words take center stage.\n\nStart by clicking "New Post" to share your first story. You can edit or delete any post at any time.\n\nHappy writing.`,
    author: "The Inkwell Team",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    readTime: "1 min read",
  },
];

// Home - list all posts
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// New post form
app.get("/posts/new", (req, res) => {
  res.render("new");
});

// Create post
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200)) + " min read";
  const newPost = {
    id: uuidv4(),
    title: title.trim(),
    excerpt: content.trim().split("\n")[0].slice(0, 160) + (content.length > 160 ? "…" : ""),
    content: content.trim(),
    author: author.trim() || "Anonymous",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    readTime,
  };
  posts.unshift(newPost);
  res.redirect("/");
});

// View single post
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.redirect("/");
  res.render("post", { post });
});

// Edit form
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.redirect("/");
  res.render("edit", { post });
});

// Update post
app.post("/posts/:id/update", (req, res) => {
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.redirect("/");
  const { title, content, author } = req.body;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200)) + " min read";
  posts[idx] = {
    ...posts[idx],
    title: title.trim(),
    excerpt: content.trim().split("\n")[0].slice(0, 160) + (content.length > 160 ? "…" : ""),
    content: content.trim(),
    author: author.trim() || "Anonymous",
    readTime,
  };
  res.redirect(`/posts/${req.params.id}`);
});

// Delete post
app.post("/posts/:id/delete", (req, res) => {
  posts = posts.filter((p) => p.id !== req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Inkwell running at http://localhost:${PORT}`);
});
