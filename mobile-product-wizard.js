/* Mobile-only 3-step frame ordering flow. Desktop order form stays unchanged. */
(() => {
  if (!window.matchMedia('(max-width: 620px)').matches) return;
  const orderSection = document.querySelector('#order');
  const grid = document.querySelector('.product-order-grid');
  const formCard = document.querySelector('.order-form-card');
  const preview = document.querySelector('.live-product-preview');
  const steps = [...formCard.querySelectorAll(':scope > .order-step')];
  const orderButton = document.querySelector('#productPlaceOrder');
  const orderStatus = document.querySelector('#productOrderStatus');
  if (!orderSection || !grid || steps.length !== 3 || !preview || !orderButton) return;

  orderSection.classList.add('mobile-order-wizard');
  const oldHead = orderSection.querySelector('.section-head');
  const wizard = document.createElement('div');
  wizard.className = 'mobile-wizard';
  wizard.innerHTML = `
    <div class="mobile-wizard-heading"><p class="eyebrow">PERSONALISE YOUR FRAME</p><h2 id="mobileWizardTitle">Choose your frame</h2><p id="mobileWizardDescription">Select your size, frame design and finish.</p></div>
    <div class="mobile-wizard-progress" aria-label="Order steps">
      <div class="wizard-progress-step active"><span>1</span><small>Choose</small></div><i></i>
      <div class="wizard-progress-step"><span>2</span><small>Upload</small></div><i></i>
      <div class="wizard-progress-step"><span>3</span><small>Details</small></div>
    </div>`;
  oldHead?.replaceWith(wizard);

  const panels = steps.map((step, index) => {
    const panel = document.createElement('div');
    panel.className = 'mobile-wizard-panel';
    panel.dataset.step = String(index + 1);
    panel.appendChild(step);
    formCard.appendChild(panel);
    return panel;
  });
  // Mobile shopping flow: upload first, then show the live preview followed by compact frame-pattern choices.
  panels[1].appendChild(preview);
  const designHeading = formCard.querySelector('.selector-heading');
  const designOptions = formCard.querySelector('#frameDesignOptions');
  const finishOptions = formCard.querySelector('.finish-options');
  const designPicker = document.createElement('section');
  designPicker.className = 'mobile-frame-picker';
  designPicker.innerHTML = '<div class="mobile-frame-picker-head"><div><p class="mobile-picker-eyebrow">PERSONALISE THE LOOK</p><h3>Choose a frame pattern</h3><p>Tap a pattern to update your preview.</p></div><span class="mobile-picker-count">8 styles</span></div>';
  if (designHeading) designHeading.remove();
  if (designOptions) designPicker.appendChild(designOptions);
  if (finishOptions) designPicker.appendChild(finishOptions);
  const catalogLink = document.createElement('a');
  catalogLink.className = 'mobile-frame-catalog-link';
  catalogLink.href = 'assets/frame-samples-catalog.pdf';
  catalogLink.setAttribute('download', 'Joel-Frame-Works-Frame-Samples.pdf');
  catalogLink.innerHTML = '<span aria-hidden="true">⇩</span><span><strong>View more frame patterns</strong><small>Download the frame samples PDF</small></span>';
  designPicker.appendChild(catalogLink);
  panels[1].appendChild(designPicker);
  const actions = document.createElement('div');
  actions.className = 'mobile-wizard-actions';
  actions.innerHTML = '<button type="button" class="wizard-back" hidden>Back</button><button type="button" class="btn gold wizard-next">Next</button>';
  panels[2].appendChild(orderButton);
  panels[2].appendChild(orderStatus);
  formCard.appendChild(actions);
  const back = actions.querySelector('.wizard-back');
  const next = actions.querySelector('.wizard-next');
  const title = document.querySelector('#mobileWizardTitle');
  const description = document.querySelector('#mobileWizardDescription');
  const progress = [...wizard.querySelectorAll('.wizard-progress-step')];
  const titles = [
    ['Choose your frame', 'Select the size, frame design and finish you prefer.'],
    ['Upload & choose pattern', 'Upload your photo, then select a frame pattern below the preview.'],
    ['Your details', 'Enter your contact and delivery information, then place your order.']
  ];
  let current = 1;

  function showStep(step) {
    current = step;
    orderSection.dataset.mobileStep = String(step);
    panels.forEach((panel, index) => panel.hidden = index + 1 !== step);
    progress.forEach((item, index) => {
      item.classList.toggle('active', index + 1 === step);
      item.classList.toggle('complete', index + 1 < step);
    });
    title.textContent = titles[step - 1][0];
    description.textContent = titles[step - 1][1];
    back.hidden = step === 1;
    next.hidden = step === 3;
    next.textContent = step === 1 ? 'Next: Upload photo' : 'Next: Your details';
    orderButton.textContent = 'Order Now';
    if (orderStatus) orderStatus.hidden = true;
  }
  next.addEventListener('click', () => {
    if (current === 2) {
      const fileInput = document.querySelector('#productPhotoUpload');
      if (!fileInput?.files?.length) {
        alert('Please upload your photo before continuing.');
        fileInput?.focus();
        return;
      }
    }
    showStep(Math.min(3, current + 1));
    orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  back.addEventListener('click', () => {
    showStep(Math.max(1, current - 1));
    orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('.detail-copy a.btn[href="#order"], .nav-cta[href="#order"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showStep(1);
      orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  showStep(1);
})();
