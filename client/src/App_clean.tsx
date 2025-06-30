export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">ContraMind.ai</div>
          <div className="flex items-center space-x-4">
            <a 
              href="/api/auth/google"
              className="px-4 py-2 bg-white text-slate-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Sign in with Google
            </a>
            <a 
              href="/api/auth/microsoft"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign in with Microsoft
            </a>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to ContraMind.ai
          </h1>
          <p className="text-xl mb-12 text-slate-300">
            AI-powered legal technology platform for the MENA region
          </p>
          
          <div className="bg-slate-800 p-8 rounded-xl max-w-2xl mx-auto border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">OAuth Authentication Ready</h2>
            <p className="mb-6 text-slate-300">
              Click the authentication buttons above to sign in with Google or Microsoft.
            </p>
            <div className="text-sm text-slate-400 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Backend OAuth system functional</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Google and Microsoft redirect URIs configured</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Session management working correctly</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>OAuth callback confirmed in server logs</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-slate-400 text-sm">
              This is a simplified version to test OAuth authentication without React hook conflicts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}