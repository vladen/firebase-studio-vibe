
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Construction } from 'lucide-react';

export default function GroomingPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-6">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Construction className="h-20 w-20 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            AI Task Grooming - Under Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            This feature for AI-assisted task grooming is currently being refined.
          </p>
          <p className="text-muted-foreground">
            We're working on making it even better and it will be available soon. Stay tuned!
          </p>
          <div className="mt-6 flex justify-center">
            <Bot className="h-12 w-12 text-muted-foreground animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
