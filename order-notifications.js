(function(){
  const cfg=window.JOEL_ORDER_CONFIG||{};
  const emailConfigured=()=>!!(cfg.emailJsServiceId&&cfg.emailJsTemplateId&&cfg.emailJsPublicKey&&!/YOUR_/.test(cfg.emailJsServiceId+cfg.emailJsTemplateId+cfg.emailJsPublicKey));
  const toDataUrl=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob)});
  async function sendEmail({subject,message,files,previewFile}){
    if(!emailConfigured()) return {sent:false,reason:'EmailJS is not configured yet. Add the service ID, template ID and public key in order-config.js.'};
    if(!window.emailjs||!window.JSZip) return {sent:false,reason:'Email sending libraries could not load. Check the internet connection and reload.'};
    const zip=new JSZip();
    zip.file('ORDER-DETAILS.txt',message);
    for(const file of files){zip.file(file.name,file)}
    const zipBlob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:4}});
    if(zipBlob.size>18*1024*1024) return {sent:false,reason:'This order’s image bundle is larger than 18 MB. Reduce photo sizes or use the manual download fallback.'};
    const preview=previewFile||files.find(f=>/preview/i.test(f.name))||files[0];
    if(!preview) return {sent:false,reason:'No preview image was generated.'};
    const [zipData,previewData]=await Promise.all([toDataUrl(zipBlob),toDataUrl(preview)]);
    await emailjs.send(cfg.emailJsServiceId,cfg.emailJsTemplateId,{
      to_email:cfg.ownerEmail,
      subject,
      order_message:message,
      order_bundle:zipData,
      order_preview:previewData,
      attachment_filename:`Joel-Frame-Works-${Date.now()}-order.zip`,
      preview_filename:preview.name
    });
    return {sent:true,size:zipBlob.size};
  }
  function openWhatsApp(message){
    const url=`https://wa.me/${cfg.ownerWhatsApp||'918610493135'}?text=${encodeURIComponent(message)}`;
    return window.open(url,'_blank','noopener');
  }
  function download(file){const a=document.createElement('a'),u=URL.createObjectURL(file);a.href=u;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000)}
  async function shareOrderFiles({files,message,filename}){
    if(!window.JSZip) throw new Error('The ZIP library could not load. Please reload the website and try again.');
    const zip=new JSZip();
    for(const file of files) zip.file(file.name,file);
    zip.file('WHATSAPP-ORDER-MESSAGE.txt',message);
    const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:4}});
    const bundle=new File([blob],filename||`Joel-Frame-Works-order-${Date.now()}.zip`,{type:'application/zip'});
    // On browsers with file sharing, the customer can choose WhatsApp from the native share sheet.
    // A normal wa.me URL cannot attach files or choose a recipient programmatically.
    if(navigator.share && navigator.canShare && navigator.canShare({files:[bundle]})){
      try{await navigator.share({title:'Joel Frame Work’s order',text:message,files:[bundle]});return {mode:'shared',fileName:bundle.name};}
      catch(err){if(err&&err.name==='AbortError') return {mode:'cancelled',fileName:bundle.name};}
    }
    download(bundle);
    return {mode:'downloaded',fileName:bundle.name};
  }
  window.JoelOrderNotifications={sendEmail,openWhatsApp,download,shareOrderFiles,emailConfigured,ownerEmail:cfg.ownerEmail,ownerWhatsApp:cfg.ownerWhatsApp||'918610493135'};
})();
