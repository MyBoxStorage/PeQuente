'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Script from 'next/script';

const faqs = [
  {
    question: 'Como funciona a retirada na loja?',
    answer: 'Você pode comprar online e retirar seus produtos diretamente na nossa loja física em Paraíba do Sul. Após a compra, você receberá um comprovante e poderá retirar seus produtos no horário de funcionamento da loja.',
  },
  {
    question: 'Quais são os horários de funcionamento?',
    answer: 'Funcionamos de segunda a sexta das 9h às 19h, aos sábados das 9h às 14h. Aos domingos a loja está fechada.',
  },
  {
    question: 'Quais formas de pagamento vocês aceitam?',
    answer: 'Aceitamos PIX (com 5% de desconto), cartão de crédito (em até 10x) e boleto bancário. O pagamento pode ser feito na loja no momento da retirada.',
  },
  {
    question: 'Posso fazer troca ou devolução?',
    answer: 'Sim, aceitamos trocas e devoluções em até 7 dias após a compra, desde que o produto esteja em perfeito estado, com etiquetas e na embalagem original. Traga a nota fiscal e um documento com foto.',
  },
  {
    question: 'Vocês têm garantia nos produtos?',
    answer: 'Sim, todos os nossos produtos têm garantia do fabricante. Em caso de defeito de fabricação, você pode entrar em contato conosco ou diretamente com a marca.',
  },
  {
    question: 'Onde fica a loja?',
    answer: 'Estamos localizados na Praça Garcia 136/140, no Centro de Paraíba do Sul, RJ. CEP 25850-000.',
  },
  {
    question: 'Posso reservar um produto?',
    answer: 'Sim, você pode adicionar produtos ao carrinho e nos contatar para reservar. Recomendamos ligar antes para confirmar a disponibilidade do tamanho desejado.',
  },
] as const;

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-[#0a0a0a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Perguntas Frequentes</h1>
            <p className="text-gray-400 mb-8">
              Tire suas dúvidas sobre nossos produtos, formas de pagamento e políticas.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] rounded-lg border border-[#252525] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#252525] transition"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-white font-medium pr-4">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-[#FF0000] transition-transform flex-shrink-0 ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 py-4 border-t border-[#252525]">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#1a1a1a] rounded-lg p-6 border border-[#252525]">
              <h2 className="text-xl font-bold text-white mb-4">Não encontrou sua resposta?</h2>
              <p className="text-gray-300 mb-4">
                Entre em contato conosco através do nosso formulário de contato ou ligue para (24) 2263-2334.
              </p>
              <Link
                href="/contato"
                className="inline-block bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold px-6 py-3 rounded-lg transition"
              >
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
