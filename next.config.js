/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.pexels.com',
      // Add your Supabase storage domain here
      // e.g., 'your-project-id.supabase.co'
    ],
  },
}

module.exports = nextConfig