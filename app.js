const tg=window.Telegram?.WebApp; tg?.ready(); tg?.expand();
const KEY="moulaliv_admin_v1";
const defaults={
 theme:{primary:"#1677ff",bg:"#0f1115",surface:"#181c23",surface2:"#202631",text:"#ffffff",muted:"#aab3c2",border:"#303846"},
 shopName:"Moulaliv 13/83",
 welcome:"Bienvenue chez Moulaliv 13/83",
 contact:{telegram:"",whatsapp:"",signal:"",phone:""},
 info:"Bienvenue dans notre boutique. Retrouvez ici les informations utiles.",
 categories:["Tous","Nouveautés","Promotions"],
 products:[
  {id:1,name:"Produit exemple",description:"Description du produit.",category:"Nouveautés",price:10,stock:10,image:"",variants:[{name:"Petit",price:10,stock:10},{name:"Grand",price:18,stock:5}]}
 ],
 orders:[]
};
let state=load(), page="home", cat="Tous";
function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(defaults)}catch(e){return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state)); applyTheme()}
function applyTheme(){for(const [k,v] of Object.entries(state.theme))document.documentElement.style.setProperty("--"+k,v)}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
function nav(){return `<div class="nav">
<button class="${page==="home"?"active":""}" onclick="go('home')">⌂<span>Accueil</span></button>
<button class="${page==="shop"?"active":""}" onclick="go('shop')">🛍️<span>Boutique</span></button>
<button class="${page==="cart"?"active":""}" onclick="go('cart')">🛒<span>Panier (${cart.length})</span></button>
<button class="${page==="admin"?"active":""}" onclick="go('admin')">⚙️<span>Admin</span></button>
</div>`}
let cart=[];
function go(p){page=p;render()}
function head(title){return `<div class="top"><div><div class="brand">${esc(state.shopName)}</div><div class="sub">${esc(title)}</div></div><button class="btn secondary" onclick="go('admin')">⚙️</button></div>`}
function home(){return `${head("Accueil")}
<div class="hero"><h1>${esc(state.welcome)}</h1><div class="sub">Tout se gère depuis la Mini App.</div></div>
<div class="grid">
<div class="tile" onclick="go('shop')"><b>🛍️ Boutique</b><span class="muted">Voir les produits</span></div>
<div class="tile" onclick="go('cart')"><b>🛒 Panier</b><span class="muted">${cart.length} article(s)</span></div>
<div class="tile" onclick="go('orders')"><b>📦 Mes commandes</b><span class="muted">${state.orders.length} commande(s)</span></div>
<div class="tile" onclick="go('contact')"><b>💬 Contact</b><span class="muted">Nous contacter</span></div>
</div>`}
function shop(){const ps=cat==="Tous"?state.products:state.products.filter(p=>p.category===cat);return `${head("Boutique")}
<div class="tabs">${state.categories.map(c=>`<button class="tab ${c===cat?"active":""}" onclick="setCat('${esc(c)}')">${esc(c)}</button>`).join("")}</div>
${ps.length?ps.map(p=>productCard(p)).join(""):`<div class="empty">Aucun produit dans cette catégorie.</div>`}`}
function productCard(p){return `<div class="card">${p.image?`<img class="product-img" src="${p.image}" alt="">`:`<div class="product-img placeholder">PRODUIT</div>`}
<div class="product-title">${esc(p.name)}</div><div class="muted">${esc(p.description)}</div>
<div class="row" style="margin-top:12px"><span class="price">${fmt(p.price)}</span><span class="badge">Stock : ${p.stock}</span></div>
${p.variants?.length?`<div class="field"><label>Choisir une variante</label><select id="v-${p.id}">${p.variants.map((v,i)=>`<option value="${i}">${esc(v.name)} — ${fmt(v.price)} — stock ${v.stock}</option>`).join("")}</select></div>`:""}
<button class="btn" onclick="add(${p.id})">Ajouter</button></div>`}
function fmt(n){return Number(n||0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}
function setCat(c){cat=c;render()}
function add(id){const p=state.products.find(x=>x.id===id);if(!p)return;let v=null;if(p.variants?.length){const i=Number(document.getElementById("v-"+id)?.value||0);v=p.variants[i]}cart.push({id,variant:v?.name||"",price:Number(v?.price??p.price),name:p.name});toast("Ajouté au panier");render()}
function cartPage(){return `${head("Panier")}${cart.length?`<div class="card">${cart.map((x,i)=>`<div class="between" style="padding:10px 0;border-bottom:1px solid var(--border)"><span>${esc(x.name)} ${x.variant?`— ${esc(x.variant)}`:""}</span><b>${fmt(x.price)}</b><button class="smallbtn" onclick="cart.splice(${i},1);render()">×</button></div>`).join("")}<div class="between" style="padding-top:15px"><b>Total</b><b>${fmt(cart.reduce((a,x)=>a+x.price,0))}</b></div><button class="btn" style="margin-top:12px" onclick="placeOrder()">Valider la commande</button></div>`:`<div class="empty">Ton panier est vide.</div>`}`}
function placeOrder(){if(!cart.length)return;state.orders.push({id:Date.now(),date:new Date().toLocaleString("fr-FR"),items:cart,total:cart.reduce((a,x)=>a+x.price,0),status:"Nouvelle"});cart=[];save();toast("Commande enregistrée");go("orders")}
function orders(){return `${head("Mes commandes")}${state.orders.length?state.orders.slice().reverse().map(o=>`<div class="card"><div class="between"><b>Commande #${String(o.id).slice(-6)}</b><span class="badge">${esc(o.status)}</span></div><div class="muted">${esc(o.date)}</div><p>${o.items.map(i=>esc(i.name)+(i.variant?" — "+esc(i.variant):"")).join(", ")}</p><b>${fmt(o.total)}</b></div>`).join(""):`<div class="empty">Aucune commande.</div>`}`}
function contact(){const c=state.contact;return `${head("Contact")}<div class="card"><div class="field"><label>Telegram</label><div class="row"><a class="btn" href="${esc(c.telegram)}" target="_blank">Ouvrir Telegram</a></div></div><div class="field"><label>WhatsApp</label><div class="row"><a class="btn" href="${esc(c.whatsapp)}" target="_blank">Ouvrir WhatsApp</a></div></div><div class="field"><label>Signal</label><div class="row"><a class="btn" href="${esc(c.signal)}" target="_blank">Ouvrir Signal</a></div></div><div class="muted">${esc(c.phone)}</div></div>`}
function info(){return `${head("Informations")}<div class="card"><h2>Informations</h2><p>${esc(state.info).replace(/\n/g,"<br>")}</p></div>`}
function admin(){return `${head("Administration")}
<div class="card admin-section"><h2>🎨 Couleurs & apparence</h2>${Object.keys(state.theme).map(k=>`<div class="field"><label>${esc(k)}</label><input value="${esc(state.theme[k])}" onchange="themeSet('${k}',this.value)"></div>`).join("")}</div>
<div class="card admin-section"><h2>🏪 Boutique</h2><div class="field"><label>Nom de la boutique</label><input value="${esc(state.shopName)}" onchange="setText('shopName',this.value)"></div><div class="field"><label>Message d'accueil</label><input value="${esc(state.welcome)}" onchange="setText('welcome',this.value)"></div><div class="field"><label>Informations</label><textarea onchange="setText('info',this.value)">${esc(state.info)}</textarea></div><div class="field"><label>Catégories (une par ligne)</label><textarea onchange="catsSet(this.value)">${esc(state.categories.join("\n"))}</textarea></div></div>
<div class="card admin-section"><h2>💬 Contacts</h2>${["telegram","whatsapp","signal","phone"].map(k=>`<div class="field"><label>${k}</label><input value="${esc(state.contact[k]||"")}" onchange="contactSet('${k}',this.value)" placeholder="${k==="phone"?"Numéro ou texte":"Lien complet"}"></div>`).join("")}</div>
<div class="card admin-section"><div class="between"><h2>🛍️ Produits</h2><button class="btn" onclick="newProduct()">+ Ajouter</button></div>${state.products.map((p,i)=>adminProduct(p,i)).join("")}</div>
<div class="card admin-section"><h2>📦 Commandes</h2>${state.orders.length?state.orders.slice().reverse().map(o=>`<div class="product-admin"><div class="between"><b>#${String(o.id).slice(-6)}</b><select onchange="orderStatus(${o.id},this.value)">${["Nouvelle","En préparation","Terminée","Annulée"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></div><div class="muted">${esc(o.date)} — ${fmt(o.total)}</div></div>`).join(""):`<div class="muted">Aucune commande.</div>`}</div>
<div class="card admin-section"><h2>💾 Sauvegarde</h2><div class="row"><button class="btn secondary" onclick="exportData()">Exporter</button><label class="btn secondary">Importer<input class="hidden" type="file" accept=".json" onchange="importData(this.files[0])"></label><button class="btn danger" onclick="resetAll()">Réinitialiser</button></div><p class="muted">Les réglages sont enregistrés dans cette Mini App sur l'appareil. Pour partager les mêmes données avec tous les clients, il faudra ensuite connecter une base de données.</p></div>`}
function adminProduct(p,i){return `<div class="product-admin"><div class="between"><b>Produit ${i+1}</b><button class="smallbtn" onclick="delProduct(${p.id})">Supprimer</button></div>
<div class="field"><label>Nom</label><input value="${esc(p.name)}" onchange="prodSet(${p.id},'name',this.value)"></div>
<div class="field"><label>Description</label><textarea onchange="prodSet(${p.id},'description',this.value)">${esc(p.description)}</textarea></div>
<div class="field"><label>Catégorie</label><select onchange="prodSet(${p.id},'category',this.value)">${state.categories.filter(x=>x!=="Tous").map(c=>`<option ${c===p.category?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
<div class="field"><label>Prix de base (€)</label><input type="number" step="0.01" value="${p.price}" onchange="prodSet(${p.id},'price',this.value)"></div>
<div class="field"><label>Stock</label><input type="number" value="${p.stock}" onchange="prodSet(${p.id},'stock',this.value)"></div>
<div class="field"><label>Image du produit</label><input type="file" accept="image/*" onchange="imageSet(${p.id},this.files[0])">${p.image?`<img class="product-img" style="margin-top:8px" src="${p.image}">`:""}</div>
<div class="field"><label>Variantes</label>${(p.variants||[]).map((v,j)=>`<div class="variant"><input value="${esc(v.name)}" placeholder="Nom" onchange="variantSet(${p.id},${j},'name',this.value)"><input type="number" step="0.01" value="${v.price}" onchange="variantSet(${p.id},${j},'price',this.value)"><input type="number" value="${v.stock}" onchange="variantSet(${p.id},${j},'stock',this.value)"><button class="smallbtn" onclick="delVariant(${p.id},${j})">×</button></div>`).join("")}<button class="smallbtn" onclick="addVariant(${p.id})">+ Variante</button></div></div>`}
function themeSet(k,v){state.theme[k]=v;save();toast("Couleur enregistrée")}
function setText(k,v){state[k]=v;save()}
function catsSet(v){state.categories=["Tous",...v.split("\n").map(x=>x.trim()).filter(x=>x&&x!=="Tous")];state.products.forEach(p=>{if(!state.categories.includes(p.category))p.category=state.categories[1]||"Nouveautés"});save();render()}
function contactSet(k,v){state.contact[k]=v;save()}
function prodSet(id,k,v){const p=state.products.find(x=>x.id===id);if(!p)return;p[k]=["price","stock"].includes(k)?Number(v):v;save();render()}
function newProduct(){state.products.push({id:Date.now(),name:"Nouveau produit",description:"",category:state.categories[1]||"Nouveautés",price:0,stock:0,image:"",variants:[]});save();render()}
function delProduct(id){if(confirm("Supprimer ce produit ?")){state.products=state.products.filter(p=>p.id!==id);save();render()}}
function addVariant(id){state.products.find(p=>p.id===id).variants.push({name:"Nouvelle variante",price:0,stock:0});save();render()}
function delVariant(id,j){state.products.find(p=>p.id===id).variants.splice(j,1);save();render()}
function variantSet(id,j,k,v){const x=state.products.find(p=>p.id===id).variants[j];x[k]=["price","stock"].includes(k)?Number(v):v;save()}
function imageSet(id,file){if(!file)return;const r=new FileReader();r.onload=()=>{state.products.find(p=>p.id===id).image=r.result;save();render();toast("Image enregistrée")};r.readAsDataURL(file)}
function orderStatus(id,v){const o=state.orders.find(x=>x.id===id);if(o)o.status=v;save();toast("Statut mis à jour")}
function exportData(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download="moulaliv-sauvegarde.json";a.click()}
function importData(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);save();render();toast("Sauvegarde importée")}catch(e){toast("Fichier invalide")}};r.readAsText(file)}
function resetAll(){if(confirm("Réinitialiser toute la configuration ?")){state=structuredClone(defaults);save();render();}}
function render(){applyTheme();let content=page==="home"?home():page==="shop"?shop():page==="cart"?cartPage():page==="orders"?orders():page==="contact"?contact():page==="info"?info():admin();document.getElementById("app").innerHTML=`<div class="wrap">${content}</div>${nav()}`}
render();
