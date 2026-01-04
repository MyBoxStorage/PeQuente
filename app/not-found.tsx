import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold text-[#FF0000] mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Sapato perdido?</h2>
        <p className="text-gray-400 text-lg mb-8">
          A página que você está procurando não foi encontrada. 
          Volte para a home e continue navegando!
        </p>
        <Link
          href="/"
          className="inline-block bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold px-8 py-3 rounded-lg transition"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}
