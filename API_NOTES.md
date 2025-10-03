# API Integration Notes

## CORS Issues & Solutions

When testing locally, you may see CORS errors in the browser console. This is **normal** and **expected** for local development.

### Why This Happens

Browsers block requests from local files (file://) to external APIs for security reasons. This is called CORS (Cross-Origin Resource Sharing) protection.

### Solutions

#### Option 1: Use a Local Web Server (Recommended)
```bash
# Using Python (most common)
python3 -m http.server 8080
# Then visit: http://localhost:8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

#### Option 2: Deploy to a Web Server
Upload the files to any web hosting service:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Any web hosting provider

When deployed on a real server, the APIs will work perfectly!

#### Option 3: Use Browser Extensions (for testing only)
- Install a CORS extension for Chrome/Firefox
- Enable it only for testing
- **Not recommended for production**

### Testing the APIs Work

To verify the APIs are functioning:

1. Check the browser console (F12) for successful API responses
2. The ISS position should update every 10 seconds (when CORS is resolved)
3. NASA images should load in the gallery
4. Live Earth events should appear in the Cupola section

### API Response Times

- **ISS Location**: Updates every 10 seconds
- **Live Earth Events**: Updates every 5 minutes
- **NASA Images**: Load on search (instant)
- **Weather Data**: On-demand (instant)

## For Users

Don't worry about CORS errors if you're just opening the HTML file directly! The website still works great and looks beautiful.

To get the full API features working:
1. Upload to GitHub Pages (free!)
2. Or use any web hosting service
3. Or run a local web server (see above)

## For Developers

The API integration code is in `api.js` and is modular and well-commented. Feel free to:
- Add more APIs
- Modify update intervals
- Extend functionality
- Add error handling

All APIs used are:
- ✅ Completely free
- ✅ No credit card required
- ✅ Well-documented
- ✅ Reliable NASA/government sources
