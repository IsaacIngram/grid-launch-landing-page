# GRID Landing Page

A static landing page for GRID - connecting athletes, advisors, and companies.

## Deployment on Netlify

This site is designed to be deployed as a static site on Netlify. The configuration is already set up in `netlify.toml`.

### Quick Deploy

1. **Connect your repository to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository (GitHub, GitLab, etc.)
   - Select this repository

2. **Configure Build Settings**
   
   Netlify should auto-detect the settings from `netlify.toml`, but verify:
   - **Base directory**: `node` (if deploying from the monorepo structure)
   - **Build command**: `npm run netlify:inject-env`
   - **Publish directory**: `public`

3. **Set Environment Variables**
   
   In your Netlify site settings:
   - Go to **Site configuration** → **Environment variables**
   - Add the following variable:
     - **Key**: `SUBMIT_ENDPOINT`
     - **Value**: Your Supabase function URL (e.g., `https://your-project.supabase.co/functions/v1/submit-form`)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site automatically

### Manual Deploy (Alternative)

If you prefer to deploy without the build step:

1. Remove or comment out the `command` line in `netlify.toml`
2. Manually replace `%SUBMIT_ENDPOINT%` in `public/index.html` with your actual endpoint URL
3. Deploy with:
   - **Build command**: (leave empty)
   - **Publish directory**: `public`

### Environment Variables

- **SUBMIT_ENDPOINT**: The URL of your Supabase Edge Function that handles form submissions
  - Example: `https://abcdefgh.supabase.co/functions/v1/submit-form`
  - This will be injected into the HTML during the build process

### Files Structure

```
node/
├── public/              # Static files to be served
│   ├── index.html      # Main HTML file
│   └── styles.css      # Stylesheet
├── scripts/
│   └── inject-env.js   # Build script to inject environment variables
├── netlify.toml        # Netlify configuration
├── package.json        # NPM scripts
└── README.md           # This file
```

### Local Development

To test locally:

1. Set the environment variable:
   ```bash
   export SUBMIT_ENDPOINT="https://your-project.supabase.co/functions/v1/submit-form"
   ```

2. Run the build script:
   ```bash
   npm run netlify:inject-env
   ```

3. Serve the `public` directory with any static server:
   ```bash
   npx serve public
   ```

Or simply open `public/index.html` in your browser (note: form submission requires the endpoint to be configured).

### Notes

- The `server.js` file is no longer needed for Netlify deployment
- All static files are served directly from the `public` directory
- Environment variables are injected at build time, not runtime
- The site will work with any static hosting provider (Netlify, Vercel, GitHub Pages, etc.)

