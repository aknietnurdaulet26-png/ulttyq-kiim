import {STEPS,TOTAL_STEPS,LEVELS} from './levels.js';
export function initialState(at){return {step:0,score:0,errors:0,bonuses:0,at,levelStart:0,pauseBase:0,item:'-',slot:'-'};}
export function applyAction(state,item,slot,now,pausedMs=0){
 if(state.step>=TOTAL_STEPS)throw Error('Ойын аяқталды.');
 const target=STEPS[state.step],correct=target.item===item&&target.slot===slot;
 const end=correct&&target.end;
 const elapsed=state.levelStart?now-state.levelStart-(pausedMs-state.pauseBase):0;
 const bonus=end&&state.levelStart>0&&elapsed<=59000?5:0;
 return {...state,step:state.step+(correct?1:0),score:state.score+(correct?10+bonus:-2),errors:state.errors+(correct?0:1),bonuses:state.bonuses+bonus,at:now,levelStart:end?0:(state.levelStart||now),pauseBase:end?0:(state.levelStart?state.pauseBase:pausedMs),item,slot};
}
export function elapsedRoom(meta,now){if(!meta?.startedAt)return 0;return Math.max(0,((meta.status==='paused'||meta.status==='ended')?meta.pausedAt:now)-meta.startedAt-meta.pausedMs);}
export function rankPlayers(players={}){return Object.entries(players).map(([uid,p])=>({uid,...p})).sort((a,b)=>b.state.score-a.state.score||b.state.step-a.state.step||a.state.errors-b.state.errors||a.uid.localeCompare(b.uid));}
export function levelLabel(step){return step>=TOTAL_STEPS?'15 / 15 ✓':`${(LEVELS.find(l=>step<l.end)||LEVELS.at(-1)).id} / 15`;}
export function clock(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
export function csvCell(value){let s=String(value??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function toCSV(players){return '\ufeff'+[['Орын','Оқушы','Сынып','Ұпай','Деңгей','Қате','Бонус'],...rankPlayers(players).map((p,i)=>[i+1,p.name,p.className,p.state.score,levelLabel(p.state.step),p.state.errors,p.state.bonuses])].map(row=>row.map(csvCell).join(';')).join('\r\n');}
