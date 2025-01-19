import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold">
          Welcome to{' '}
          <a 
            className="text-blue-600 hover:text-blue-800 transition-colors" 
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-xl sm:text-2xl">
          Get started by editing{' '}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
            src/app/page.tsx
          </code>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Button variant="default" size="lg">
            Primary Button
          </Button>
          <Button variant="secondary" size="lg">
            Secondary Button
          </Button>
          <Button variant="outline" size="lg">
            Outline Button
          </Button>
        </div>
      </main>
    </div>
  )
} 