'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Algo deu errado!
            </h2>
            <button
              onClick={() => reset()}
              className="bg-[#FF0000] text-white px-6 py-3 rounded-lg hover:bg-[#FF0000]/90 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
