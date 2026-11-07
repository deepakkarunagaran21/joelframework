(function(){
 const $=s=>document.querySelector(s),status=$('#checkoutStatus'),button=$('#payNowButton');
 const draftKey='joelFrameCheckoutDraft';let draft=null;
 try{draft=JSON.parse(sessionStorage.getItem(draftKey)||'null')}catch(e){}
 const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
 function showStatus(message,error){status.hidden=false;status.textContent=message;status.classList.toggle('is-error',!!error)}
 if(!draft||!draft.orderId){showStatus('Your checkout session is missing. Please return to the product or combo page and submit your order again.',true);button.disabled=true;return}
 $('#checkoutName').value=draft.customer?.name||'';
 $('#checkoutPhone').value=draft.customer?.phone||'';
 $('#checkoutAddress').value=draft.customer?.address||'';
 $('#checkoutItemName').textContent=draft.itemName||'Joel Frame Works order';
 $('#checkoutItemDescription').textContent=draft.description||'Personalised photo frame';
 $('#checkoutItemType').textContent=(draft.orderType||'order').toUpperCase();
 $('#checkoutOrderId').textContent='Order ID: '+draft.orderId;
 $('#checkoutSubtotal').textContent=money(draft.amount);$('#checkoutTotal').textContent=money(draft.amount);
 $('#checkoutThumb').textContent=draft.orderType==='combo'?'COMBO':'JF';
 function supabaseClient(){const c=window.JOEL_SUPABASE_CONFIG||{};if(!window.supabase||!c.url||!c.anonKey)throw new Error('Supabase configuration is missing.');return window.supabase.createClient(c.url,c.anonKey)}
 async function startPayment(){
  const name=$('#checkoutName').value.trim(),phone=$('#checkoutPhone').value.trim(),address=$('#checkoutAddress').value.trim();
  if(!name||!phone||!address){showStatus('Please complete your name, mobile number and delivery address.',true);return}
  if(phone.replace(/\D/g,'').length<10){showStatus('Please enter a valid mobile number.',true);return}
  if(!window.Razorpay){showStatus('Razorpay Checkout could not load. Please refresh and try again.',true);return}
  button.disabled=true;button.textContent='PREPARING SECURE PAYMENT…';
  try{
   const db=supabaseClient();
   const created=await db.functions.invoke('create-razorpay-order',{body:{orderId:draft.orderId,customer:{name,phone,address}}});
   if(created.error)throw new Error(created.error.message||'Could not create payment order.');
   const data=created.data||{};if(!data.keyId||!data.razorpayOrderId)throw new Error(data.error||'Payment gateway is not configured yet.');
   const options={key:data.keyId,amount:data.amount,currency:data.currency||'INR',name:"Joel Frame Work's",description:draft.itemName||'Photo frame order',order_id:data.razorpayOrderId,prefill:{name,contact:phone},notes:{joel_order_id:draft.orderId},theme:{color:'#b88b3e'},modal:{ondismiss:function(){button.disabled=false;button.innerHTML='CONTINUE TO PAYMENT <span>→</span>';showStatus('Payment window closed. Your order is saved and payment is still pending.',true)}},handler:async function(response){
    button.disabled=true;button.textContent='VERIFYING PAYMENT…';
    try{
     const verified=await db.functions.invoke('verify-razorpay-payment',{body:{orderId:draft.orderId,razorpayOrderId:response.razorpay_order_id,razorpayPaymentId:response.razorpay_payment_id,razorpaySignature:response.razorpay_signature}});
     if(verified.error||!verified.data?.verified)throw new Error(verified.data?.error||verified.error?.message||'Payment verification failed.');
     sessionStorage.removeItem(draftKey);showStatus('Payment successful! Your order '+draft.orderId+' is confirmed.');button.textContent='PAYMENT COMPLETED';button.disabled=true;
     const success=document.createElement('a');success.href='index.html';success.className='checkout-success-link';success.textContent='CONTINUE SHOPPING';button.insertAdjacentElement('afterend',success);
    }catch(err){showStatus('Payment received but verification needs attention. Please contact Joel Frame Works with order ID '+draft.orderId+'. '+err.message,true);button.disabled=false;button.innerHTML='RETRY VERIFICATION'}
   }};
   const razorpay=new Razorpay(options);razorpay.on('payment.failed',function(response){showStatus(response.error?.description||'Payment failed. You can try again.',true);button.disabled=false;button.innerHTML='RETRY PAYMENT'});razorpay.open();button.textContent='PAYMENT WINDOW OPEN';
  }catch(err){console.error(err);showStatus(err.message||'Payment could not be started.',true);button.disabled=false;button.innerHTML='CONTINUE TO PAYMENT <span>→</span>'}
 }
 button.addEventListener('click',startPayment);
})();