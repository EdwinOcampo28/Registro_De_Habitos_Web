(function(){
 const KEY='registroHabitos.v3.accounts', SESSION='registroHabitos.v3.session', LEGACY=['registroHabitos.v2','registroHabitos.v1'];
 let state={user:'Mi espacio',username:'',goal:70,theme:'light',avatar:'🌱',records:{},readNotifications:[]};
 let accounts={}; let active='';
 function safeName(s){return String(s||'').trim().toLocaleLowerCase('es').replace(/\s+/g,' ')}
 function valid(s){return s&&typeof s==='object'&&s.records&&typeof s.records==='object'}
 function migrateData(data){
  if(!data||typeof data!=='object')return false;
  let changed=false;const aliases=window.HabitData.habitAliases||{};
  Object.values(data.records||{}).forEach(record=>{
   const habits=record?.habitos;if(!habits||typeof habits!=='object')return;
   Object.entries(aliases).forEach(([oldName,newName])=>{
    if(!Object.prototype.hasOwnProperty.call(habits,oldName))return;
    const oldValue=habits[oldName],current=habits[newName];
    if(current===undefined||current===null)habits[newName]=oldValue;
    else if(Number(oldValue)===1||Number(current)===1)habits[newName]=1;
    delete habits[oldName];changed=true;
   });
  });
  if(data.habitPlans&&typeof data.habitPlans==='object')Object.entries(aliases).forEach(([oldName,newName])=>{
   const oldPlan=data.habitPlans[oldName];if(!oldPlan)return;
   const current=data.habitPlans[newName];
   if(!current)data.habitPlans[newName]=oldPlan;
   else{
    if(Array.isArray(oldPlan.days))current.days=[...new Set([...(Array.isArray(current.days)?current.days:[]),...oldPlan.days])].sort((a,b)=>a-b);
    ['cue','minimum','planB'].forEach(key=>{if(!current[key]&&oldPlan[key])current[key]=oldPlan[key]});
   }
   delete data.habitPlans[oldName];changed=true;
  });
  if(Array.isArray(data.focusHabits)){
   const mapped=[...new Set(data.focusHabits.map(name=>aliases[name]||name))];
   if(JSON.stringify(mapped)!==JSON.stringify(data.focusHabits)){data.focusHabits=mapped;changed=true;}
  }
  return changed;
 }
 function load(){
  try{
   accounts=JSON.parse(localStorage.getItem(KEY)||'{}')||{};active=localStorage.getItem(SESSION)||'';
   if(active&&accounts[active]&&valid(accounts[active].data)){
    state={...state,...accounts[active].data};
    if(migrateData(state)){accounts[active].data=state;persistAccounts();}
    return state;
   }
   active='';state={user:'Mi espacio',username:'',goal:70,theme:'light',avatar:'🌱',records:{},readNotifications:[]};
  }catch(e){accounts={};active='';console.warn('No se pudo leer el registro local.',e)}
  return state;
 }
 function persistAccounts(){try{localStorage.setItem(KEY,JSON.stringify(accounts));return true}catch(e){alert('No se pudo guardar. Revisa el espacio disponible del navegador.');return false}}
 function save(){if(!active)return false;migrateData(state);accounts[active].data=state;return persistAccounts()}
 function register(name,password,requestedUsername){
  const username=safeName(requestedUsername||name);if(username.length<3)return {ok:false,message:'El usuario debe tener al menos 3 caracteres.'};if(String(password||'').length<4)return {ok:false,message:'La contraseña debe tener al menos 4 caracteres.'};if(accounts[username])return {ok:false,message:'Ese usuario ya existe. Inicia sesión.'};
  const isFirst=Object.keys(accounts).length===0;let initial={user:String(name).trim().slice(0,32),username,goal:70,theme:'light',avatar:'🌱',records:{},readNotifications:[]};
  if(isFirst){for(const key of LEGACY){try{const old=JSON.parse(localStorage.getItem(key)||'null');if(valid(old)){initial={...initial,...old};break}}catch(_){}}}
  migrateData(initial);
  state={...initial,user:String(name).trim().slice(0,32),username,goal:Number(initial.goal)||70,theme:initial.theme||'light',avatar:initial.avatar||'🌱',records:initial.records||{},readNotifications:initial.readNotifications||[]};
  accounts[username]={username,displayName:String(name).trim().slice(0,32),password:String(password),data:state};active=username;if(!persistAccounts())return {ok:false,message:'No se pudo guardar la cuenta.'};localStorage.setItem(SESSION,active);return {ok:true};
 }
 function login(name,password){const username=safeName(name),account=accounts[username];if(!account||account.password!==String(password))return {ok:false,message:'Usuario o contraseña incorrectos.'};active=username;state={...state,...account.data};if(migrateData(state)){accounts[username].data=state;persistAccounts();}localStorage.setItem(SESSION,active);return {ok:true}}
 function logout(){save();localStorage.removeItem(SESSION);active='';state={user:'Mi espacio',username:'',goal:70,theme:'light',avatar:'🌱',records:{},readNotifications:[]}}
 function updateProfile(name,avatar){state.user=String(name||'Mi espacio').trim().slice(0,32)||'Mi espacio';state.avatar=avatar||state.avatar||'🌱';if(active&&accounts[active])accounts[active].displayName=state.user;return save()}
 function changePassword(currentPassword,newPassword){if(!active||!accounts[active])return {ok:false,message:'No hay una sesión activa.'};const account=accounts[active];if(account.password!==String(currentPassword||''))return {ok:false,message:'La contraseña actual no coincide.'};if(String(newPassword||'').length<4)return {ok:false,message:'La nueva contraseña debe tener al menos 4 caracteres.'};account.password=String(newPassword);if(!persistAccounts())return {ok:false,message:'No se pudo guardar el cambio. Inténtalo de nuevo.'};return {ok:true,message:'Contraseña actualizada correctamente.'}}
 function day(key){if(!state.records[key])state.records[key]={habitos:{},reflexion:{}};const record=state.records[key];if(!record.habitos)record.habitos={};if(!record.reflexion)record.reflexion={};return record}
 window.HabitStorage={KEY,get state(){return state},get accounts(){return accounts},get active(){return active},load,save,day,register,login,logout,updateProfile,changePassword};
})();
