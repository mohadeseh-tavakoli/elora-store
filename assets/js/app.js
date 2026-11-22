(() => {
 const products = window.ELORA_PRODUCTS || [];
 const $ = (s, root=document) => root.querySelector(s);
 const $$ = (s, root=document) => [...root.querySelectorAll(s)];
 const toman = n => new Intl.NumberFormat('fa-IR').format(n) + ' تومان';
 let wishlist = new Set(), cart = [], selectedProduct = null, activeQuizStep = 0;
 const filters = {use:[],size:[],fabric:[],color:[],pattern:[]};
 const toast = msg => { const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),2400); };
 const updateCounts = () => { $('#wish-count').textContent=wishlist.size; $('#cart-count').textContent=cart.reduce((a,b)=>a+b.qty,0); };
 function productCard(p) {
  return `<article class="product-card">
   <div class="product-photo" data-open="${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="wish-btn ${wishlist.has(p.id)?'active':''}" data-wish="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها">${wishlist.has(p.id)?'♥':'♡'}</button></div>
   <div class="product-info"><div><h3>${p.name}</h3><p>${p.fabric} · قواره ${p.size}</p></div><strong>${toman(p.price)}</strong></div>
   <button class="quick-add" data-add="${p.id}">افزودن به سبد خرید <span>＋</span></button>
  </article>`;
 }
 function renderProducts(list=products) {
  $('#product-grid').innerHTML=list.map(productCard).join('');
  $('#result-count').textContent=`${new Intl.NumberFormat('fa-IR').format(list.length)} محصول`;
  $('#empty-state').hidden=!!list.length;
 }
 function readFilters() {
  Object.keys(filters).forEach(k => filters[k]=$$(`input[name="${k}"]:checked`).map(x=>x.value));
 }
 function applyFilters() {
  readFilters();
  const filtered=products.filter(p=>Object.entries(filters).every(([k,vals])=>!vals.length || (k==='size'?vals.includes(p.size):vals.some(v=>(p[k]||[]).includes? p[k].includes(v):p[k]===v))));
  renderProducts(filtered);
  const labels=Object.entries(filters).flatMap(([k,vals])=>vals.map(v=>`<button class="filter-chip" data-remove="${k}:${v}">${v} ×</button>`));
  $('#active-filters').innerHTML=labels.join('');
 }
 function resetFilters() { $$('input[type="checkbox"]').forEach(x=>x.checked=false); Object.keys(filters).forEach(k=>filters[k]=[]); applyFilters(); }
 function openProduct(id) {
  const p=products.find(x=>x.id===Number(id)); if(!p)return; selectedProduct=p;
  const modal=document.createElement('div'); modal.className='modal-backdrop'; modal.id='product-modal';
  modal.innerHTML=`<div class="product-modal" role="dialog" aria-modal="true" aria-label="${p.name}"><button class="modal-close" aria-label="بستن">×</button><img src="${p.image}" alt="${p.name}"><div class="modal-detail"><p class="eyebrow">ÉLORA SELECTED</p><h2>${p.name}</h2><strong>${toman(p.price)}</strong><p>${p.description}</p><ul><li>جنس: ${p.fabric}</li><li>قواره: ${p.size} (${p.dimensions})</li><li>رنگ: ${p.color}</li><li>طرح: ${p.pattern}</li><li>موجودی نمونه: ${p.stock} عدد</li></ul><button class="btn btn-dark" data-modal-add="${p.id}">افزودن به سبد خرید</button></div></div>`;
  document.body.append(modal); modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.modal-close'))modal.remove();});
 }
 $('#product-grid').addEventListener('click',e=>{
  const wish=e.target.closest('[data-wish]'); if(wish){const id=Number(wish.dataset.wish); wishlist.has(id)?wishlist.delete(id):wishlist.add(id);updateCounts();wish.classList.toggle('active');wish.textContent=wishlist.has(id)?'♥':'♡';return;}
  const add=e.target.closest('[data-add]');if(add){addToCart(Number(add.dataset.add));return;}
  const open=e.target.closest('[data-open]');if(open)openProduct(open.dataset.open);
 });
 document.body.addEventListener('click',e=>{const add=e.target.closest('[data-modal-add]');if(add){addToCart(Number(add.dataset.modalAdd));$('#product-modal')?.remove();}});
 function addToCart(id){const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});updateCounts();toast('محصول به سبد خرید اضافه شد.');}
 $('#apply-filters').addEventListener('click',()=>{applyFilters();$('#filters').classList.remove('open');});
 $('#clear-filters').addEventListener('click',resetFilters);
 $('#active-filters').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;const [k,v]=b.dataset.remove.split(':');const input=$(`input[name="${k}"][value="${v}"]`);if(input)input.checked=false;applyFilters();});
 $('#sort-select').addEventListener('change',e=>{const list=[...products];if(e.target.value==='price-low')list.sort((a,b)=>a.price-b.price);if(e.target.value==='price-high')list.sort((a,b)=>b.price-a.price);if(e.target.value==='newest')list.reverse();renderProducts(list);});
 $('#search-form').addEventListener('submit',e=>{e.preventDefault();const q=$('#search-input').value.trim();const found=products.filter(p=>(p.name+p.fabric+p.color+p.pattern+p.use.join(' ')).includes(q));renderProducts(found);$('#shop').scrollIntoView({behavior:'smooth'});});
 $('#mobile-filter-toggle').addEventListener('click',()=>$('#filters').classList.toggle('open'));
 $$('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>{resetFilters();const input=$(`input[name="use"][value="${a.dataset.filterLink}"]`);if(input)input.checked=true;applyFilters();}));
 $('#wishlist-shortcut').addEventListener('click',()=>{renderProducts(products.filter(p=>wishlist.has(p.id)));$('#shop').scrollIntoView({behavior:'smooth'});});
 $('#cart-shortcut').addEventListener('click',()=>{if(!cart.length){toast('سبد خریدت هنوز خالیه.');return;}toast('سبد خرید نمایشی: '+cart.map(x=>products.find(p=>p.id===x.id).name+' × '+x.qty).join('، '));});
 $('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();$('#newsletter-message').textContent='ممنون از همراهی‌ات؛ فرم خبرنامه در نسخه فروشگاهی به سرویس ایمیل متصل می‌شود.';e.target.reset();});
 $('#mobile-menu').addEventListener('click',()=>$('.category-nav').classList.toggle('mobile-open'));

 const quiz = [
  {title:'برای چه موقعیتی روسری می‌خوای؟',sub:'موقعیت استفاده رو انتخاب کن.',key:'use',options:['روزمره','رسمی','مجلسی']},
  {title:'چه قواره‌ای رو ترجیح می‌دی؟',sub:'اندازه‌ای که با سبک پوششت هماهنگه.',key:'size',options:['کوتاه','متوسط','بلند']},
  {title:'برای کدوم فصل می‌خوای؟',sub:'فصل روی جنس و ضخامت پیشنهادی اثر می‌ذاره.',key:'season',options:['بهار','تابستان','پاییز','زمستان','چهار فصل']},
  {title:'چه جنسی رو بیشتر می‌پسندی؟',sub:'می‌تونی بیش از یک گزینه انتخاب کنی.',key:'fabric',multi:true,options:['نخی','کرپ','ابریشم','حریر','پشمی']},
  {title:'چه رنگ‌هایی دوست داری؟',sub:'یک یا چند رنگ انتخاب کن.',key:'color',multi:true,options:['شیری','قهوه‌ای','زرشکی','زیتونی','مشکی','آبی']},
  {title:'کدوم طرح به سلیقه‌ات نزدیک‌تره؟',sub:'در پایان، نزدیک‌ترین محصولات موجود رو می‌بینی.',key:'pattern',multi:true,options:['ساده','گلدار','ترمه','هندسی']}
 ];
 const answers={};
 function renderQuiz(){
  const q=quiz[activeQuizStep], current=answers[q.key]||[];
  $('#quiz-step-label').textContent=`مرحله ${new Intl.NumberFormat('fa-IR').format(activeQuizStep+1)} از ۶`;
  $('#quiz-progress-fill').style.width=((activeQuizStep+1)/6*100)+'%';
  $('#quiz-content').innerHTML=`<h3>${q.title}</h3><p class="quiz-sub">${q.sub}</p><div class="quiz-options ${q.key==='color'?'color-options':''}">${q.options.map((o,i)=>`<button class="quiz-option ${current.includes(o)?'selected':''}" data-option="${o}">${q.key==='color'?`<i class="quiz-swatch sw-${i}"></i>`:''}<span>${o}</span><b>${current.includes(o)?'✓':'+'}</b></button>`).join('')}</div>`;
  $('#quiz-back').disabled=activeQuizStep===0;$('#quiz-next').textContent=activeQuizStep===5?'دیدن پیشنهادها':'ادامه ←';
 }
 $('#quiz-content').addEventListener('click',e=>{
  const b=e.target.closest('[data-option]');if(!b)return;const q=quiz[activeQuizStep],v=b.dataset.option;
  let vals=answers[q.key]||[];
  if(q.multi){vals=vals.includes(v)?vals.filter(x=>x!==v):[...vals,v];}else{vals=[v];}
  answers[q.key]=vals;renderQuiz();
 });
 $('#quiz-next').addEventListener('click',()=>{
  const q=quiz[activeQuizStep];if(!answers[q.key]?.length){toast('لطفاً یک گزینه انتخاب کن.');return;}
  if(activeQuizStep<5){activeQuizStep++;renderQuiz();}else showRecommendations();
 });
 $('#quiz-back').addEventListener('click',()=>{if(activeQuizStep>0){activeQuizStep--;renderQuiz();}});
 function showRecommendations(){
  const scored=products.map(p=>{
   let score=0,total=0;
   const checks=[['use',p.use],['size',[p.size]],['season',p.season],['fabric',[p.fabric]],['color',[p.color]],['pattern',[p.pattern]]];
   checks.forEach(([k,vals])=>{const chosen=answers[k]||[];if(chosen.length){total++;if(chosen.some(v=>vals.includes(v)))score++;}});
   return {...p,match:total?Math.round(score/total*100):0};
  }).filter(p=>p.match>0).sort((a,b)=>b.match-a.match).slice(0,4);
  $('#quiz-content').innerHTML=`<div class="recommendation-result"><p class="eyebrow">YOUR ELORA MATCH</p><h3>این انتخاب‌ها به سلیقه تو نزدیک‌ترن</h3><p>درصد تطابق، میزان هماهنگی هر محصول با پاسخ‌های تو رو نشون می‌ده.</p><div class="recommendation-grid">${scored.length?scored.map(p=>`<article class="mini-product"><img src="${p.image}" alt="${p.name}"><div><b>${p.name}</b><span>${p.match}٪ تطابق</span><small>${toman(p.price)}</small><button data-reco-open="${p.id}">مشاهده محصول</button></div></article>`).join(''):'<p>فعلاً محصولی مطابق این ترکیب نداریم؛ انتخاب‌ها رو تغییر بده.</p>'}</div><button class="text-link" id="quiz-restart">شروع دوباره پرسش‌ها ↻</button></div>`;
  $('#quiz-progress-fill').style.width='100%';$('#quiz-step-label').textContent='پیشنهادهای الورا';$('#quiz-back').hidden=true;$('#quiz-next').hidden=true;
 }
 $('#quiz-content').addEventListener('click',e=>{const b=e.target.closest('[data-reco-open]');if(b)openProduct(b.dataset.recoOpen);if(e.target.id==='quiz-restart'){Object.keys(answers).forEach(k=>delete answers[k]);activeQuizStep=0;$('#quiz-back').hidden=false;$('#quiz-next').hidden=false;renderQuiz();}});
 $('#wish-count').textContent='0';renderProducts();renderQuiz();
})();