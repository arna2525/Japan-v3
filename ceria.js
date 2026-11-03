// Tema "Ceria": peta belajar bab 1-50 di beranda, tombol "tandai bab selesai", pilihan tema di Profil.
// Tidak mengubah logika belajar; hanya tampilan + penanda bab selesai (kunci nqbab).
(function(){
const html=document.documentElement,$=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEYT='nqtheme',KEYB='nqbab',CH=window.NQ_CHAPTERS||[];
const getB=()=>{try{return new Set(JSON.parse(localStorage.getItem(KEYB))||[])}catch(e){return new Set()}};
const setB=s=>{try{localStorage.setItem(KEYB,JSON.stringify([...s]))}catch(e){}};
const toast=m=>{const t=document.querySelector('.toast');if(t){t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1800)}};
const theme=()=>{try{return localStorage.getItem(KEYT)==='klasik'?'klasik':'ceria'}catch(e){return'ceria'}};
function apply(){html.classList.toggle('tc',theme()==='ceria');try{document.querySelector('meta[name=theme-color]').setAttribute('content',theme()==='ceria'?'#ffffff':'#07070a')}catch(e){}}
const mascot='<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="56" rx="18" ry="4" fill="rgba(0,0,0,.15)"/><path d="M32 8c15 0 24 11 24 25 0 13-9 22-24 22S8 46 8 33C8 19 17 8 32 8z" fill="#fff"/><path d="M32 8c3-6 10-6 12-3-4 0-8 1-12 3z" fill="#2f8a3b"/><circle cx="23" cy="32" r="3.2" fill="#2f3542"/><circle cx="41" cy="32" r="3.2" fill="#2f3542"/><circle cx="17" cy="39" r="4" fill="#ffb3c4"/><circle cx="47" cy="39" r="4" fill="#ffb3c4"/><path d="M26 41c3 4 9 4 12 0" stroke="#2f3542" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
const OFF=[0,34,54,34,0,-34,-54,-34];
function build(){const home=$('home');if(!home)return;let box=$('cpath');const mb=$('cmapbox');
 if(!box){box=document.createElement('div');box.id='cpath';box.className='cpath';home.appendChild(box)}
 // sembunyikan judul "Jalur belajar" lama
 [...home.querySelectorAll('.sec')].forEach(e=>{if(/jalur belajar/i.test(e.textContent))e.classList.add('hidepath')});
 const done=getB();let cur=0;for(let n=1;n<=CH.length;n++){if(!done.has(n)){cur=n;break}}
 const dn=[...done].filter(n=>n>=1&&n<=CH.length).length;let h='';
 let pos=0;
 CH.forEach(c=>{const n=c.bab;
  if(n===1||n===26){const u2=n===26;h+=`<div class="cunit${u2?' u2':''}"><div><h3>${u2?'Bagian 2 · Minna II':'Bagian 1 · Minna I'}</h3><p>Bab ${u2?'26–50':'1–25'} · ${u2?'Tata bahasa lanjutan':'Dasar-dasar'}</p></div>${mascot}</div>`}
  const st=done.has(n)?'done':(n===cur?'cur':'');const off=OFF[pos%OFF.length];pos++;
  h+=`<div class="cstep" style="transform:translateX(${off}px)">${n===cur?'<div class="cstart">MULAI</div>':''}<button class="cnode ${st} ${n>=26?'u2':''}" onclick="openChapter(${n})" aria-label="Bab ${n} ${esc(c.judul)}">${done.has(n)?'✓':n}</button><div class="ccap">${esc(c.judul)}</div></div>`;
  if(n%5===0&&n!==25&&n!==50||n===25||n===50){const off2=OFF[pos%OFF.length];pos++;h+=`<div class="cstep" style="transform:translateX(${off2}px)"><button class="cnode chest" onclick="cpQuiz(${n})" aria-label="Latihan acak setelah Bab ${n}">🎯</button><div class="ccap">Latihan acak</div></div>`}
 });
 const full=`<div class="sec" style="margin-top:14px">Peta belajar · ${dn}/${CH.length} bab selesai</div>`+h;box.innerHTML=full;if(mb)mb.innerHTML=full;window.NQCeria={cur:cur||CH.length,done:dn,total:CH.length,title:(CH[(cur||CH.length)-1]||{}).judul||''}}
window.cpBuild=build;
window.cpQuiz=function(n){try{window.go('kuis');window.renderKuisHub();window.kzSet('mode','mix');window.kzSet('n',10)}catch(e){window.go('kuis')}toast('Pilih "Mulai Kuis" untuk latihan acak')};
window.babToggle=function(n){const s=getB();if(s.has(n)){s.delete(n);toast('Bab '+n+' ditandai belum selesai')}else{s.add(n);toast('🎉 Bab '+n+' selesai!')}setB(s);addBtn(n);build()};
function addBtn(n){const d=$('chapterdetail');if(!d)return;let b=d.querySelector('.cdone-btn');if(!b){b=document.createElement('button');b.className='btn wide cdone-btn';d.appendChild(b)}
 const on=getB().has(n);b.textContent=on?'✓ Bab selesai (ketuk untuk batalkan)':'Tandai bab ini selesai';b.classList.toggle('light',on);b.onclick=()=>babToggle(n)}
const oc=window.openChapter;if(typeof oc==='function')window.openChapter=function(n){oc.apply(this,arguments);addBtn(+n)};
const og=window.go;window.go=function(id){const r=og.apply(this,arguments);if(id==='home')build();if(id==='profil')prof();return r};
// pilihan tema di Profil
function prof(){const p=$('profil');if(!p)return;let c=$('ctheme');if(!c){c=document.createElement('div');c.id='ctheme';c.className='card';const menu=p.querySelector('.menu');(menu?menu.before(c):p.appendChild(c))}
 c.innerHTML=`<b>Tampilan</b><div class="muted" style="margin:4px 0 0">Pilih gaya aplikasi.</div><div class="ctheme"><button class="btn ${theme()==='ceria'?'':'light'}" onclick="cpTheme('ceria')">Ceria (baru)</button><button class="btn ${theme()==='klasik'?'':'light'}" onclick="cpTheme('klasik')">Klasik (gelap)</button></div>`}
window.cpTheme=function(t){try{localStorage.setItem(KEYT,t)}catch(e){}apply();prof();build()};
apply();build();prof();
})();
