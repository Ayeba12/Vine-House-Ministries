import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="font-mono text-xs text-[#8A9A86] uppercase tracking-widest">404 - Page Not Found</span>
        <h1 className="font-serif text-4xl text-[#1E242B]">Seeking Sanctuary</h1>
        <p className="font-sans text-sm text-[#1E242B]/70 leading-relaxed">
          The page or resource you are looking for has moved or does not exist.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C3E2D] hover:bg-[#1E242B] text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
          >
            Return to Sanctuary Home
          </Link>
        </div>
      </div>
    </div>
  );
}
