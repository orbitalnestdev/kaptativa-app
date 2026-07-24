export const prerender = false;

export async function POST({ request }) {
  try {
    const { quoteId, client, email, title, amount, currency } = await request.json();

    if (!quoteId || !amount || !title) {
      return Response.json({ error: 'Datos incompletos para generar preferencia de pago' }, { status: 400 });
    }

    const mpAccessToken = import.meta.env.MP_ACCESS_TOKEN || '';
    if (!mpAccessToken) {
      return Response.json({ error: 'MP_ACCESS_TOKEN no configurado en el servidor' }, { status: 500 });
    }

    const origin = request.headers.get('origin') || 'https://kaptativa.com';

    const payload = {
      items: [
        {
          title,
          quantity: 1,
          unit_price: Math.round(amount),
          currency_id: currency || 'USD'
        }
      ],
      payer: email ? { email } : undefined,
      back_urls: {
        success: `${origin}/presupuestos/pagar?id=${quoteId}&status=success`,
        pending: `${origin}/presupuestos/pagar?id=${quoteId}&status=pending`,
        failure: `${origin}/presupuestos/pagar?id=${quoteId}&status=failure`
      },
      auto_return: 'approved',
      external_reference: quoteId
    };

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`MercadoPago ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return Response.json({ init_point: data.init_point, id: data.id });

  } catch (err) {
    console.error('[create-mp-preference] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
