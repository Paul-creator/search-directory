# Search Directory Extension for Raycast

This Raycast extension lets you pick from up to 10 predefined folders via a dropdown in the search bar and perform searches inside them using **fzf**, matching both file names and directory names.

## Prerequisites

- **macOS** with Raycast installed
- **Homebrew** (if you don’t have it yet):
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
- **fzf** (for the interactive filtering interface):
  ```bash
  brew install fzf
  ```

## Installation

1. In your project folder, install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
2. Open Raycast (⇧⌘P), type **Import Extension**, and select it.
3. Choose this project’s root directory (the folder containing `package.json`).

After importing, you’ll see **Search Directory** in your Raycast commands.

## Usage

1. Invoke **Search Directory** in Raycast.
2. Use the dropdown in the search bar to choose which directory to search.
3. Enter your search term—results for both files and folders appear live and are **case-insensitive**.
4. Hit Enter to open the item or use the Action Panel to reveal it in Finder.

## Preferences

Configure up to 10 folders in Raycast → Extensions → **Search Directory**:

- `Search Directory #1` through `Search Directory #10`.
- Each setting lets you pick a folder via the directory picker UI.

---

_Created with ❤️ for faster file discovery in Raycast_
