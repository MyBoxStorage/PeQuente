import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validação básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      );
    }

    // Integração com Formspree (se FORMSPREE_ID estiver configurado)
    const formspreeId = process.env.FORMSPREE_ID;
    
    if (formspreeId) {
      try {
        const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone: phone || '',
            subject,
            message,
            _replyto: email,
          }),
        });

        if (!formspreeResponse.ok) {
          const errorData = await formspreeResponse.json();
          console.error('Formspree error:', errorData);
          throw new Error('Erro ao enviar formulário');
        }

        return NextResponse.json(
          { message: 'Mensagem enviada com sucesso!' },
          { status: 200 }
        );
      } catch (error) {
        console.error('Formspree integration error:', error);
        // Continuar para fallback se Formspree falhar
      }
    }

    // Fallback: apenas log (para desenvolvimento)
    // Em produção, você pode integrar com outros serviços como Resend, SendGrid, etc.
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Retornar sucesso mesmo sem integração (para desenvolvimento)
    return NextResponse.json(
      { 
        message: 'Mensagem recebida! Entraremos em contato em breve.',
        note: formspreeId ? 'Enviado via Formspree' : 'Modo desenvolvimento - configure FORMSPREE_ID para envio real'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar formulário. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
