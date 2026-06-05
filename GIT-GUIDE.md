# Git & GitHub — Beginner Guide for the Team

Never used Git before? No problem. This guide explains everything you need in plain language with exact commands to copy-paste.

---

## What is Git? What is GitHub?

**Git** is a tool that tracks every change you make to your code. Think of it like "unlimited undo" — you can always go back to any older version. It also lets multiple people work on the same project without overwriting each other's work.

**GitHub** is a website that stores your project online so the whole team can share it. Git is the tool on your computer; GitHub is where the code lives in the cloud.

---

## One-Time Setup (do this only once on your computer)

### 1. Install Git
Download from: https://git-scm.com/downloads  
Install with all default options.

### 2. Tell Git who you are
Open a terminal and run (use your own name and email):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Clone the project (download it to your computer)

```bash
git clone https://github.com/YOUR-TEAM/smart-campus-facility-booking-system.git
cd smart-campus-facility-booking-system
```

You only need to clone once. After that, use `git pull` to get updates.

---

## Your Daily Workflow

Every time you sit down to work, follow these 5 steps:

### Step 1 — Get the latest changes from your teammates
Always do this before you start coding, so you don't work on outdated code:

```bash
git pull
```

### Step 2 — Work on your code
Edit files, add features, fix bugs — do your thing!

### Step 3 — Check what you changed
See a summary of which files you modified:

```bash
git status
```

See the actual line-by-line changes:

```bash
git diff
```

### Step 4 — Stage your changes (choose what to save)
Tell Git which files to include in your next save:

```bash
git add .
```

(`git add .` stages all changed files. To stage just one file: `git add app/rooms/page.js`)

### Step 5 — Commit (save a snapshot with a message)
Write a short description of what you did:

```bash
git commit -m "Add room list page with search filter"
```

Good commit messages are short and describe WHAT you changed. Examples:
- `"Add login form with email/password fields"`
- `"Fix booking cancellation bug"`
- `"Create QR check-in scanner component"`

### Step 6 — Push (upload your changes to GitHub)

```bash
git push
```

Your teammates can now `git pull` to get your changes.

---

## What are Branches? Why Do We Use Them?

A **branch** is like a personal copy of the project where you can experiment freely without affecting the main codebase.

Imagine the main code is a shared Google Doc. A branch is like making your own copy, editing it, then merging your edits back when they're ready. This way, half-finished features don't break things for your teammates.

### Create and switch to a new branch

```bash
git checkout -b feature/room-list-page
```

Name your branch after what you're building. Convention: `feature/thing-you-are-building`

Examples:
- `feature/login-page`
- `feature/booking-history`
- `fix/qr-scanner-crash`

### See all branches

```bash
git branch
```

The branch with `*` is the one you're on.

### Switch to an existing branch

```bash
git checkout main
```

### Push your new branch to GitHub (first time only)

```bash
git push -u origin feature/room-list-page
```

After that, just `git push` works.

---

## How to Open a Pull Request (PR)

A Pull Request is how you ask your teammates to review your code before it merges into the main project.

1. Push your branch to GitHub (see above)
2. Go to https://github.com/YOUR-TEAM/smart-campus-facility-booking-system
3. You'll see a yellow banner: "Compare & pull request" — click it
4. Add a title (e.g. "Add room list page") and a short description
5. Click "Create pull request"
6. Ask a teammate to review it
7. Once approved, click "Merge pull request"

---

## Quick Reference — Commands You'll Use Every Day

| Command | What it does |
|---|---|
| `git pull` | Download latest changes from GitHub |
| `git status` | See which files you changed |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save a snapshot with a description |
| `git push` | Upload your commits to GitHub |
| `git checkout -b branch-name` | Create and switch to a new branch |
| `git checkout main` | Switch back to the main branch |
| `git branch` | List all branches |
| `git log --oneline` | See the history of commits (press Q to exit) |

---

## Common Problems and Fixes

### "Your branch is behind 'origin/main'"
Your teammates pushed changes while you were working. Run:
```bash
git pull
```
Then push again.

### "Merge conflict"
Two people edited the same line. Git will mark the conflict in the file like this:
```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> main
```
Open the file, decide which version to keep (or combine them), delete the `<<<`, `===`, `>>>` markers, then:
```bash
git add .
git commit -m "Resolve merge conflict in rooms page"
```

### Accidentally committed to the wrong branch?
Ask a senior teammate for help — don't try to force-push or reset on your own.

---

You've got this! When in doubt, `git status` is always safe to run — it only shows information, it never changes anything.
