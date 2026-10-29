/* Mobile-only combo checkout: complete each frame, then move to customer details. */
(() => {
  if (!window.matchMedia('(max-width: 620px)').matches) return;
  const customer = document.querySelector('#comboCustomerDetails');
  const next = document.querySelector('#nextFrame');
  const builder = document.querySelector('.combo-builder-grid');
  const card = document.querySelector('.combo-step-card');
  if (!customer || !next || !builder || !card) return;

  customer.hidden = true;
  customer.classList.add('combo-mobile-customer-step');
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'combo-mobile-back';
  back.textContent = '← Back to frame selection';
  back.addEventListener('click', () => {
    customer.hidden = true;
    builder.hidden = false;
    card.scrollIntoView({behavior:'smooth', block:'start'});
  });
  customer.querySelector('.combo-customer-fields').prepend(back);

  next.onclick = () => {
    const slots = window.JOEL_COMBO_SLOTS;
    // combo.js keeps its selections private; photo completeness is reflected in the summary labels.
    const summaryItems = [...document.querySelectorAll('.combo-summary-item')];
    const missingIndex = summaryItems.findIndex(item => /Photo not added/.test(item.textContent));
    if (missingIndex >= 0) {
      summaryItems[missingIndex].click();
      alert(`Please upload a photo for Frame ${missingIndex + 1} before continuing.`);
      card.scrollIntoView({behavior:'smooth', block:'start'});
      return;
    }
    customer.hidden = false;
    builder.hidden = true;
    customer.scrollIntoView({behavior:'smooth', block:'start'});
  };
  // Let the customer edit frames without losing progress when returning from checkout.
  document.querySelectorAll('.combo-summary-item').forEach(item => item.addEventListener('click', () => {
    if (!customer.hidden) {
      customer.hidden = true;
      builder.hidden = false;
    }
  }));
})();
