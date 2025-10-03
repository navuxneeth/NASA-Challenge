# 🚀 Quick Start Guide

## Just Want to See It Work?

**Open `index.html` in your browser. That's it!** 🎉

Everything works immediately - real ISS tracking, live Earth events, and NASA image search!

---

## Want More Features?

### Get Your FREE NASA API Key (Takes 2 Minutes)

1. **Go to:** https://api.nasa.gov/
2. **Fill in:**
   - First Name
   - Last Name  
   - Email
3. **Click:** "Signup"
4. **Check your email** for your API key
5. **Open:** `config.js` file (with Notepad or any text editor)
6. **Find this line:**
   ```javascript
   NASA_API_KEY: 'DEMO_KEY',
   ```
7. **Change it to:**
   ```javascript
   NASA_API_KEY: 'your-key-from-email',
   ```
8. **Save** the file
9. **Refresh** your browser

**Done!** Now you can search unlimited NASA images!

---

## Want to Add Custom Images?

### Add Your Own Space Photos (Takes 5 Minutes)

1. **Create** a folder named `images` (next to index.html)
2. **Go to** NASA's free image library:
   - https://images.nasa.gov/
3. **Search** for images you like:
   - Type "Earth from space"
   - Click an image you like
   - Right-click → "Save image as..."
4. **Save** images with these exact names:
   - `earth.jpg` - Earth photo
   - `iss.jpg` - Space station photo
   - `cupola.jpg` - Cupola window photo
   - `nbl.jpg` - Training pool photo
5. **Refresh** your browser

**Your custom images are now showing!**

---

## Want Better Performance?

### Deploy to a Web Server (Recommended)

The APIs work better on a real web server. Choose one:

#### Option 1: GitHub Pages (Easiest!)
1. Push your code to GitHub
2. Go to Settings → Pages
3. Enable Pages
4. Visit your live site!

#### Option 2: Run Local Server
```bash
# If you have Python:
python3 -m http.server 8080

# Then open: http://localhost:8080
```

#### Option 3: Free Hosting
- Netlify: Drag and drop your files
- Vercel: Connect your GitHub
- Any web host: Upload via FTP

---

## What's Included?

### Real NASA Data (All Free!)
- 🛰️ **ISS Position** - Updates every 10 seconds
- 🌍 **Live Earth Events** - Wildfires, storms, volcanoes
- 📸 **Image Gallery** - Search 100,000+ NASA photos

### Interactive Features
- Click red markers on Earth
- Search any space topic
- View full-size images
- Try the astronaut training simulator

---

## Need Help?

### Can't See ISS Position?
- This works better on a web server
- The website still looks great locally!
- Try deploying to GitHub Pages

### Gallery Not Loading Images?
- Make sure you have internet connection
- Try searching different terms
- Deploy to a web server for best results

### Still Confused?
- Read **SETUP_GUIDE.md** for detailed help
- Read **README.md** for complete documentation
- Check **API_NOTES.md** for technical details

---

## Try These Cool Searches!

In the NASA Image Gallery, try searching:
- 🔴 "Mars rover"
- 🔭 "Hubble telescope"
- 🌍 "Earth at night"
- 👨‍🚀 "astronaut spacewalk"
- 🪐 "Saturn rings"
- 🌌 "nebula"
- 🚀 "rocket launch"
- 🌙 "moon landing"

---

## That's It!

You now have a working NASA website with real data! 🎉

Enjoy exploring space! 🚀🌍⭐

---

**Questions?** Check the other guide files:
- **SETUP_GUIDE.md** - Detailed setup instructions
- **WHATS_NEW.md** - All new features explained
- **API_NOTES.md** - Technical information
- **README.md** - Complete documentation
