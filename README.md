# Task Manager with Eisenhower Matrix

A modern task management application built with Next.js 14, TypeScript, and Tailwind CSS. Features include:

- ⏱ Real-time task tracking
- 🎯 Eisenhower Matrix for task prioritization
- 📅 Calendar view of completed tasks
- 🌓 Dark mode support
- ⚡ Drag and drop task organization
- 🔄 Automatic state persistence

## Features

- **Task Management**
  - Create, edit, and delete tasks
  - Add descriptions and priorities
  - Track time spent on tasks
  - Mark tasks as complete

- **Eisenhower Matrix**
  - Organize tasks by urgency and importance
  - Drag and drop interface
  - Visual feedback for task status

- **Time Tracking**
  - Start/pause time tracking
  - Real-time updates
  - Persistent time records

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @hello-pangea/dnd (Drag and Drop)
- Local Storage for persistence

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [repo-name]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── components/    # React components
│   ├── api/          # API routes
│   ├── lib/          # Utilities and hooks
│   ├── page.tsx      # Main page
│   └── layout.tsx    # Root layout
├── lib/
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom hooks
│   └── types/        # TypeScript types
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project as a template for your own task manager!