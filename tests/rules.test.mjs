import test from 'node:test';import assert from 'node:assert/strict';import fs from'node:fs';import {initializeTestEnvironment,assertSucceeds,assertFails}from'@firebase/rules-unit-testing';import {ref,set,get,update,onValue,serverTimestamp,runTransaction}from'firebase/database';import{initialState,applyAction}from'../js/core.js';import{STEPS,TOTAL_STEPS}from'../js/levels.js';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for (const key of Object.keys(process.env)) if (/proxy/i.test(key)) delete process.env[key];
let env;
test('Realtime security + all 15 levels + 30 clients + LIVE subscription',async()=>{
 env=await initializeTestEnvironment({projectId:'demo-ulttyq-kiim',database:{host:'127.0.0.1',port:9000,rules:fs.readFileSync('database.rules.json','utf8')}});
 try{
 console.log("Emulator ready");await env.clearDatabase();console.log("Database cleared");await env.withSecurityRulesDisabled(async ctx=>{await set(ref(ctx.database(),'catalog'),JSON.parse(fs.readFileSync('catalog.seed.json','utf8')));await set(ref(ctx.database(),'teachers/t1'),true);await set(ref(ctx.database(),'teachers/t2'),true);});
 console.log('Catalog seeded');const teacher=env.authenticatedContext('t1').database(),otherTeacher=env.authenticatedContext('t2').database(),s=env.authenticatedContext('s0',{firebase:{sign_in_provider:'anonymous'}}).database();
 const meta={owner:'t1',title:'5А сыныбы',status:'waiting',round:1,createdAt:serverTimestamp(),startedAt:0,pausedAt:0,pausedMs:0};
 await assertSucceeds(set(ref(teacher,'rooms/ABC234/meta'),meta));await assertFails(set(ref(s,'teachers/s0'),true));await assertFails(update(ref(otherTeacher,'rooms/ABC234/meta'),{status:'running'}));await assertFails(get(ref(s,'rooms')));
 const dbs=Array.from({length:30},(_,i)=>env.authenticatedContext('s'+i).database());
 const profile=()=>({name:'Оқушы',className:'5А',joinedAt:serverTimestamp(),state:initialState(serverTimestamp())});
 await Promise.all(dbs.map((db,i)=>assertSucceeds(set(ref(db,`rooms/ABC234/players/1/s${i}`),profile()))));
 const sp=ref(s,'rooms/ABC234/players/1/s0/state');await assertFails(update(sp,{score:9999,at:serverTimestamp()}));await assertFails(set(ref(s,'rooms/ABC234/players/1/s0/state'),null));await assertFails(set(ref(s,'rooms/ABC234/players/1/s0'),null));await assertFails(update(ref(s,'rooms/ABC234/players/1/s1'),{name:'Changed'}));await assertFails(get(ref(s,'rooms/ABC234/players/1')));
 const approvals=Object.fromEntries(dbs.map((_,i)=>['s'+i,true]));await assertSucceeds(set(ref(teacher,'rooms/ABC234/admissions/1'),approvals));await assertSucceeds(get(ref(s,'rooms/ABC234/players/1')));
 await assertSucceeds(update(ref(teacher,'rooms/ABC234/meta'),{status:'running',startedAt:serverTimestamp()}));
 let observed=0;const unsub=onValue(ref(teacher,'rooms/ABC234/players/1'),snapshot=>{observed=Object.values(snapshot.val()||{}).filter(p=>p.state.score>=10).length;});
 async function move(db,uid,item,slot){const path=ref(db,`rooms/ABC234/players/1/${uid}/state`),old=(await get(path)).val();const next=applyAction(old,item,slot,Date.now());next.at=serverTimestamp();if(!old.levelStart&&next.levelStart)next.levelStart=serverTimestamp();await assertSucceeds(set(path,next));return (await get(path)).val();}
 await sleep(250);await Promise.all(dbs.map((db,i)=>move(db,'s'+i,STEPS[0].item,STEPS[0].slot)));await sleep(100);assert.equal(observed,30,'LIVE sees all 30 devices without polling');unsub();
 await sleep(250);let current=(await get(sp)).val();let bad={...current,score:10000,at:serverTimestamp()};await assertFails(set(sp,bad));await assertFails(set(sp,{...current,step:50,at:serverTimestamp()}));await assertFails(set(sp,{...current,bonuses:1000,at:serverTimestamp()}));await assertFails(update(ref(s,'catalog/v1/steps/1'),{item:'saukele'}));
 await move(s,'s0','saukele','head');assert.equal((await get(sp)).val().errors,1);
 for(let i=1;i<TOTAL_STEPS;i++){await sleep(220);await move(s,'s0',STEPS[i].item,STEPS[i].slot);}
 current=(await get(sp)).val();assert.equal(current.step,TOTAL_STEPS);assert.equal(current.score,TOTAL_STEPS*10+75-2);assert.equal(current.errors,1);
 await assertFails(set(sp,initialState(serverTimestamp())));await assertFails(set(sp,{...current,score:current.score+10,at:serverTimestamp()}));
 const fresh=env.authenticatedContext('s1').database();await assertSucceeds(update(ref(teacher,'rooms/ABC234/meta'),{status:'paused',pausedAt:serverTimestamp()}));const old=(await get(ref(fresh,'rooms/ABC234/players/1/s1/state'))).val();await assertFails(set(ref(fresh,'rooms/ABC234/players/1/s1/state'),{...applyAction(old,STEPS[1].item,STEPS[1].slot,Date.now()),at:serverTimestamp()}));
 await assertSucceeds(update(ref(teacher,'rooms/ABC234/meta'),{status:'ended'}));await assertFails(set(ref(env.authenticatedContext('late').database(),'rooms/ABC234/players/1/late'),profile()));
 await assertSucceeds(update(ref(teacher,'rooms/ABC234/meta'),{status:'waiting',round:2,startedAt:0,pausedAt:0,pausedMs:0}));await assertFails(update(sp,{at:serverTimestamp()}));await assertSucceeds(set(ref(s,'rooms/ABC234/players/2/s0'),profile()));assert.equal((await get(sp)).val().score,current.score,'reset archives previous round');
 }finally{await env.cleanup();}
});
