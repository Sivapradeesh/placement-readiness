# How to Contribute — Engineering Readiness Portal

> **Read this before you do anything else.** This guide walks you through the entire process from zero, even if you have never used Git or GitHub before.

---

## What is forking, and why are you doing it?

The "Engineering Readiness" repository belongs to your placement representative. You don't have permission to write directly to it — and that's a good thing, because 70 people writing to the same place at the same time causes chaos.

**Forking** means GitHub makes a complete personal copy of the repository under your own account. You work entirely in your copy. When you're done, you submit a "pull request" (PR) — which is just a formal way of saying "here is my work, please merge it into the main repo." The placement rep reviews it and merges it. That's the whole workflow.

---

## Step-by-step: your first submission

### 1. Fork the repo

1. Open a browser and go to: `https://github.com/psgmx/engineering-readiness`
2. In the top-right corner of the page, click the **"Fork"** button. (It looks like a split arrow with a number next to it.)
3. On the next page, leave all defaults as-is and click **"Create fork"**.
4. GitHub will take you to `https://github.com/YOUR-USERNAME/engineering-readiness`. This is now YOUR copy.

### 2. Clone your fork to your laptop

Open a terminal (Git Bash, VS Code terminal, or Command Prompt) and run:

```bash
git clone https://github.com/YOUR-USERNAME/engineering-readiness.git
```

Replace `YOUR-USERNAME` with your actual GitHub username. Then:

```bash
cd engineering-readiness
```

You are now inside the project folder on your laptop.

### 3. Create your files

**For Day 1 (profile submission):**

```bash
mkdir students/25mx301
```
Replace `25mx301` with YOUR roll number. Then create the file `students/25mx301/profile.md` and fill in your name, GitHub username, and your one-line goal for the week.

**For Day 2 and beyond:**

```bash
mkdir -p activities/day02/25mx301
```

Copy the template files:
```bash
cp activities/day02/_template/README.md    activities/day02/25mx301/README.md
cp activities/day02/_template/reflection.md activities/day02/25mx301/reflection.md
cp activities/day02/_template/prompts.md   activities/day02/25mx301/prompts.md
```

Then open each file and fill in the content.

### 4. Save your work with Git

```bash
git add .
git commit -m "day02: 25mx301 submission"
```

The commit message format should be `dayXX: rollnumber submission`. Example: `day02: 25mx301 submission`.

### 5. Push to your fork

```bash
git push origin main
```

### 6. Open a Pull Request

1. Go to your fork on GitHub: `https://github.com/YOUR-USERNAME/engineering-readiness`
2. You should see a yellow banner saying **"This branch is 1 commit ahead of psgmx:main"** with a **"Contribute"** button. Click it.
3. Click **"Open pull request"**.
4. Make sure the settings at the top say:
   - **base repository:** `psgmx/engineering-readiness`
   - **base:** `main`
   - **compare:** `main`
5. Give your PR a title like `day02: 25mx301 submission` and click **"Create pull request"**.

Done! The automatic check will run immediately. If it passes (green tick), your PR is ready for the placement rep to merge. If it fails (red cross), click on "Details" to see what to fix.

---

## ⚠️ IMPORTANT: Only edit your own folders

**Only edit files inside:**
- `students/{rollnumber}/` — your profile folder
- `activities/dayXX/{rollnumber}/` — your submission for each day

**Do NOT edit:**
- `scoreboard.json`, `attendance.json`, `teams.json`, `students/roster.json`
- Files inside `_template/` folders
- `.github/`, `scripts/`, `website/`, or any other student's folder
- The root `README.md`

If your PR touches any of these files, the automatic check will reject it. The placement rep will not merge it manually.

---

## If something goes wrong

### Merge conflicts
**Symptom:** GitHub says your PR has conflicts.

**Cause:** You edited a file outside your folder — a file that someone else also edited.

**Fix:** Check which files are conflicting. If they're files you shouldn't have touched, you need to revert those changes. The safest fix is to delete your local folder, re-clone from your fork, and re-create only your files.

---

### I forgot to fork before cloning

**Symptom:** You cloned `psgmx/engineering-readiness` directly instead of your fork.

**Fix:**
1. Fork the repo on GitHub (Step 1 above)
2. In your terminal, inside the project folder, update the remote:
```bash
git remote set-url origin https://github.com/YOUR-USERNAME/engineering-readiness.git
git push origin main
```

---

### I opened a PR against the wrong branch

**Symptom:** Your PR shows the base as something other than `psgmx/engineering-readiness` → `main`.

**Fix:** Close the PR (click "Close pull request" at the bottom). Open a new one with the correct settings.

---

### My push was rejected

**Symptom:** `git push` says "rejected" or "Permission denied".

**Possible causes:**
- You're pushing to `psgmx/engineering-readiness` directly (you don't have permission). Make sure your remote URL points to YOUR fork: `https://github.com/YOUR-USERNAME/engineering-readiness.git`
- You're not logged in. Run `git config user.email "you@example.com"` and `git config user.name "Your Name"`.
- GitHub now requires a token instead of a password. Create a Personal Access Token at https://github.com/settings/tokens and use it as your password when prompted.

---

*Questions? Ask a teammate first (that's what teams are for), then the placement rep.*
