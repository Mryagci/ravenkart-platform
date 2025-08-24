export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Server Çalışıyor! 🎉</h1>
        <p className="text-xl text-gray-200">Next.js development server aktif</p>
        <div className="mt-8 space-y-2">
          <a 
            href="/apps/card-scanner" 
            className="block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white hover:bg-white/20 transition-colors"
          >
            Card Scanner →
          </a>
          <a 
            href="/apps/card-collection" 
            className="block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white hover:bg-white/20 transition-colors"
          >
            Collection →
          </a>
        </div>
      </div>
    </div>
  );
}
