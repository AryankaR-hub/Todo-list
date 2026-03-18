## 🛠 What it does

* **Cloud-Synced Goals:** The main task list is hooked up to **MongoDB**, so your to-dos actually stay saved when you close the tab.
* **Scratchpads for your Brain:**
    * **Notes:** A big open space for brainstorming or just venting.
    * **Core Focus:** A spot to pin your top 3 goals so you don't get distracted.
    * **Reminders:** A little block for quotes or things you can't afford to forget.
* **Design that doesn't hurt your eyes:** I spent a lot of time on the UI. It uses a mix of *Playfair Display* and *Montserrat* fonts to look clean, and the background has these slow-moving "Aurora" blobs to keep it from feeling static.

## 💻 The Tech Part

I kept the stack simple but effective:
* **Frontend:** Plain HTML, CSS, and JS. No heavy frameworks—just clean, fast code.
* **Backend:** Node.js and Express. It handles all the API calls for saving and deleting data.
* **Database:** MongoDB Atlas. Everything—including your notes—is stored here.
* **Smart Saving:** I added a "debounce" feature. This means the app waits until you stop typing for a second before it saves to the database, so it doesn't lag or spam the server.

## 🚀 How to run it

### 1. What you need
* **Node.js** installed on your machine.
* A **MongoDB** connection string (Atlas works best).

### 2. Set it up
```bash
# Clone it
git clone https://github.com/yourusername/focus-and-flow.git
cd focus-and-flow

# Install the stuff it needs
npm install
```

### 3. Connect the database
Create a file named `.env` in the root folder and paste your MongoDB link in there:
```env
PORT=3000
MONGO_URI=your_mongodb_link_here
```

### 4. Go!
```bash
node server.js
```
Then just open `index.html` in your browser.

---

## 🧠 Why I built it this way

* **Why one database for everything?** Instead of making separate tables for notes and tasks, I used a `type` field in MongoDB. It makes the code way easier to manage.
* **Why not LocalStorage?** I originally used LocalStorage for notes, but I realized that's useless if you switch devices. Moving it to the cloud makes the app actually "real."
* **Security:** I wrote a helper to clean up any text entered into the app, so nobody can try to break the site with weird scripts (XSS protection).

---
*Built for my Node.js Internship Technical Assessment.*

---

### Why this is better:
* **Tone:** It uses phrases like "dump your thoughts," "didn't want a spreadsheet," and "Node.js installed on your machine." 
* **Honesty:** It admits to changing the design (moving from LocalStorage to Cloud) which shows you were thinking like an engineer during the process.
* **Formatting:** It's clean but looks like a developer wrote it in a Markdown editor, not like a marketing brochure.

**Is there anything else you want to tweak, or does this feel more like "you"?**