# Legal Firm Blog Management System

A comprehensive blogging and article management system built with Next.js 14 and Supabase for SOLV Legal Firm.

## Features

### Public Blog
- **SEO-friendly blog pages** with dynamic routing (`/blog/article-slug`)
- **Responsive design** optimized for all devices
- **Rich content display** with proper typography and formatting
- **Article listing** with cover images, excerpts, and metadata

### Admin Dashboard
- **Secure authentication** using Supabase Auth
- **Article management** - create, edit, delete articles
- **Rich text editor** with TipTap for content creation
- **Image upload** to Supabase Storage for cover images
- **Auto-slug generation** from article titles
- **Real-time updates** and notifications

### Technical Stack
- **Next.js 14** with App Router and Server Components
- **Supabase** for database, authentication, and file storage
- **TipTap** rich text editor with extensive formatting options
- **Tailwind CSS** for responsive, modern styling
- **TypeScript** for type safety

## Setup Instructions

### 1. Environment Variables
Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Database Setup
Run the migration file in your Supabase SQL editor to create:
- `articles` table with proper schema
- Row Level Security (RLS) policies
- Storage bucket for article images
- Automatic timestamp triggers

### 3. Authentication Setup
In your Supabase dashboard:
1. Go to Authentication > Settings
2. Disable email confirmations for easier testing
3. Add your admin user via Authentication > Users

### 4. Storage Setup
The migration automatically creates the `article-images` bucket with proper policies.

### 5. Install Dependencies
```bash
npm install
```

### 6. Run Development Server
```bash
npm run dev
```

## Usage

### Public Blog
- Visit `/blog` to see all published articles
- Click any article to read the full content
- SEO-optimized with proper meta tags and structured data

### Admin Access
1. Visit `/admin/login`
2. Sign in with your Supabase user credentials
3. Access the dashboard to manage articles

### Creating Articles
1. Click "Create New Article" in the admin dashboard
2. Fill in title, author, and content
3. Optionally upload a cover image
4. Use the rich text editor for formatting
5. Save to publish immediately

### Managing Articles
- **Edit**: Click the edit icon to modify existing articles
- **Delete**: Click the trash icon to remove articles
- **Preview**: Click the eye icon to view the published article

## Database Schema

### Articles Table
```sql
articles (
  id: UUID (Primary Key)
  title: TEXT (Required)
  slug: TEXT (Unique, Required)
  content: TEXT (Required)
  cover_url: TEXT (Optional)
  author: TEXT (Required)
  created_at: TIMESTAMPTZ (Auto)
  updated_at: TIMESTAMPTZ (Auto)
)
```

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** for published articles
- **Authenticated write access** for admin operations
- **Secure file uploads** with proper storage policies
- **Protected admin routes** with middleware authentication

## Customization

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update component styles in individual files
- Customize the rich text editor toolbar in `RichTextEditor.tsx`

### Content Types
- Extend the articles schema for additional fields
- Add categories, tags, or publication status
- Implement draft/published workflow

### SEO Enhancements
- Add structured data (JSON-LD) for articles
- Implement sitemap generation
- Add Open Graph and Twitter Card meta tags

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Ensure Node.js 18+ support
- Set environment variables
- Run `npm run build` and `npm start`

## Support

For issues or questions:
1. Check the Supabase documentation
2. Review Next.js App Router guides
3. Consult TipTap editor documentation

## License

This project is built for SOLV Legal Firm. All rights reserved.