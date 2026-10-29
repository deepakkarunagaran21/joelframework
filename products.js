const PRODUCTS = [
 {id:'frame-10x8', name:'Classic Portrait Frame', size:'10 × 8', price:300, photos:1, finish:'Ivory & Gold', image:'assets/cover-10x8.png', label:'EVERYDAY'},
 {id:'frame-12x8', name:'Classic Memory Frame', size:'12 × 8', price:350, photos:1, finish:'Ivory & Gold', image:'assets/cover-12x8.png', label:'POPULAR'},
 {id:'frame-12x10', name:'Classic Family Frame', size:'12 × 10', price:380, photos:1, finish:'Champagne Gold', image:'assets/cover-12x10.png', label:'POPULAR'},
 {id:'frame-15x10', name:'Classic Couple Frame', size:'15 × 10', price:500, photos:1, finish:'Charcoal', image:'assets/cover-15x10.png', label:'BESTSELLER'},
 {id:'frame-15x12', name:'Premium Display Frame', size:'15 × 12', price:580, photos:1, finish:'Ivory & Gold', image:'assets/cover-15x12.png', label:'PREMIUM'},
 {id:'frame-18x12', name:'Statement Wall Frame', size:'18 × 12', price:750, photos:1, finish:'Classic Black', image:'assets/cover-18x12.png', label:'STATEMENT'},
 {id:'frame-20x16', name:'Premium Wall Frame', size:'20 × 16', price:1000, photos:1, finish:'Charcoal', image:'assets/cover-20x16.png', label:'PREMIUM'},
 {id:'frame-20x30', name:'Grand Gallery Frame', size:'20 × 30', price:2500, photos:1, finish:'Classic Black', image:'assets/cover-20x30.png', label:'GRAND'}
];
function productCover(p){return p.image}
function productCard(p){return `<article class="product-card"><div class="product-image"><img src="${productCover(p)}" alt="${p.name}" loading="lazy"><span class="cover-slot">PRODUCT COVER<br><small>${p.image}</small></span><span class="product-tag">${p.label}</span></div><div class="product-info"><div class="product-size">${p.size} · 1 photo</div><h3>${p.name}</h3><p>Premium frame with photo printing and clean presentation.</p><div class="product-bottom"><strong>₹${p.price.toLocaleString('en-IN')}</strong><a class="product-link" href="product.html?id=${p.id}">Show details</a></div></div></article>`}
document.addEventListener('error', e => { const img=e.target; if(img instanceof HTMLImageElement && img.closest('.product-image')){img.style.display='none';img.closest('.product-image').classList.add('asset-missing')} }, true);
