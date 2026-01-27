# Skills-First UI Template

This template provides a pre-configured React UI setup with Sailwind components for Skills-First development.

## What's Included

- **React 19** + TypeScript
- **Vite** build tooling
- **React Router** for navigation
- **Tailwind CSS 4** with Sailwind component library
- **Aurora color palette** pre-configured
- **API client pattern** for backend integration
- **Example pages** demonstrating Sailwind components

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS 4
- Sailwind component library (@pglevy/sailwind)

## Getting Started

This template is automatically copied when you run:

```bash
npm run ui:init
```

from the root of your Skills-First project.

## Structure

```
ui/
├── src/
│   ├── pages/           # Page components
│   │   ├── home.tsx
│   │   └── example-form.tsx
│   ├── api.ts          # Backend integration layer
│   ├── App.tsx         # Main app with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Aurora theme + Sailwind styles
├── public/             # Static assets
├── index.html          # HTML entry
└── vite.config.ts      # Vite config with API proxy
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (with API proxy to localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Backend Integration

The UI connects to your Skills-First backend through the API client in `src/api.ts`.

### How It Works

1. **Vite Proxy**: Development server proxies `/api/*` requests to `http://localhost:3000`
2. **API Client**: `src/api.ts` defines typed functions that call backend endpoints
3. **Skills Execution**: Backend routes receive API calls and execute appropriate skills
4. **Type Safety**: TypeScript types keep frontend and backend in sync

### Example Flow

```
User fills form → createEntity() → POST /api/entities → Skill executes → Response
```

See `src/api.ts` for the integration pattern and examples.

## Sailwind Components

This UI uses the Sailwind component library for SAIL-like components.

**Key conventions:**
- All SAIL parameter values are UPPERCASE (e.g., `size="LARGE"`)
- Import from `@pglevy/sailwind` package
- Components follow SAIL naming (e.g., `HeadingField`, `ButtonWidget`)

See the root `AGENTS.md` file for complete guidance on using Sailwind components.

### Common Components

- **Layout**: `CardLayout`, `HeadingField`
- **Forms**: `TextField`, `ButtonWidget`, `DropdownField`
- **Display**: `RichTextDisplayField`, `TagField`, `MessageBanner`
- **Navigation**: `TabsField`, `ButtonArrayLayout`

## Customization

### Update Your Domain Types

Edit `src/api.ts` to define your domain entities:

```typescript
export type YourEntity = {
  id: string;
  // Your fields
  skill_data: Record<string, any>;
}
```

### Add Pages

1. Create page in `src/pages/`
2. Import Sailwind components from `@pglevy/sailwind`
3. Add route to `src/App.tsx`
4. Run `npm run build` to validate

### Connect to Skills

Use the API client to invoke skills through the backend:

```typescript
import { createEntity } from '../api'

const result = await createEntity({ name, description })
```

## Aurora Color Palette

The UI is pre-configured with the Aurora design system colors:

- Use only steps: 50, 100, 200, 500, 700, 900
- Semantic mappings: ACCENT (blue), POSITIVE (green), NEGATIVE (red)
- All colors defined in `src/index.css`

## Resources

- **Sailwind Docs**: https://github.com/pglevy/sailwind
- **Tailwind CSS**: https://tailwindcss.com/
- **React Router**: https://reactrouter.com/
