# Cognitor CMS Master Application

A modern, headless CMS master application built with Next.js 15, designed for dynamic content management and publishing using the Cognitor CMS platform.

## ✨ Features

- **🎨 Dynamic Content Rendering**: All content is fetched from Cognitor CMS with rich content support
- **🔍 Advanced Search**: Full-text search with real-time autocomplete and suggestions
- **🎨 Custom Theming**: Individual site themes and branding support
- **📱 Responsive Design**: Mobile-first design with modern UI components
- **⚡ Performance Optimized**: Server-side rendering with caching strategies
- **🛡️ Type-Safe**: Built with TypeScript for robust development

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: URL state with nuqs
- **API Integration**: Custom API client with error handling
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cms-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.template .env.local
   ```
   
   Configure your environment variables:
   ```env
   COGNITOR_SITE_ID=your-site-identifier
   COGNITOR_API_BASE_URL=https://api.cognitor.dev

   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Your Site Name
   NEXT_PUBLIC_DEFAULT_THEME=default
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [slug]/            # Dynamic page routes
│   ├── search/            # Search functionality
│   └── pages/             # Pages overview
├── components/            # React components
│   ├── ui/                # Shadcn UI components
│   ├── layout/            # Header, Footer, Navigation
│   ├── content/           # Content rendering components
│   └── search/            # Search-related components
├── lib/                   # Utilities and core logic
│   ├── api/               # API clients and services
│   ├── types/             # TypeScript definitions
│   ├── theme/             # Theme system
│   └── hooks/             # Custom React hooks
└── styles/                # Global styles and themes
```

## 🎨 Theme System

The application supports individual site theming through JSON configuration files:

### Theme Structure
```json
{
  "id": "site-theme",
  "name": "Site Theme",
  "colors": {
    "primary": "hsl(262.1 83.3% 57.8%)",
    "secondary": "hsl(270 5.2% 96.1%)",
    // ... more colors
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    // ... typography settings
  },
  "customCss": "/* Custom styles */"
}
```

### Adding a New Theme

1. Create a theme file: `public/themes/your-site-id.json`
2. Configure the theme properties
3. Set `COGNITOR_SITE_ID` to match your theme file name

## 🔍 Search System

The search system includes:

- **Real-time autocomplete** with suggestions
- **Recent searches** stored locally
- **Popular searches** from the API
- **Advanced filtering** by category, content type, and tags
- **Pagination** for large result sets

## 🚀 Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Configure environment variables in Netlify dashboard
3. The build will automatically use the provided `netlify.toml` configuration

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `COGNITOR_SITE_ID` | Your site identifier in Cognitor CMS | ✅ |
| `COGNITOR_API_BASE_URL` | Base URL for Cognitor API | ✅ |
| `COGNITOR_API_KEY` | Optional API key for authenticated requests | ❌ |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site | ✅ |
| `NEXT_PUBLIC_SITE_NAME` | Display name for your site | ✅ |
| `NEXT_PUBLIC_DEFAULT_THEME` | Default theme to use | ❌ |

### API Endpoints

The application expects the following API endpoints from Cognitor CMS:

- `GET /sites/{siteId}/pages` - Get all pages
- `GET /sites/{siteId}/pages/{slug}` - Get page by slug
- `GET /sites/{siteId}/navigation/main` - Get main navigation
- `GET /sites/{siteId}/search` - Search content
- `GET /sites/{siteId}/search/suggest` - Get search suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation
- Create an issue in the repository
- Contact the development team

## 🔄 Updates

The application is designed to be easily updatable and maintainable:

- Modular component architecture
- Type-safe API integration
- Comprehensive error handling
- Performance monitoring ready