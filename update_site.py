from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
from pathlib import Path
import re, shutil, os
root=Path('/mnt/data/joel_update_work')
assets=root/'assets'
# Actual moulding strip crops sourced from the uploaded FRAME SAMPLES PDF.
regions = [
    ('01-honeycomb',3,(340,410,430,800),'Dark Honeycomb'),
    ('02-geometric',4,(335,410,405,800),'Geometric Bronze'),
    ('03-textured',5,(320,410,385,800),'Textured Charcoal'),
    ('04-ornate',6,(340,410,420,800),'Ornamental Diamond'),
    ('05-ruby',7,(340,410,435,800),'Ruby Carved'),
    ('06-dark',9,(350,410,430,800),'Black Relief'),
    ('07-circles',11,(340,410,420,800),'Circle Carve'),
    ('08-woven',14,(350,410,425,800),'Basket Weave'),
]
for idx,(slug,page,box,label) in enumerate(regions,1):
    pageim=Image.open(f'/mnt/data/joel_update_work/pdfpages/page-{page:02d}.jpg').convert('RGB')
    strip=pageim.crop(box)
    # Trim noisy ends and gently sharpen actual product texture.
    strip=ImageEnhance.Contrast(strip).enhance(1.12)
    strip=ImageEnhance.Color(strip).enhance(1.05)
    strip=strip.filter(ImageFilter.UnsharpMask(radius=1.5, percent=125, threshold=3))
    strip.save(assets/f'frame-design-{idx:02d}.jpg',quality=92,optimize=True)
    # Build a four-sided frame texture from the real photographed moulding strip.
    W,H=600,760
    border=46
    frame=Image.new('RGBA',(W,H),(0,0,0,0))
    # Create a longer, seamless-looking vertical grain strip; top/bottom follow the moulding direction.
    vertical=strip.resize((border,H),Image.Resampling.LANCZOS).convert('RGBA')
    horizontal=strip.rotate(90,expand=True).resize((W,border),Image.Resampling.LANCZOS).convert('RGBA')
    frame.alpha_composite(vertical,(0,0)); frame.alpha_composite(vertical,(W-border,0))
    frame.alpha_composite(horizontal,(0,0)); frame.alpha_composite(horizontal,(0,H-border))
    # Thin dark inner bevel and subtle outer edge for a premium physical moulding effect.
    d=ImageDraw.Draw(frame)
    d.rectangle((border-2,border-2,W-border+1,H-border+1),outline=(24,20,17,210),width=3)
    d.rectangle((2,2,W-3,H-3),outline=(235,220,185,105),width=2)
    frame.save(assets/f'frame-border-{idx:02d}.png',optimize=True)

js=root/'product-page.js'
s=js.read_text()
s=s.replace("const designs=[['Classic Black','design-classic','#202020'],['Black & Gold','design-gold','#30251b'],['Dark Walnut','design-walnut','#4b2c20'],['Charcoal Texture','design-charcoal','#4b4b4b'],['Ruby Geometric','design-ruby','#6b2639'],['Basket Weave','design-weave','#292a29'],['Floral Carve','design-floral','#292321'],['Antique Bronze','design-bronze','#59432c']];let selectedDesign=0,files=[];",
"const designs=[['Dark Honeycomb','design-honeycomb','assets/frame-design-01.jpg','assets/frame-border-01.png'],['Geometric Bronze','design-geometric','assets/frame-design-02.jpg','assets/frame-border-02.png'],['Textured Charcoal','design-textured','assets/frame-design-03.jpg','assets/frame-border-03.png'],['Ornamental Diamond','design-ornate','assets/frame-design-04.jpg','assets/frame-border-04.png'],['Ruby Carved','design-ruby','assets/frame-design-05.jpg','assets/frame-border-05.png'],['Black Relief','design-relief','assets/frame-design-06.jpg','assets/frame-border-06.png'],['Circle Carve','design-circles','assets/frame-design-07.jpg','assets/frame-border-07.png'],['Basket Weave','design-weave','assets/frame-design-08.jpg','assets/frame-border-08.png']];let selectedDesign=0,files=[];")
s=s.replace("function drawDesigns(){const box=$('#frameDesignOptions');box.innerHTML='';designs.forEach(([name,cls,color],i)=>{const b=document.createElement('button');b.type='button';b.className='frame-design-option'+(i===selectedDesign?' active':'');b.setAttribute('aria-label',name);b.title=name;b.innerHTML=`<span class=\"design-swatch ${cls}\"><i></i></span><small>${name}</small>`;b.onclick=()=>{selectedDesign=i;drawDesigns();updatePreviewShape();$('#previewFinish').textContent=name;};box.appendChild(b)})}",
"function drawDesigns(){const box=$('#frameDesignOptions');box.innerHTML='';designs.forEach(([name,cls,thumb],i)=>{const b=document.createElement('button');b.type='button';b.className='frame-design-option'+(i===selectedDesign?' active':'');b.setAttribute('aria-label',name);b.title=name;b.setAttribute('aria-pressed',i===selectedDesign?'true':'false');b.innerHTML=`<span class=\"design-photo\"><img src=\"${thumb}\" alt=\"${name} actual moulding\" loading=\"lazy\"></span><small>${name}</small>`;b.onclick=()=>{selectedDesign=i;drawDesigns();updatePreviewShape();$('#previewFinish').textContent=name;};box.appendChild(b)})}")
s=s.replace("function updatePreviewShape(){const frame=$('#productPreviewFrame');frame.className='product-preview-frame '+designs[selectedDesign][1];const ratio=product.size==='20 × 30'?2/3:product.size==='20 × 16'?0.8:product.size==='18 × 12'?2/3:product.size==='15 × 12'?0.8:product.size==='15 × 10'?2/3:product.size==='12 × 10'?0.833:product.size==='12 × 8'?2/3:0.8;frame.style.setProperty('--frame-ratio',ratio);}",
"function updatePreviewShape(){const frame=$('#productPreviewFrame');frame.className='product-preview-frame '+designs[selectedDesign][1];frame.style.setProperty('--frame-image',`url(\"${designs[selectedDesign][3]}\")`);const ratio=product.size==='20 × 30'?2/3:product.size==='20 × 16'?0.8:product.size==='18 × 12'?2/3:product.size==='15 × 12'?0.8:product.size==='15 × 10'?2/3:product.size==='12 × 10'?0.833:product.size==='12 × 8'?2/3:0.8;frame.style.setProperty('--frame-ratio',ratio);}")
# Improve photo cropping in preview; uploaded image shouldn't sit inside a blank white letterbox.
s=s.replace("img.style.display='block';empty.style.display='none'", "img.style.display='block';empty.style.display='none'")
js.write_text(s)

css=root/'styles.css'
with css.open('a') as f:
    f.write('''\n/* Premium real-moulding selector and photo-tight live preview */
.frame-design-options{grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:12px 0 20px}
.frame-design-option{padding:7px 7px 8px;border:1px solid #e6dccb;border-radius:2px;transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease;overflow:hidden}
.frame-design-option:hover{border-color:#c5a15e;transform:translateY(-1px)}
.frame-design-option.active{border-color:#b88b3e;box-shadow:0 0 0 1px #b88b3e,0 5px 16px rgba(65,43,16,.09)}
.design-photo{display:block;width:100%;height:66px;background:#282421;overflow:hidden;border:1px solid #d9c9aa}
.design-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 48%;}
.frame-design-option small{display:block;font-size:10px;line-height:1.3;margin-top:8px;min-height:26px;color:#332c24;font-weight:600;letter-spacing:.05px}
.product-preview-frame{position:relative;background-color:#211e1b;background-image:var(--frame-image)!important;background-size:100% 100%!important;background-position:center;background-repeat:no-repeat;padding:0!important;overflow:hidden;isolation:isolate;min-height:0}
.product-preview-frame .preview-mat{position:absolute;inset:6.8%;width:auto;height:auto;min-height:0;padding:0!important;margin:0;background:transparent;box-shadow:none;overflow:hidden;display:flex;align-items:stretch;justify-content:stretch}
.product-preview-frame .preview-mat img{width:100%;height:100%;object-fit:cover!important;object-position:center;display:none;background:transparent}
.product-preview-frame .preview-mat div{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%;background:#f4f0e7;padding:14px}
.product-preview-frame .preview-mat div small{margin-top:8px}
@media(max-width:620px){.frame-design-options{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.frame-design-option{padding:4px 3px 6px}.design-photo{height:43px}.frame-design-option small{font-size:8px;line-height:1.2;min-height:24px;margin-top:5px}.product-preview-frame .preview-mat{inset:7%}}
''')
print('assets made', len(regions)*2)
