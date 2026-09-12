let cart=0;
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function addToCart(){
  cart++;
  const el=document.getElementById('cartContent');
  el.className='';
  el.innerHTML=`<div class="info-card"><b>Produit légal</b><p>Quantité : ${cart}</p><button class="product-bottom button" onclick="showScreen('shop')">Continuer mes achats</button></div>`;
  showScreen('cart');
}
if(window.Telegram?.WebApp){
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}