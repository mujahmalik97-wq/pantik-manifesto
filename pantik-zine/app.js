(function(){
 const cfg=window.PANTIK_CONFIG||{};
 const ready=cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_URL.startsWith("ISI_");
 const works=document.getElementById('works');
 if(!ready||!window.supabase){return;}
 const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
 db.from('works').select('id,title,author,category,excerpt,created_at').eq('published',true).order('created_at',{ascending:false}).then(({data,error})=>{
   if(error||!data||!data.length)return;
   works.innerHTML='';
   data.forEach(w=>{
     const a=document.createElement('a');a.className='work-card';a.href='karya.html?id='+encodeURIComponent(w.id);
     const meta=document.createElement('small');meta.textContent=(w.category||'KARYA')+' / '+(w.author||'PANTIK');
     const h=document.createElement('h3');h.textContent=w.title;
     const p=document.createElement('p');p.textContent=w.excerpt||'Baca selengkapnya.';
     a.append(meta,h,p);works.append(a);
   });
 });
})();