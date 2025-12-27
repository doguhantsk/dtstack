import { supabase } from './supabase.js';

const form = document.getElementById('offerForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = new FormData(form);
      const payload = {
        name: data.get('name') || '',
        company: data.get('company') || '',
        email: data.get('email') || '',
        phone: data.get('phone') || '',
        services: data.getAll('service'),
        budget: data.get('budget') || '',
        message: data.get('message') || ''
      };

      const { error } = await supabase.from('contacts').insert([payload]);
      if (error) throw error;

      alert('Talebiniz başarıyla alındı! Teşekkürler.');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Bir hata oluştu. Lütfen sonra tekrar deneyin.');
    }
  });
}
