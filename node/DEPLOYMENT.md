# Netlify Deployment Guide

## Quick Setup Instructions

### 1. Connect Repository to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, Bitbucket, etc.)
4. Select the `grid-launch-landing-page` repository

### 2. Configure Build Settings

When prompted for build settings, enter:

- **Base directory**: `node`
- **Build command**: `npm run netlify:inject-env`
- **Publish directory**: `public`

> **Note**: Netlify should automatically detect these settings from the `netlify.toml` file.

### 3. Set Environment Variables

Before deploying, you MUST configure the environment variable:

1. In Netlify, go to **Site configuration** → **Environment variables**
2. Click **"Add a variable"** → **"Add a single variable"**
3. Enter:
   - **Key**: `SUBMIT_ENDPOINT`
   - **Value**: Your Supabase Edge Function URL
   - **Scopes**: Production (and optionally Deploy Previews, Branch deploys)

**Example Supabase URL format**:
```
https://your-project-id.supabase.co/functions/v1/submit-form
```

### 4. Deploy

Click **"Deploy site"** and Netlify will:
1. Clone your repository
2. Run `npm run netlify:inject-env` (which injects the `SUBMIT_ENDPOINT` into your HTML)
3. Publish the `public` directory

Your site will be live at a Netlify URL like: `https://your-site-name.netlify.app`

---

## Alternative: No-Build Deployment

If you want to skip the build process entirely and hardcode the endpoint:

1. Edit `public/index.html` line ~73
2. Replace:
   ```javascript
   const SUBMIT_ENDPOINT = '%SUBMIT_ENDPOINT%';
   ```
   With:
   ```javascript
   const SUBMIT_ENDPOINT = 'https://your-project.supabase.co/functions/v1/submit-form';
   ```
3. In `netlify.toml`, change:
   ```toml
   [build]
     command = "npm run netlify:inject-env"
     publish = "public"
   ```
   To:
   ```toml
   [build]
     publish = "public"
   ```
4. Deploy without needing to set environment variables

---

## Testing Locally

To test the site locally with environment variable injection:

```bash
cd node
export SUBMIT_ENDPOINT="https://your-project.supabase.co/functions/v1/submit-form"
npm run netlify:inject-env
npx serve public
```

Then visit `http://localhost:3000`

---

## Troubleshooting

### Form shows "No endpoint configured" error
- Check that `SUBMIT_ENDPOINT` environment variable is set in Netlify
- Verify the build command ran successfully in the deploy logs
- Check that the Supabase function URL is correct

### Build fails
- Ensure Node.js version is compatible (Netlify uses Node 18+ by default)
- Check the deploy logs for specific errors
- Verify `package.json` and `scripts/inject-env.js` are present

### CORS errors when submitting form
- Configure CORS headers in your Supabase Edge Function
- Ensure your Supabase function accepts requests from your Netlify domain

---

## Files Modified for Netlify

- ✅ `public/index.html` - Removed `/config` endpoint fetch, now uses injected env var
- ✅ `package.json` - Simplified to only include build script
- ✅ `netlify.toml` - Created with build and publish settings
- ✅ `scripts/inject-env.js` - Script to inject environment variables into HTML
- ❌ `server.js` - No longer needed (can be deleted or ignored)

---

## Custom Domain (Optional)

To use a custom domain:

1. In Netlify, go to **Domain management** → **Add a domain**
2. Enter your domain name
3. Follow Netlify's instructions to update your DNS records
4. Netlify will automatically provision an SSL certificate
