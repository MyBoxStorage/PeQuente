'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Mostrar apenas algumas páginas ao redor da atual
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#252525] hover:bg-[#252525] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
        Anterior
      </button>

      <div className="flex gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === page
                  ? 'bg-[#FF0000] text-white font-bold'
                  : 'bg-[#1a1a1a] text-white border border-[#252525] hover:bg-[#252525]'
              }`}
              aria-label={`Ir para página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#252525] hover:bg-[#252525] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
        aria-label="Próxima página"
      >
        Próxima
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
