# NASA API Setup Instructions

## Getting Your NASA API Key

To use all features of the Orbital Perspectives application, you'll need a free NASA API key.

### Step 1: Get Your API Key

1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Fill out the simple form with:
   - First Name
   - Last Name
   - Email Address
3. Click "Signup"
4. Check your email for your API key

### Step 2: Configure the Application

1. Copy the template configuration file:
   ```bash
   cp config.template.js config.js
   ```

2. Open `config.js` in your text editor

3. Replace `'DEMO_KEY'` with your actual API key:
   ```javascript
   NASA_API_KEY: 'your-api-key-here',
   ```

4. Save the file

### Step 3: You're Done!

The application will now have full access to:
- NASA Astronomy Picture of the Day (APOD)
- Earth Imagery from satellites
- EPIC (Earth Polychromatic Imaging Camera) images
- Mars Rover Photos
- And more!

## Important Notes

- **Rate Limits**: 
  - DEMO_KEY: 30 requests per hour per IP
  - Personal Key: 1,000 requests per hour
  
- **Security**: 
  - Never commit your `config.js` file to git
  - The file is already in `.gitignore` to prevent accidental commits
  - Only `config.template.js` should be tracked in version control

- **Free Forever**: NASA API keys are completely free with no credit card required

## Troubleshooting

### "Too Many Requests" Error
If you see rate limit errors, you're either:
1. Still using DEMO_KEY (replace with your personal key)
2. Making too many requests per hour (wait or get a higher limit)

### API Features Not Working
1. Check that `config.js` exists (not just the template)
2. Verify your API key is correctly placed in the file
3. Check browser console for specific error messages

## What Uses the API?

The following features require a NASA API key:
- 🖼️ NASA Image Gallery search
- 🌍 Earth observation imagery in the Cupola section
- 🌟 Astronomy Picture of the Day
- 🔴 Mars Rover photo collections

## More Information

- [NASA API Documentation](https://api.nasa.gov/)
- [API Usage Examples](https://github.com/nasa/api-docs)
- [Report API Issues](https://github.com/nasa/api-docs/issues)
