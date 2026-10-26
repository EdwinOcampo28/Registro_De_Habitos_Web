(function(){
 'use strict';
 const habits=()=>window.HabitData.habits.map(x=>x.name);
 const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 function dateOffset(n){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return iso(d)}
 function parseDay(s){return new Date(s+'T12:00:00')}
 function records(){return window.HabitStorage.state.records||{}}
 function validDay(key){if(!/^\d{4}-\d{2}-\d{2}$/.test(key))return false;const d=parseDay(key);return !Number.isNaN(d.getTime())&&iso(d)===key}
 function days(){return Object.keys(records()).filter(validDay).sort()}
 function inPlan(name,day){return window.HabitPlanning?window.HabitPlanning.isScheduled(name,day):true}
 function count(day){const h=records()[day]?.habitos||{};return habits().filter(n=>Number(h[n])===1).length}
 function scheduledNames(day){return habits().filter(n=>inPlan(n,day))}
 function scheduledCount(day){return scheduledNames(day).length}
 function countScheduled(day){const h=records()[day]?.habitos||{};return scheduledNames(day).filter(n=>Number(h[n])===1).length}
 function pctDay(day){const expected=scheduledCount(day);return expected?Math.round(countScheduled(day)/expected*100):null}
 function dateRange(){const all=days();return all.length?{start:parseDay(all[0]),end:parseDay(all[all.length-1])}:null}
 function eachDate(start,end,fn){const d=new Date(start);d.setHours(12,0,0,0);const last=new Date(end);last.setHours(12,0,0,0);for(;d<=last;d.setDate(d.getDate()+1))fn(iso(d),new Date(d))}
 function pctHabit(h){const range=dateRange();if(!range)return 0;let expected=0,done=0;eachDate(range.start,range.end,key=>{if(inPlan(h,key)){expected++;if(Number(records()[key]?.habitos?.[h])===1)done++}});return expected?Math.round(done/expected*100):0}
 function overall(){const range=dateRange();if(!range)return 0;let expected=0,done=0;eachDate(range.start,range.end,key=>habits().forEach(h=>{if(inPlan(h,key)){expected++;if(Number(records()[key]?.habitos?.[h])===1)done++}}));return expected?Math.round(done/expected*100):0}
 function streak(h){
  const all=days();if(!all.length)return{best:0,current:0};const start=parseDay(all[0]),today=parseDay(dateOffset(0));let best=0,run=0,planned=[];
  eachDate(start,today,(key,d)=>{if(inPlan(h,key))planned.push({key,date:d,done:Number(records()[key]?.habitos?.[h])===1})});
  planned.forEach(slot=>{if(slot.done){run++;best=Math.max(best,run)}else run=0});
  let relevant=planned;if(planned.length){const last=planned[planned.length-1];if(last.key===dateOffset(0)&&!last.done)relevant=planned.slice(0,-1)}
  let current=0;for(let i=relevant.length-1;i>=0&&relevant[i].done;i--)current++;
  return{best,current};
 }
 function dayStats(){return Array.from({length:7},(_,i)=>{const d=dateOffset(i-6);return{date:d,pct:records()[d]?pctDay(d):null,count:records()[d]?countScheduled(d):0,total:scheduledCount(d)}})}
 function todayStats(day=dateOffset(0)){return{done:countScheduled(day),total:scheduledCount(day),percent:pctDay(day)}}
 window.HabitAnalytics={iso,dateOffset,parseDay,days,count,scheduledNames,scheduledCount,countScheduled,pctDay,pctHabit,overall,streak,dayStats,todayStats,habits};
})();
