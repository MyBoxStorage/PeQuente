import { MapPin, Clock, CreditCard, Percent, Award, Users } from 'lucide-react';

export default function PorQueComprar() {
  const benefits = [
    {
      icon: MapPin,
      title: 'Retirada na Loja',
      description: 'Compre online e retire na loja em Paraíba do Sul',
    },
    {
      icon: CreditCard,
      title: 'Parcelamento',
      description: 'Parcelamento em até 12x sem juros no cartão',
    },
    {
      icon: Percent,
      title: '5% OFF no PIX',
      description: 'Ganhe 5% de desconto pagando no PIX',
    },
    {
      icon: Award,
      title: 'Qualidade Garantida',
      description: 'Produtos das melhores marcas do mercado',
    },
    {
      icon: Users,
      title: 'Atendimento Pessoal',
      description: 'Nossa equipe está pronta para te atender',
    },
    {
      icon: Clock,
      title: 'Horários Flexíveis',
      description: 'Funcionamento de segunda a sábado',
    },
  ];

  return (
    <section className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Por Que Comprar na Pé Quente Calçados?
          </h2>
          <div className="w-24 h-0.5 bg-[#FF0000] mx-auto mb-4" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Oferecemos a melhor experiência de compra com produtos de qualidade e atendimento diferenciado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-[#2d2d2d] rounded-lg p-6 border border-[#353535] hover:border-[#FF0000] transition-all duration-250 hover:shadow-lg hover:shadow-[#FF0000]/20 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#FF0000]/10 p-3 rounded-lg flex-shrink-0">
                    <Icon className="text-[#FF0000]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
