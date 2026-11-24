(function(){
 const c=window.PANTIK_CONFIG||{},msg=document.getElementById('message');
 const configured=c.SUPABASE_URL&&c.SUPABASE_ANON_KEY&&!c.SUPABASE_URL.startsWith('ISI_');
 if(!configured||!window.supabase){msg.textContent='Supabase belum dikonfigurasi. Isi config.js terlebih dahulu.';document.getElementById('login').disabled=true;return;}
 const db=window.supabase.createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY);
 const $=id=>document.getElementById(id),loginBox=$('loginBox'),dash=$('dashboard');
 const say=t=>msg.textContent=t;
 async function refresh(){
  const {data:{session}}=await db.auth.getSession();
  loginBox.hidden=!!session;dash.hidden=!session;
  if(session)loadWorks();
 }
 $('login').onclick=async()=>{say('Memeriksa akun...');const {error}=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});say(error?error.message:'');if(!error)refresh();};
 $('logout').onclick=async()=>{await db.auth.signOut();refresh();};
 $('reset').onclick=()=>{$('workForm').reset();$('workId').value='';};
 async function loadWorks(){
  const {data,error}=await db.from('works').select('id,title,published,author').order('created_at',{ascending:false});
  const list=$('manageList');list.innerHTML='';
  if(error){list.textContent=error.message;return;}
  (data||[]).forEach(w=>{const row=document.createElement('div');row.className='entry';const label=document.createElement('span');label.textContent=w.title+' — '+(w.published?'TERBIT':'DRAF');const actions=document.createElement('div');const edit=document.createElement('button');edit.className='secondary';edit.textContent='EDIT';edit.onclick=()=>editWork(w.id);const del=document.createElement('button');del.className='secondary';del.textContent='HAPUS';del.onclick=()=>deleteWork(w.id);actions.append(edit,del);row.append(label,actions);list.append(row);});
 }
 async function editWork(id){const {data,error}=await db.from('works').select('*').eq('id',id).single();if(error)return say(error.message);$('workId').value=data.id;$('title').value=data.title;$('author').value=data.author||'';$('category').value=data.category||'';$('excerpt').value=data.excerpt||'';$('content').value=data.content||'';$('published').checked=!!data.published;window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});}
 async function deleteWork(id){if(!confirm('Hapus karya ini?'))return;const {error}=await db.from('works').delete().eq('id',id);say(error?error.message:'Karya dihapus.');loadWorks();}
 $('workForm').onsubmit=async e=>{e.preventDefault();say('Menyimpan...');let cover_url=null;const file=$('cover').files[0];if(file){const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'-');const path=Date.now()+'-'+safe;const up=await db.storage.from('covers').upload(path,file,{upsert:false});if(up.error)return say(up.error.message);cover_url=db.storage.from('covers').getPublicUrl(path).data.publicUrl;}
  const row={title:$('title').value,author:$('author').value,category:$('category').value,excerpt:$('excerpt').value,content:$('content').value,published:$('published').checked};if(cover_url)row.cover_url=cover_url;
  const id=$('workId').value;const result=id?await db.from('works').update(row).eq('id',id):await db.from('works').insert(row);
  say(result.error?result.error.message:'Karya berhasil disimpan.');if(!result.error){$('workForm').reset();$('workId').value='';loadWorks();}
 };
 db.auth.onAuthStateChange(()=>refresh());refresh();
})();