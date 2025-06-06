
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="mb-8">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <rect width="100" height="100" rx="20" fill="currentColor"/>
          <path d="M30 70L50 30L70 70" stroke="hsl(var(--background))" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="50" cy="20" r="10" fill="hsl(var(--accent))"/>
        </svg>
      </div>
      <h1 className="text-5xl font-headline font-bold mb-4 text-foreground">Welcome to Project Sentinel</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Your integrated solution for real-time log monitoring, AI-powered task management, and streamlined project planning.
      </p>
      <Button asChild size="lg">
        <Link href="/dashboard">
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
