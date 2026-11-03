// Tampilan Sederhana: beranda 1 tombol besar + 6 kotak menu, menu bawah 3 tab, halaman "Lainnya", "Latihan" 1 ketukan.
// Tidak mengubah logika belajar; hanya menata ulang pintu masuk. Bisa dimatikan di Profil (Beranda: Lengkap).
(function(){
const html=document.documentElement,$=id=>document.getElementById(id),KEY='nqsimple';
const spOn=()=>{try{return localStorage.getItem(KEY)!=='0'}catch(e){return true}};
const app=document.querySelector('main.app'),nav=app&&app.querySelector('.nav');
function page(id){let s=$(id);if(!s){s=document.createElement('section');s.id=id;s.className='page';app.insertBefore(s,nav)}return s}
const ST=['go','back'];
const tile=(ic,t,d,js,c)=>`<button class="sp-tile ${c||''}" onclick="${js}"><span class="sp-ic">${ic}</span><b>${t}</b><small>${d}</small></button>`;
const row=(ic,t,d,js)=>`<button class="sp-row" onclick="${js}"><span class="sp-ic">${ic}</span><span><b>${t}</b><small>${d}</small></span><i>›</i></button>`;
function home(){let h=$('shome');if(!h){h=document.createElement('div');h.id='shome';$('home').prepend(h)}
 const c=window.NQCeria||{cur:1,done:0,total:50,title:''};
 h.innerHTML=`<div class="sp-hi"><h2>Halo! 👋</h2><p>Belajar sedikit tiap hari, pasti bisa.</p></div>
 <button class="sp-go" onclick="openChapter(${c.cur})"><small>LANJUTKAN BELAJAR</small><b>Bab ${c.cur}: ${c.title}</b><span class="sp-bar"><i style="width:${Math.round(c.done/c.total*100)}%"></i></span><em>MULAI</em></button>
 <div class="sp-grid">
 ${tile('📘','Belajar Bab','Pola kalimat 1–50',"go('cmap')",'t1')}
 ${tile('🃏','Hafalan','Kartu kata & kanji',"go('flashcard')",'t2')}
 ${tile('漢','Kanji','Jalur N5 → N4',"go('kanji');renderKanji()",'t3')}
 ${tile('📖','Cerita','Latihan membaca',"go('cerita');renderCerita()",'t4')}
 ${tile('✏️','Latihan','Kuis cepat',"go('latihan')",'t5')}
 ${tile('☰','Lainnya','Kaiwa, JFT, dll.',"go('lainnya')",'t6')}
 </div>`}
function peta(){const s=page('cmap');if(!s.dataset.ok){s.innerHTML=`<div class="subhead"><button class="back" onclick="go('home')">←</button><div><h2>Belajar Bab</h2><p>Ketuk bab untuk mulai</p></div></div><div id="cmapbox" class="cpath" style="display:block"></div>`;s.dataset.ok=1}}
function latihan(){const s=page('lsimple');
 s.innerHTML=`<div class="subhead"><button class="back" onclick="go('home')">←</button><div><h2>Latihan</h2><p>Pilih satu saja</p></div></div>
 <button class="sp-go sp-green" onclick="spQuick('mix')"><small>PALING MUDAH</small><b>🎲 Latihan Cepat</b><span class="sp-d">10 soal campur, langsung mulai</span><em>MULAI</em></button>
 <div class="sp-list">
 ${row('🔁','Ulangi yang sering salah','Kata yang pernah kamu salah',"spRepeat()")}
 ${row('漢','Latihan Kanji','Tebak arti kanji',"spQuick('kanjiMean')")}
 ${row('📝','Simulasi JFT','Soal bergaya ujian + timer',"go('jft')")}
 ${row('🎛️','Pilih jenis latihan','Semua mode kuis',"go('kuis');renderKuisHub()")}
 ${row('📚','Latihan kata per bab','Pilih bab dan jenis kata',"window.__rawLat=1;go('latihan');window.__rawLat=0")}
 </div>`}
function lain(){const s=page('lainnya');
 s.innerHTML=`<div class="subhead"><button class="back" onclick="go('home')">←</button><div><h2>Lainnya</h2><p>Fitur tambahan</p></div></div><div class="sp-list">
 ${row('🗣️','Kaiwa','Latihan percakapan',"go('kaiwa')")}
 ${row('🔄','Kata kerja','Ubah bentuk ます・て・た',"go('konjugasi')")}
 ${row('➡️','Partikel','は が を に で',"go('partikel');renderPartikel()")}
 ${row('🧩','Tata bahasa (Bunpou)','89 pola kalimat',"go('bunpou')")}
 ${row('📚','Daftar kata (Kotoba)','Cari & filter kata',"go('kotoba');renderWords()")}
 ${row('📝','Simulasi JFT','Paket latihan per tahun',"go('jft')")}
 ${row('👤','Saya & cadangan','Statistik, tema, cadangan',"go('profil')")}
 </div>`}
window.spQuick=function(m){try{go('kuis');renderKuisHub();kzSet('mode',m);kzSet('n',10);kzStart()}catch(e){go('kuis')}};
window.spRepeat=function(){try{go('kuis');renderKuisHub();if(typeof window.kzStartSRS==='function')kzStartSRS()}catch(e){go('kuis')}};
function navLabels(){if(!nav)return;nav.querySelectorAll('button').forEach(b=>{const oc=b.getAttribute('onclick')||'';const set=t=>{[...b.childNodes].reverse().some(n=>{if(n.nodeType===3&&n.textContent.trim()){n.textContent=t;return true}return false})||[...b.querySelectorAll('span')].some(sp=>{if(sp.children.length===0&&sp.textContent.trim()){sp.textContent=t;return true}return false})};
  if(/'home'/.test(oc))set('Belajar');else if(/'profil'/.test(oc))set('Saya');else if(/'latihan'/.test(oc))set('Latihan')})}
function apply(){html.classList.toggle('sp',spOn());if(spOn()){home();peta();latihan();lain();navLabels()}}
const og=window.go;window.go=function(id,btn){if(spOn()&&id==='latihan'&&!window.__rawLat)id='lsimple';const r=og.call(this,id,btn);
 if(spOn()){if(id==='home')setTimeout(home,0);if(id==='cmap'&&window.cpBuild)window.cpBuild()}
 if(id==='profil')setTimeout(profBtn,50);return r};
const oo=window.openChapter;if(typeof oo==='function')window.openChapter=function(n){oo.apply(this,arguments);if(spOn()){const b=document.querySelector('#chapterdetail .subhead .back');if(b)b.setAttribute('onclick',"go('cmap')")}};
window.spToggle=function(on){try{localStorage.setItem(KEY,on?'1':'0')}catch(e){}apply();profBtn();go('home')};
function profBtn(){const p=$('profil');if(!p)return;let c=$('sptoggle');if(!c){c=document.createElement('div');c.id='sptoggle';c.className='card';const t=$('ctheme');(t?t.after(c):p.appendChild(c))}
 c.innerHTML=`<b>Beranda</b><div class="muted" style="margin:4px 0 0">Sederhana: 1 tombol + 6 menu. Lengkap: level, misi harian, dan peta bab.</div><div class="ctheme"><button class="btn ${spOn()?'':'light'}" onclick="spToggle(true)">Sederhana</button><button class="btn ${spOn()?'light':''}" onclick="spToggle(false)">Lengkap</button></div>`}
apply();profBtn();
})();
