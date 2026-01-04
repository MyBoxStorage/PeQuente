'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { getStoreInfo } from '@/lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Assunto deve ter no mínimo 3 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContatoPage() {
  const storeInfo = getStoreInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Aqui você integraria com Formspree ou outro serviço
      // Por enquanto, apenas simulamos o envio
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Entre em Contato</h1>
          <p className="text-gray-400 mb-8">
            Tem alguma dúvida? Envie sua mensagem e responderemos o mais breve possível.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#252525]">
              <h2 className="text-xl font-bold text-white mb-6">Envie sua Mensagem</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                  <p className="text-green-400">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-400">Erro ao enviar mensagem. Tente novamente ou ligue para {storeInfo.phone}.</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-400 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-red-400 text-sm">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message')}
                    className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000] resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-red-400 text-sm">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#252525]">
                <h2 className="text-xl font-bold text-white mb-4">Informações de Contato</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-white font-medium mb-1">Endereço</p>
                      <p className="text-gray-300">{storeInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-white font-medium mb-1">Telefone</p>
                      <a href={`tel:${storeInfo.phone}`} className="text-gray-300 hover:text-[#FF0000] transition">
                        {storeInfo.phone}
                      </a>
                    </div>
                  </div>
                  {storeInfo.email && (
                    <div className="flex items-start space-x-4">
                      <Mail className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                      <div>
                        <p className="text-white font-medium mb-1">E-mail</p>
                        <a href={`mailto:${storeInfo.email}`} className="text-gray-300 hover:text-[#FF0000] transition">
                          {storeInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#00008B] to-[#252525] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-3">Horário de Funcionamento</h3>
                <div className="space-y-2 text-gray-200">
                  <p>{storeInfo.hours.weekdays}</p>
                  <p>{storeInfo.hours.saturday}</p>
                  <p>{storeInfo.hours.sunday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
