import Link from 'next/link';

export default function GoPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#111827] border border-[#1f2937] rounded-xl p-8 shadow-xl text-center space-y-6">
        <h1 className="text-2xl font-semibold">Elige tu país</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="https://calculando.cl/"
            className="w-full inline-flex items-center justify-center rounded-lg bg-[#1f2937] hover:bg-[#111827] border border-[#2d3648] px-4 py-3 font-medium transition"
          >
            Chile
          </Link>
          <Link
            href="/mx"
            className="w-full inline-flex items-center justify-center rounded-lg bg-[#1f2937] hover:bg-[#111827] border border-[#2d3648] px-4 py-3 font-medium transition"
          >
            México
          </Link>
        </div>
      </div>
    </div>
  );
}
