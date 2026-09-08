# Git Workflow Guide: Working with Forks and Branches

This guide outlines the standard Git workflow for working with a forked repository. It covers branch creation, pushing changes, raising pull requests, and keeping your fork synchronized with the original repository.

---

## 1. Core Concepts: Origin vs. Upstream

- **`origin`**: This is your personal copy (fork) of the repository hosted on your GitHub account (e.g., `https://github.com/rohitkum549/fire-incident-frontend`). You have full write (push) access here.
- **`upstream`**: This is the original parent repository hosted by the organization or primary author (e.g., `https://github.com/soumya792/fire-incident-frontend`). You pull updates from here to stay in sync.

---

## 2. Step-by-Step Development Workflow

### Step 1: Start on `main` and Pull Latest Updates

Before starting any new work, ensure your local `main` branch is fully synchronized with the upstream repository.

```bash
# Switch to main branch
git checkout main

# Fetch latest updates from the upstream repository
git fetch upstream

# Merge upstream changes into your local main branch
git merge upstream/main

# Push the updated main to your personal GitHub fork (origin)
git push origin main
```

### Step 2: Create a New Feature Branch

Always create a descriptive branch for your work. Never make commits directly to your `main` branch.

```bash
# Create and switch to a new feature branch (e.g., FIRE-003)
git checkout -b FIRE-003
```

### Step 3: Make Changes & Commit

Write your code, test it, and commit your changes.

```bash
# Check modified files
git status

# Stage your changes
git add .

# Commit your changes with a descriptive message
git commit -m "feat: implement operational command timer controls"
```

### Step 4: Push the Feature Branch to Your Fork

Push your branch to your personal fork (`origin`) on GitHub. Use the `-u` (upstream tracking) flag on the first push to link local and remote branches.

```bash
# Push branch and set upstream tracking
git push -u origin FIRE-003
```

> [!NOTE]
> For any future pushes on this branch, you only need to run `git push`.

### Step 5: Open a Pull Request (PR)

1. Go to your personal GitHub fork page or the original upstream repository page.
2. You will see a banner saying `FIRE-003 had recent pushes...` with a green **Compare & pull request** button.
3. Click the button, write a description of your changes, and submit the PR to merge `rohitkum549:FIRE-003` into `soumya792:main`.

---

## 3. Post-Merge: Syncing Your Fork (Clean Up)

Once your Pull Request is approved and merged on GitHub, follow these steps to clean up and prepare for your next task.

```bash
# 1. Switch back to main
git checkout main

# 2. Fetch the newly merged commits from upstream
git fetch upstream

# 3. Fast-forward merge the updates into your local main
git merge upstream/main

# 4. Push the synced main to update your personal fork on GitHub
git push origin main

# 5. Delete the local feature branch (it is no longer needed)
git branch -d FIRE-003
```

---

## 4. Quick Command Cheat Sheet

| Task                             | Git Command                                                                                  |
| :------------------------------- | :------------------------------------------------------------------------------------------- |
| **Check Remotes**                | `git remote -v`                                                                              |
| **Create & Switch Branch**       | `git checkout -b <branch-name>`                                                              |
| **Stage Changes**                | `git add .`                                                                                  |
| **Commit Changes**               | `git commit -m "<message>"`                                                                  |
| **First Push (Track)**           | `git push -u origin <branch-name>`                                                           |
| **Subsequent Pushes**            | `git push`                                                                                   |
| **Sync main with original repo** | `git checkout main && git fetch upstream && git merge upstream/main && git push origin main` |
