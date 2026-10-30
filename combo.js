const COMBOS={
 'combo-1':{name:'Combo Offer 1',price:999,groups:[['12 × 18',3]]},
 'combo-2':{name:'Combo Offer 2',price:999,groups:[['12 × 8',4],['6 × 4',2]]},
 'combo-3':{name:'Combo Offer 3',price:1200,groups:[['12 × 18',1],['12 × 8',4],['6 × 4',2]]},
 'combo-4':{name:'Combo Offer 4',price:999,groups:[['12 × 8',3],['6 × 4',5]]},
 'combo-5':{name:'Combo Offer 5',price:1200,groups:[['12 × 18',3],['12 × 8',3]]}
};
const DESIGNS=[['Dark Honeycomb','design-honeycomb','assets/frame-design-01.jpg','assets/frame-border-01.png'],['Geometric Bronze','design-geometric','assets/frame-design-02.jpg','assets/frame-border-02.png'],['Textured Charcoal','design-textured','assets/frame-design-03.jpg','assets/frame-border-03.png'],['Ornamental Diamond','design-ornate','assets/frame-design-04.jpg','assets/frame-border-04.png'],['Ruby Carved','design-ruby','assets/frame-design-05.jpg','assets/frame-border-05.png'],['Black Relief','design-relief','assets/frame-design-06.jpg','assets/frame-border-06.png'],['Circle Carve','design-circles','assets/frame-design-07.jpg','assets/frame-border-07.png'],['Basket Weave','design-weave','assets/frame-design-08.jpg','assets/frame-border-08.png']];
const id=new URLSearchParams(location.search).get('id')||'combo-1',combo=COMBOS[id]||COMBOS['combo-1'];const slots=[];combo.groups.forEach(([size,count])=>{for(let i=0;i<count;i++)slots.push({size,file:null,design:0})});let current=0;const $=s=>document.querySelector(s);const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#comboTitle').textContent=combo.name;$('#comboPrice').textContent=`₹${combo.price.toLocaleString('en-IN')}`;document.title=`${combo.name} | Joel Frame Work's`;
function ratio(size){return size==='12 × 18'?'2 / 3':'3 / 2'}
function drawDesigns(){const box=$('#comboDesigns');box.innerHTML='';DESIGNS.forEach(([name,cls,thumb,border],i)=>{const b=document.createElement('button');b.type='button';b.className='combo-design-option'+(slots[current].design===i?' active':'');b.setAttribute('aria-pressed',slots[current].design===i?'true':'false');b.innerHTML=`<img src="${thumb}" alt="${name} frame moulding"><span>${name}</span>`;b.onclick=()=>{slots[current].design=i;drawDesigns();updatePreview();renderSummary()};box.appendChild(b)})}
function updatePreview(){const slot=slots[current],design=DESIGNS[slot.design];$('#slotSize').textContent=`${slot.size} inch · Frame ${current+1}`;$('#previewSize').textContent=slot.size;$('#previewFrameIndex').textContent=`Frame ${current+1} of ${slots.length}`;$('#previewDesignName').textContent=design[0];$('#stepNumber').textContent=String(current+1).padStart(2,'0');$('#stepTitle').textContent=`Choose photo for frame ${current+1}`;$('#stepSub').textContent=`This is frame ${current+1} of ${slots.length}. Upload its photo and select the design for this ${slot.size} frame.`;$('#progressLabel').textContent=`Frame ${current+1} of ${slots.length}`;$('#progressFill').style.width=`${((current+1)/slots.length)*100}%`;$('#previousFrame').disabled=current===0;$('#nextFrame').textContent=current===slots.length-1?'Review all frames ↓':'Save & next frame →';$('#comboLiveFrame').className=`combo-live-frame ${design[1]}`;$('#comboLiveFrame').style.setProperty('--frame-image',`url("${design[3]}")`);$('#comboLiveFrame').style.setProperty('--frame-ratio',ratio(slot.size));const im=$('#comboPreviewImage'),empty=$('#comboPreviewEmpty');if(slot.file){im.src=URL.createObjectURL(slot.file);im.style.display='block';empty.style.display='none';$('#currentPhotoStatus').textContent=`Selected: ${slot.file.name}`;$('#uploadTitle').textContent='Change selected photo'}else{im.removeAttribute('src');im.style.display='none';empty.style.display='flex';$('#currentPhotoStatus').textContent='No photo selected yet.';$('#uploadTitle').textContent='Choose a photo from your device'}$('#comboPhoto').value='';drawDesigns()}
function renderSummary(){const list=$('#comboSummary');list.innerHTML='';slots.forEach((slot,i)=>{const d=DESIGNS[slot.design];const item=document.createElement('button');item.type='button';item.className='combo-summary-item'+(i===current?' active':'');item.innerHTML=`<span class="summary-thumb">${slot.file?`<img src="${URL.createObjectURL(slot.file)}" alt="">`:'＋'}</span><span><strong>Frame ${i+1} · ${slot.size}</strong><small>${slot.file?esc(slot.file.name):'Photo not added'}<br>${d[0]}</small></span><span class="summary-edit">Edit</span>`;item.onclick=()=>{current=i;updatePreview();renderSummary()};list.appendChild(item)});$('#summaryCount').textContent=`${slots.filter(s=>s.file).length} / ${slots.length} photos added`}
$('#comboPhoto').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(f.size>8*1024*1024){alert('Please choose an image smaller than 8 MB.');e.target.value='';return}if(!['image/jpeg','image/png','image/webp'].includes(f.type)){alert('Please choose a JPG, PNG or WEBP image.');e.target.value='';return}slots[current].file=f;updatePreview();renderSummary()});$('#previousFrame').onclick=()=>{if(current>0){current--;updatePreview();renderSummary()}};$('#nextFrame').onclick=()=>{if(current<slots.length-1){current++;updatePreview();renderSummary()}else{$('#comboCustomerDetails').scrollIntoView({behavior:'smooth',block:'start'})}};
function makeOrderId(){return 'JFW-C-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+Math.random().toString(36).slice(2,6).toUpperCase()}
async function imageFileToPreview(slot,index,orderId){
  const [name,cls,thumb,borderPath]=DESIGNS[slot.design];
  const portrait=slot.size==='12 × 18';
  const canvas=document.createElement('canvas');canvas.width=portrait?900:1200;canvas.height=portrait?1350:800;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#f5f0e7';ctx.fillRect(0,0,canvas.width,canvas.height);
  const loadImage=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
  const photo=await createImageBitmap(slot.file);
  // Crop the chosen photo to fill the inner print area, matching the live frame preview.
  const marginX=Math.round(canvas.width*.105),marginY=Math.round(canvas.height*.105),innerW=canvas.width-marginX*2,innerH=canvas.height-marginY*2;
  const scale=Math.max(innerW/photo.width,innerH/photo.height),sw=innerW/scale,sh=innerH/scale,sx=(photo.width-sw)/2,sy=(photo.height-sh)/2;
  ctx.drawImage(photo,sx,sy,sw,sh,marginX,marginY,innerW,innerH);photo.close?.();
  const border=await loadImage(borderPath);ctx.drawImage(border,0,0,canvas.width,canvas.height);
  // Label below the mock frame so the owner can match each preview to the order.
  const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height+105;const ox=out.getContext('2d');ox.fillStyle='#fff';ox.fillRect(0,0,out.width,out.height);ox.drawImage(canvas,0,0);ox.fillStyle='#181818';ox.font='bold 30px Arial';ox.fillText(`Frame ${index+1} · ${slot.size} inch`,24,canvas.height+40);ox.font='24px Arial';ox.fillText(name,24,canvas.height+76);
  const blob=await new Promise(resolve=>out.toBlob(resolve,'image/png'));return new File([blob],`${orderId}-frame-${String(index+1).padStart(2,'0')}-preview.png`,{type:'image/png'});
}
function downloadFile(file){const a=document.createElement('a');const u=URL.createObjectURL(file);a.href=u;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000)}
function makeContactSheet(previewFiles,orderId){
  return new Promise(async(resolve,reject)=>{try{const cols=2,cellW=500,cellH=760,rows=Math.ceil(previewFiles.length/cols),canvas=document.createElement('canvas');canvas.width=cols*cellW;canvas.height=rows*cellH;const ctx=canvas.getContext('2d');ctx.fillStyle='#f7f3eb';ctx.fillRect(0,0,canvas.width,canvas.height);for(let i=0;i<previewFiles.length;i++){const url=URL.createObjectURL(previewFiles[i]);try{const im=await new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=url});const x=(i%cols)*cellW,y=Math.floor(i/cols)*cellH;const scale=Math.min((cellW-24)/im.width,(cellH-24)/im.height);const w=im.width*scale,h=im.height*scale;ctx.drawImage(im,x+(cellW-w)/2,y+(cellH-h)/2,w,h)}finally{URL.revokeObjectURL(url)}}canvas.toBlob(blob=>blob?resolve(new File([blob],`${orderId}-all-frame-previews.png`,{type:'image/png'})):reject(new Error('Could not create preview sheet')),'image/png') }catch(e){reject(e)}})
}
$('#sendComboOrder').onclick=async()=>{
 const button=$('#sendComboOrder'),status=$('#comboOrderStatus');
 const name=$('#comboCustomerName').value.trim(),phone=$('#comboCustomerPhone').value.trim(),address=$('#comboCustomerAddress').value.trim();
 if(!name||!phone||!address){alert('Please enter your name, mobile number and address.');return}
 const missing=slots.findIndex(s=>!s.file);
 if(missing>=0){current=missing;updatePreview();renderSummary();alert('Please add a photo for Frame '+(missing+1));return}
 const orderId=makeOrderId();status.hidden=false;button.disabled=true;button.textContent='Uploading to Supabase…';
 try{
  const previews=[];
  for(let i=0;i<slots.length;i++)previews.push(await imageFileToPreview(slots[i],i,orderId));
  const sheet=await makeContactSheet(previews,orderId),uploadFiles=[];
  slots.forEach((slot,i)=>{const ext=(slot.file.name.split('.').pop()||'jpg').toLowerCase();uploadFiles.push(new File([slot.file],orderId+'-frame-'+(i+1)+'-original.'+ext,{type:slot.file.type||'image/jpeg'}));uploadFiles.push(previews[i])});
  uploadFiles.push(sheet);
  const links=await window.JoelOrderNotifications.uploadOrderFiles({orderId,files:uploadFiles});
  const frames=slots.map((slot,i)=>({frame:i+1,size:slot.size,design:DESIGNS[slot.design][0],original:links[i*2].url,preview:links[i*2+1].url}));
  const details={comboId:id,comboName:combo.name,frames:frames,contactSheet:links[links.length-1].url};
  await window.JoelOrderNotifications.saveOrder({orderId,orderType:'combo',customer:{name,phone,address},totalPrice:combo.price,details,imageLinks:links});
  const lines=frames.map(f=>'Frame '+f.frame+' '+f.size+' '+f.design+'\nOriginal: '+f.original+'\nPreview: '+f.preview).join('\n\n');
  const message='NEW JOEL FRAME WORK COMBO ORDER\nOrder ID: '+orderId+'\nCombo: '+combo.name+'\nPrice: ₹'+combo.price+'\nCustomer: '+name+'\nPhone: '+phone+'\nAddress: '+address+'\n\n'+lines+'\n\nCombined preview: '+details.contactSheet+'\nSaved in Supabase.';
  window.JoelOrderNotifications.openWhatsApp(message);
  status.innerHTML='<strong>Order '+esc(orderId)+' saved in Supabase.</strong><br>WhatsApp opened with all original photo and preview links.';
 }catch(e){console.error(e);status.textContent='Order failed: '+(e.message||String(e))}
 finally{button.disabled=false;button.textContent='Order Now · Send to WhatsApp';status.scrollIntoView({behavior:'smooth',block:'nearest'})}
};