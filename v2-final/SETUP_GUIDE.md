# 🚀 Simple Setup Guide

## What This Project Does

This website shows you real NASA data like:
- Where the International Space Station is RIGHT NOW
- Real wildfires, storms, and other Earth events happening today
- Real NASA photos you can search and view

## Do I Need to Do Anything?

**NO!** Most features work immediately. Just open `index.html` in your web browser.

## But Can I Make It Better?

**YES!** Here's how (super easy):

### Option 1: Get More NASA Features (2 minutes)

1. Go to this website: https://api.nasa.gov/
2. Type your first name, last name, and email
3. Click the blue "Signup" button
4. Check your email - you'll get an API key (looks like: `abcd1234efgh5678`)
5. Open the file `config.js` with Notepad (Windows) or TextEdit (Mac)
6. Find this line:
   ```
   NASA_API_KEY: 'DEMO_KEY',
   ```
7. Change it to:
   ```
   NASA_API_KEY: 'your-key-from-email',
   ```
8. Save the file
9. Refresh the website

**That's it!** Now you can load more NASA images without limits.

### Option 2: Add Your Own Space Images (5 minutes)

Want to customize the background images?

1. Create a new folder called `images` next to the HTML file
2. Download space images from NASA:
   - Go to: https://images.nasa.gov/
   - Search for what you want (example: "Earth from ISS")
   - Click an image you like
   - Right-click → "Save image as..."
3. Save images with these exact names:
   - `earth.jpg` - Earth from space
   - `iss.jpg` - Space station
   - `cupola.jpg` - The window on ISS
   - `nbl.jpg` - Training pool
4. Put all images in the `images` folder
5. Refresh the website

**Done!** Your custom images will show up.

## What If Something Doesn't Work?

### "The ISS location says 'Loading...' forever"

- This happens if your internet blocks the ISS tracking website
- The rest of the site still works fine
- Try on a different internet connection

### "Gallery shows 'Unable to load images'"

- Make sure you have internet connection
- The NASA images website might be temporarily down
- Try again in a few minutes

### "I can't find config.js"

- It's in the same folder as `index.html`
- On Windows: Right-click → Open with → Notepad
- On Mac: Right-click → Open with → TextEdit

## Quick Reference: Where to Get Free Stuff

| What You Want | Where to Get It | Need Account? |
|---------------|----------------|---------------|
| NASA API Key | https://api.nasa.gov/ | Yes (free, 1 min) |
| NASA Images | https://images.nasa.gov/ | No |
| ISS Photos | https://www.nasa.gov/mission_pages/station/images/ | No |
| NASA Videos | https://images.nasa.gov/ (filter by videos) | No |

## Still Confused?

1. Just open `index.html` - everything works without setup!
2. The NASA API key only gives you MORE features
3. Custom images are just for fun customization

**The website works great right out of the box!** 🎉

## Tips for Best Experience

1. **Use a modern browser:**
   - Chrome ✅
   - Firefox ✅
   - Safari ✅
   - Edge ✅
   - Internet Explorer ❌ (too old)

2. **Have internet connection** - The website needs to fetch real NASA data

3. **Allow some time** - Images from space are big! They might take a few seconds to load

4. **Try different searches** in the gallery:
   - "Mars rover"
   - "Hubble telescope"
   - "astronaut spacewalk"
   - "Earth at night"
   - "Saturn"
   - "nebula"

## Cool Things to Try

1. **Watch the ISS position update** - Open the website and leave it running. Every 10 seconds, you'll see the ISS coordinates change!

2. **Search for your favorite planet** - Type "Mars" or "Jupiter" in the gallery search

3. **Check live Earth events** - See what natural events NASA is tracking right now

4. **Click on the red markers** in the Cupola section - Learn about real environmental monitoring

5. **Try the training simulator** - Move the astronaut around like they train in the real pool!

---

**That's it! Enjoy exploring space! 🌟🚀🌍**
