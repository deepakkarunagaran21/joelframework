/* Mobile-only layout adjustment for combo personalisation.
   Desktop DOM order and styling remain unchanged. */
(function(){
  const mq = window.matchMedia('(max-width: 620px)');
  const step = document.querySelector('.combo-step-card');
  const preview = document.querySelector('.combo-preview-card');
  if (!step || !preview) return;
  const heading = step.querySelector('.combo-design-heading');
  const description = heading && heading.nextElementSibling;
  const designs = document.getElementById('comboDesigns');
  const catalog = step.querySelector('.combo-frame-catalog-link');
  const actions = step.querySelector('.combo-step-actions');
  const note = preview.querySelector('.preview-note');
  const summaryTitle = preview.querySelector('.combo-summary-title');
  if (!heading || !description || !designs || !catalog || !actions || !note || !summaryTitle) return;
  const marker = document.createComment('original frame selector position');
  step.insertBefore(marker, heading);
  function place(){
    if (mq.matches) {
      // Put the moulding selector and PDF link immediately after the live preview.
      preview.insertBefore(heading, summaryTitle);
      preview.insertBefore(description, summaryTitle);
      preview.insertBefore(designs, summaryTitle);
      preview.insertBefore(catalog, summaryTitle);
      // Keep navigation controls with the photo upload step for a clear one-frame workflow.
      actions.classList.add('combo-mobile-actions');
      preview.classList.add('combo-mobile-preview-layout');
    } else {
      marker.parentNode.insertBefore(heading, marker.nextSibling);
      marker.parentNode.insertBefore(description, heading.nextSibling);
      marker.parentNode.insertBefore(designs, description.nextSibling);
      marker.parentNode.insertBefore(catalog, designs.nextSibling);
      actions.classList.remove('combo-mobile-actions');
      preview.classList.remove('combo-mobile-preview-layout');
    }
  }
  place();
  if (mq.addEventListener) mq.addEventListener('change', place); else mq.addListener(place);
})();
