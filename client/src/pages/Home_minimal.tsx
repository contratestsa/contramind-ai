export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      <header className="bg-navy border-b border-sky/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">ContraMind.ai</div>
          <div className="flex items-center space-x-4">
            <a 
              href="/api/auth/google"
              className="px-4 py-2 bg-white text-navy rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign in with Google
            </a>
            <a 
              href="/api/auth/microsoft"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign in with Microsoft
            </a>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-8">Welcome to ContraMind.ai</h1>
          <p className="text-xl mb-8">AI-powered legal technology platform for the MENA region</p>
          
          <div className="bg-white/10 p-8 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">OAuth Authentication Test</h2>
            <p className="mb-6">Click the buttons above to test Google or Microsoft OAuth authentication.</p>
            <div className="text-sm text-white/80">
              <p>✓ Backend OAuth system is fully functional</p>
              <p>✓ Google and Microsoft redirect URIs configured</p>
              <p>✓ Session management working correctly</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}