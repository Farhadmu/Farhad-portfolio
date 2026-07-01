function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open')}
function closeMenu(){document.getElementById('mobileMenu').classList.remove('open')}
function openModal(id){document.getElementById('modal-'+id).classList.add('open');document.body.style.overflow='hidden'}
function closeModal(id){document.getElementById('modal-'+id).classList.remove('open');document.body.style.overflow=''}
function closeModalOverlay(e,id){if(e.target===e.currentTarget)closeModal(id)}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));document.body.style.overflow=''}} );
function toggleDDM(id){const m=document.getElementById(id);const o=m.classList.contains('open');document.querySelectorAll('.ddm-menu').forEach(d=>d.classList.remove('open'));if(!o)m.classList.add('open')}
function closeDDM(id){document.getElementById(id).classList.remove('open')}
document.addEventListener('click',e=>{if(!e.target.closest('.ddm'))document.querySelectorAll('.ddm-menu').forEach(d=>d.classList.remove('open'))});
const SUPABASE_URL='https://mofkpajfzorncwmgliik.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmtwYWpmem9ybmN3bWdsaWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDQ4NTksImV4cCI6MjA5NTI4MDg1OX0.XhWnAlnFAawn4-XGRyH067dovP3EPakI-NcWa4I7ggg';
async function handleForm(e){
  e.preventDefault();
  const form=e.target;
  const btn=form.querySelector('.f-submit');
  const n=document.getElementById('fn').value.trim(),
        em=document.getElementById('fe').value.trim(),
        sub=(document.getElementById('fs').value||'').trim(),
        msg=document.getElementById('fm').value.trim();
  if(!n||!em||!msg){return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){
    btn.textContent='✗ invalid email';btn.style.background='#ef4444';btn.style.color='#fff';
    setTimeout(()=>{btn.textContent='send_message() →';btn.style.background='';btn.style.color=''},2500);
    return;
  }
  const original=btn.textContent;
  btn.disabled=true;btn.textContent='sending...';
  try{
    const res=await fetch(SUPABASE_URL+'/rest/v1/contact_messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'apikey':SUPABASE_ANON_KEY,
        'Authorization':'Bearer '+SUPABASE_ANON_KEY,
        'Prefer':'return=minimal'
      },
      body:JSON.stringify({name:n.slice(0,100),email:em.slice(0,255),subject:sub?sub.slice(0,200):null,message:msg.slice(0,5000)})
    });
    if(!res.ok)throw new Error('Failed: '+res.status);
    btn.textContent='✓ message sent!';btn.style.background='#34d399';btn.style.color='#080b14';
    form.reset();
  }catch(err){
    console.error(err);
    btn.textContent='✗ failed, try again';btn.style.background='#ef4444';btn.style.color='#fff';
  }finally{
    setTimeout(()=>{btn.disabled=false;btn.textContent=original;btn.style.background='';btn.style.color=''},3000);
  }
}
// Reveal animation
const revObs=new IntersectionObserver((entries)=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add('visible'),i*120);
      revObs.unobserve(entry.target);
    }
  });
},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
// Navbar shrink
window.addEventListener('scroll',()=>{
  const n=document.getElementById('navbar');
  n.style.padding=window.scrollY>60?'0.7rem 6%':'1rem 6%';
});
// Stagger skill cards on section visible
const skillObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.sk-card').forEach((card,i)=>{
        card.style.opacity='0';card.style.transform='translateY(12px)';
        setTimeout(()=>{card.style.transition=`opacity .4s ease ${i*40}ms, transform .4s ease ${i*40}ms`;card.style.opacity='1';card.style.transform='translateY(0)';},150);
      });
      e.target.querySelectorAll('.sk-group-head').forEach((head,i)=>{
        head.style.opacity='0';head.style.transform='translateX(-12px)';
        setTimeout(()=>{head.style.transition='opacity .4s ease, transform .4s ease';head.style.opacity='1';head.style.transform='translateX(0)';},100);
      });
      skillObs.unobserve(e.target);
    }
  });
},{threshold:.1});
document.querySelectorAll('.skills-grid').forEach(el=>skillObs.observe(el));
// Mirror the hero photo into the About section so the same image is reused
(function(){
  const heroImg=document.querySelector('.photo-hex img');
  const aboutImg=document.getElementById('aboutPhoto');
  if(heroImg && aboutImg){
    const apply=()=>{aboutImg.src=heroImg.currentSrc||heroImg.src;};
    if(heroImg.complete) apply(); else heroImg.addEventListener('load',apply,{once:true});
  }
})();
