(function(){
 'use strict';
 const HD=window.HabitData,D=HD.habits,S=window.HabitStorage,$=id=>document.getElementById(id);
 const weekdays=[{value:1,label:'Lun'},{value:2,label:'Mar'},{value:3,label:'Mié'},{value:4,label:'Jue'},{value:5,label:'Vie'},{value:6,label:'Sáb'},{value:0,label:'Dom'}];
 const saveTimers=new Map();
 function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
 function parseKey(key){return new Date(key+'T12:00:00')}
 function weekStart(date=new Date()){const d=new Date(date);d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d}
 function weekKey(){return dateKey(weekStart())}
 function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 function ensureState(){
  const s=S.state;let changed=false;
  if(!s.habitPlans||typeof s.habitPlans!=='object'){s.habitPlans={};changed=true}
  if(!Array.isArray(s.focusHabits)){s.focusHabits=[];changed=true}
  if(!s.weeklyReviews||typeof s.weeklyReviews!=='object'){s.weeklyReviews={};changed=true}
  const currentWeek=weekKey();if(s.focusWeek!==currentWeek){const firstWeek=!s.focusWeek;s.focusWeek=currentWeek;s.focusHabits=firstWeek?[...HD.starterFocusHabits]:[];changed=true}
  if(!s.focusStarterApplied){if(!s.focusHabits.length)s.focusHabits=[...HD.starterFocusHabits];s.focusStarterApplied=true;changed=true}
  D.forEach(h=>{const old=s.habitPlans[h.name],starter=HD.starterPlans[h.name]||{};if(!old||typeof old!=='object'){s.habitPlans[h.name]={days:[...(starter.days||[0,1,2,3,4,5,6])],cue:starter.cue||'',minimum:starter.minimum||'',planB:starter.planB||''};changed=true}else{if(!Array.isArray(old.days)){old.days=[0,1,2,3,4,5,6];changed=true}if(typeof old.cue!=='string'){old.cue=starter.cue||'';changed=true}if(typeof old.minimum!=='string'){old.minimum=starter.minimum||'';changed=true}if(typeof old.planB!=='string'){old.planB=starter.planB||'';changed=true}}});
  s.focusHabits=s.focusHabits.filter(name=>D.some(h=>h.name===name)).slice(0,3);
  if(changed&&S.active)S.save();return s;
 }
 function planFor(name){if(!S.state.habitPlans||!S.state.habitPlans[name])ensureState();return S.state.habitPlans[name]}
 function isScheduled(name,key){const d=parseKey(key);return !Number.isNaN(d.getTime())&&planFor(name).days.includes(d.getDay())}
 function focusHabits(){const s=ensureState();return D.filter(h=>s.focusHabits.includes(h.name))}
 function weeklyHabitStats(name,includeFuture=false){const start=weekStart(),p=planFor(name),dates=[],today=dateKey(new Date());for(let i=0;i<7;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d);if(p.days.includes(d.getDay())&&(includeFuture||key<=today))dates.push(key)}const done=dates.filter(d=>Number(S.state.records[d]?.habitos?.[name])===1).length;return{done,total:dates.length,remaining:Math.max(0,dates.length-done)}}
 function weeklyStats(names,includeFuture=false){const selected=names||D.map(h=>h.name);let done=0,total=0;selected.forEach(name=>{const s=weeklyHabitStats(name,includeFuture);done+=s.done;total+=s.total});return{done,total,remaining:Math.max(0,total-done),percent:total?Math.round(done/total*100):0}}
 function frequencyLabel(name){const n=planFor(name).days.length;return n===7?'Todos los días':n===0?'Pausado':n+' día'+(n===1?'':'s')+' por semana'}
 function focusStatus(name){const key=dateKey(new Date()),scheduled=isScheduled(name,key),done=Number(S.state.records[key]?.habitos?.[name])===1;if(!scheduled)return'○ Día libre';return done?'✓ Completado':'Pendiente hoy'}
 function renderFocusDashboard(){
  const root=$('todayPreview');if(!root)return;const focused=focusHabits();root.innerHTML='';
  if(!focused.length){root.innerHTML='<div class="focus-empty"><p>Elige hasta tres hábitos para enfocar esta semana.</p><button class="text-btn" type="button" data-goto="plan">Preparar mi plan →</button></div>';}
  focused.forEach(h=>{const p=planFor(h.name),row=document.createElement('div');row.className='preview-row focus-preview-row';const info=document.createElement('div');info.className='focus-preview-copy';const name=document.createElement('strong');name.textContent=h.name;const detail=document.createElement('small');detail.textContent=p.cue||p.minimum||frequencyLabel(h.name);info.append(name,detail);const status=document.createElement('span');status.className='mini-status'+(focusStatus(h.name).startsWith('✓')?' done':'');status.textContent=focusStatus(h.name);row.append(info,status);root.append(row)});
  const scheduled=focused.filter(h=>isScheduled(h.name,dateKey(new Date()))).length,done=focused.filter(h=>focusStatus(h.name).startsWith('✓')).length;
  $('todayHint').textContent=focused.length?(scheduled?done+' de '+scheduled+' hábitos foco programados para hoy completados.':'Hoy tus hábitos foco tienen descanso programado.'): 'Un plan pequeño y realista ayuda a mantener el ritmo.';
 }
 function setPlanMessage(message){const el=$('planSaveMessage');if(el)el.textContent=message}
 function render(){
  ensureState();const root=$('habitPlanList');if(!root)return;const start=weekStart(),end=new Date(start);end.setDate(start.getDate()+6);
  $('planWeekLabel').textContent=start.toLocaleDateString('es-CO',{day:'numeric',month:'short'})+' – '+end.toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});
  root.innerHTML=D.map((h,index)=>{const p=planFor(h.name),s=weeklyHabitStats(h.name,true),focused=S.state.focusHabits.includes(h.name),days=weekdays.map(day=>'<label class="day-pill"><input type="checkbox" data-schedule-habit="'+esc(h.name)+'" value="'+day.value+'" '+(p.days.includes(day.value)?'checked':'')+'><span>'+day.label+'</span></label>').join('');
   return (index===0||D[index-1].category!==h.category?'<div class="plan-category-heading"><span>'+esc(h.category)+'</span></div>':'')+'<article class="habit-plan-card'+(focused?' is-focus':'')+'"><div class="habit-plan-heading"><label class="focus-choice"><input type="checkbox" data-focus-habit="'+esc(h.name)+'" '+(focused?'checked':'')+'><span>Enfoque</span></label><div class="habit-plan-name"><h3>'+esc(h.name)+'</h3><small>'+esc(h.category)+' · '+esc(frequencyLabel(h.name))+'</small></div><div class="habit-week-score"><strong>'+s.done+'/'+s.total+'</strong><small>esta semana</small></div></div><details class="habit-plan-details" '+(focused?'open':'')+'><summary>'+esc(frequencyLabel(h.name))+' · Señal y plan B</summary><div class="habit-plan-days">'+days+'</div><div class="habit-plan-fields"><label>¿Qué te recordará empezar?<input type="text" maxlength="100" data-plan-habit="'+esc(h.name)+'" data-plan-field="cue" value="'+esc(p.cue)+'" placeholder="Ej. Después del desayuno"></label><label>Versión mínima para un día difícil<input type="text" maxlength="100" data-plan-habit="'+esc(h.name)+'" data-plan-field="minimum" value="'+esc(p.minimum)+'" placeholder="Ej. Leer una página"></label><label>Plan B si algo se interpone<input type="text" maxlength="100" data-plan-habit="'+esc(h.name)+'" data-plan-field="planB" value="'+esc(p.planB)+'" placeholder="Ej. Si llueve, entreno en casa"></label></div></details></article>';
  }).join('');
  const review=S.state.weeklyReviews[weekKey()]||{};$('reviewHelped').value=review.helped||'';$('reviewObstacle').value=review.obstacle||'';$('reviewAdjustment').value=review.adjustment||'';
  renderSummary();renderFocusDashboard();
 }
 function renderSummary(){const s=ensureState(),focused=weeklyStats(s.focusHabits,true),count=s.focusHabits.length;$('focusCount').textContent=count+' / 3';$('focusCountHint').textContent=count?'Hábitos elegidos para esta semana':'Elige hasta tres para enfocarte';$('focusProgress').textContent=focused.done+' / '+focused.total;$('focusProgressHint').textContent=count?(focused.total?focused.remaining+' ocasión'+(focused.remaining===1?' programada':'es programadas')+' en tu plan de esta semana.':'Tus hábitos foco están en pausa.'):'Selecciona hábitos foco para ver su avance.'}

 function bind(){
  const root=$('habitPlanList');if(!root||root.dataset.bound)return;root.dataset.bound='true';
  root.addEventListener('change',e=>{const target=e.target;
   if(target.matches('[data-focus-habit]')){const name=target.dataset.focusHabit,s=ensureState(),selected=s.focusHabits.filter(x=>x!==name);if(target.checked){if(s.focusHabits.length>=3){target.checked=false;setPlanMessage('Puedes elegir hasta tres hábitos foco por semana.');return}selected.push(name)}s.focusHabits=selected;s.focusWeek=weekKey();S.save();render();setPlanMessage('Plan guardado automáticamente.');document.dispatchEvent(new Event('habit-plan-updated'));return}
   if(target.matches('[data-schedule-habit]')){const p=planFor(target.dataset.scheduleHabit),day=Number(target.value);p.days=target.checked?Array.from(new Set(p.days.concat(day))).sort((a,b)=>a-b):p.days.filter(x=>x!==day);S.save();render();setPlanMessage('Frecuencia guardada automáticamente.');document.dispatchEvent(new Event('habit-plan-updated'));}
  });
  root.addEventListener('input',e=>{const target=e.target;if(target.matches('[data-plan-field]')){planFor(target.dataset.planHabit)[target.dataset.planField]=target.value;const key=target.dataset.planHabit+':'+target.dataset.planField;clearTimeout(saveTimers.get(key));saveTimers.set(key,setTimeout(()=>{S.save();setPlanMessage('Plan guardado automáticamente.');renderSummary();renderFocusDashboard()},350))}});
  const review=$('weeklyReviewForm');if(!review.dataset.bound){review.dataset.bound='true';review.addEventListener('input',e=>{const target=e.target;if(!target.matches('[data-review-field]'))return;const key=weekKey(),item=S.state.weeklyReviews[key]||(S.state.weeklyReviews[key]={});item[target.dataset.reviewField]=target.value;clearTimeout(saveTimers.get('review:'+target.dataset.reviewField));saveTimers.set('review:'+target.dataset.reviewField,setTimeout(()=>{S.save();$('reviewSaveMessage').textContent='Revisión guardada automáticamente.'},350))});review.addEventListener('submit',e=>e.preventDefault())}
 }
 function refreshDashboard(){renderSummary();renderFocusDashboard()}
 window.HabitPlanning={ensureState,planFor,isScheduled,focusHabits,weekKey,weeklyHabitStats,weeklyStats,frequencyLabel,render,bind,refreshDashboard,renderFocusDashboard};
})();

