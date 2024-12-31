import BackgroundRemove from '@/components/bg-remove';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI Background Remover
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Remove backgrounds from your images instantly with local AI-powered tool.
            Perfect for professional photos, product images, and more.
          </p>
        </div>
        <BackgroundRemove />
      </div>
    </main>
  );
}