/* ===================================================
   CANVAS MESH
=================================================== */
(function(){
  const c = document.getElementById('meshCanvas'), ctx = c.getContext('2d');
  let W,H,pts;
  function resize(){ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; pts=Array.from({length:Math.max(30,Math.floor(W*H/11000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.32,vy:(Math.random()-.5)*.32,r:Math.random()*1.4+.7})); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1; });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<155){ ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(9,150,136,${(1-d/155)*.2})`;ctx.lineWidth=.7;ctx.stroke(); }
    }
    pts.forEach(p=>{ ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(13,184,166,.5)';ctx.fill(); });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize(); draw();
})();

/* ===================================================
   CUSTOM CURSOR
=================================================== */
const cdot=document.getElementById('cdot'), cring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{ mx=e.clientX;my=e.clientY;cdot.style.left=mx+'px';cdot.style.top=my+'px'; });
(function animR(){ rx+=(mx-rx)*.1;ry+=(my-ry)*.1;cring.style.left=rx+'px';cring.style.top=ry+'px';requestAnimationFrame(animR); })();
document.querySelectorAll('a,button,.sv,.pj,.ast,.tc,.ctx-item,.pillar,.prop-mv-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>cring.classList.add('h'));
  el.addEventListener('mouseleave',()=>cring.classList.remove('h'));
});

/* ===================================================
   PROGRESS BAR
=================================================== */
window.addEventListener('scroll',()=>{
  document.getElementById('progress-bar').style.width=(window.scrollY/(document.body.scrollHeight-innerHeight)*100)+'%';
},{passive:true});

/* ===================================================
   NAVBAR
=================================================== */
const navbar=document.getElementById('navbar');
const secs=['inicio','propuesta','servicios','proyectos','nosotros','contacto'];
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',scrollY>50);
  let cur='inicio';
  secs.forEach(id=>{ const el=document.getElementById(id); if(el&&scrollY>=el.offsetTop-130) cur=id; });
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
},{passive:true});

/* ===================================================
   HAMBURGER
=================================================== */
const ham=document.getElementById('ham'), mobNav=document.getElementById('mobNav');
let open=false;
ham.addEventListener('click',()=>{
  open=!open; mobNav.classList.toggle('open',open);
  const ss=ham.querySelectorAll('span');
  ss[0].style.transform=open?'rotate(45deg) translate(5px,5px)':'';
  ss[1].style.opacity=open?'0':'1';
  ss[2].style.transform=open?'rotate(-45deg) translate(5px,-5px)':'';
});
document.querySelectorAll('.mob-nav a').forEach(a=>a.addEventListener('click',()=>{
  open=false; mobNav.classList.remove('open');
  ham.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});
}));

/* ===================================================
   SCROLL REVEAL
=================================================== */
const obs=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);} }),{threshold:.1});
document.querySelectorAll('.sr,.sr-l,.sr-r,.sr-sc').forEach(el=>obs.observe(el));

/* ===================================================
   COUNTERS
=================================================== */
function animCnt(el,to,dur=1100){ let s; const f=ts=>{ if(!s)s=ts; const p=Math.min((ts-s)/dur,1); el.textContent=Math.floor(p*to); if(p<1)requestAnimationFrame(f); else el.textContent=to; }; requestAnimationFrame(f); }
const cntObs=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){
  e.target.querySelectorAll('[data-count]').forEach(el=>animCnt(el,+el.dataset.count));
  e.target.querySelectorAll('.cnt').forEach(el=>animCnt(el,+el.dataset.to,1400));
  cntObs.unobserve(e.target);
}}),{threshold:.6});
document.querySelectorAll('.hero-stats,.about-stats').forEach(el=>cntObs.observe(el));

/* ===================================================
   SERVICES COUNTER
=================================================== */
const svs=document.querySelectorAll('.sv'), sctr=document.getElementById('svc-counter');
svs.forEach(s=>{
  s.addEventListener('mouseenter',()=>{ svs.forEach(x=>x.classList.remove('active')); s.classList.add('active'); if(sctr) sctr.innerHTML=`<span class="acc">${s.dataset.n}</span>/6`; });
});

/* ===================================================
   TABS
=================================================== */
function switchTab(proj, tab, btn, activeClass){
  const ac = activeClass || 'on';
  document.querySelectorAll(`#pj-${proj} .pj-panel`).forEach(p=>p.classList.remove('vis'));
  document.querySelectorAll(`#pj-${proj} .pj-tab`).forEach(b=>b.classList.remove('on','on-g'));
  document.getElementById(`${proj}-${tab}`).classList.add('vis');
  btn.classList.add(ac);
}

/* ===================================================
   MODALS
=================================================== */
function openModal(id){ const m=document.getElementById('modal-'+id); if(m){m.classList.add('on');document.body.style.overflow='hidden';} }
function closeModal(id){ const m=document.getElementById('modal-'+id); if(m){m.classList.remove('on');document.body.style.overflow='';} }
document.querySelectorAll('.modal-bg').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m){m.classList.remove('on');document.body.style.overflow='';} }));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.modal-bg.on').forEach(m=>{m.classList.remove('on');document.body.style.overflow='';}); });

/* ===================================================
   SMOOTH NAV & FORM
=================================================== */
function goTo(sel){ const el=document.querySelector(sel); if(el)el.scrollIntoView({behavior:'smooth'}); }
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); goTo(a.getAttribute('href')); }));

document.getElementById('cform').addEventListener('submit',function(e){
  e.preventDefault();
  const d=new FormData(this);
  const subj=encodeURIComponent(`Nuevo contacto de ${d.get('nombre')} — ${d.get('proyecto')||'No especificado'}`);
  const bod=encodeURIComponent(`Nombre: ${d.get('nombre')}\nEmpresa: ${d.get('empresa')||'No especificada'}\nEmail: ${d.get('email')}\nProyecto: ${d.get('proyecto')||'No especificado'}\n\nMensaje:\n${d.get('mensaje')}\n\n---\nEnviado desde policodelabs.com`);
  window.location.href=`mailto:policodelabs@gmail.com?subject=${subj}&body=${bod}`;
  const btn=this.querySelector('.btn-send'), orig=btn.innerHTML;
  btn.innerHTML='✓ &nbsp;¡Redirigiendo a tu correo!';
  btn.style.background='linear-gradient(135deg,#2d9e5f,#1a7a44)';
  setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';},4000);
});
