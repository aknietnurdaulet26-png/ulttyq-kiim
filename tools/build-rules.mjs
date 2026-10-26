import fs from 'node:fs';
import {STEPS,ITEMS,TOTAL_STEPS} from '../js/levels.js';
const meta="root.child('rooms').child($code).child('meta')";
const owner=`auth != null && root.child('teachers').child(auth.uid).val() === true && ${meta}.child('owner').val() === auth.uid`;
const teach="auth != null && root.child('teachers').child(auth.uid).val() === true";
const round=`('' + ${meta}.child('round').val()) === $round`;
const admitted=`root.child('rooms').child($code).child('admissions').child($round).child(auth.uid).val() === true`;
const n=k=>`newData.child('${k}').val()`, d=k=>`data.child('${k}').val()`;
const target=`root.child('catalog/v1/steps').child('' + ${d('step')})`;
const correct=`(${n('item')} === ${target}.child('item').val() && ${n('slot')} === ${target}.child('slot').val())`;
const end=`(${correct} && ${target}.child('end').val() === true)`;
const paused=`${meta}.child('pausedMs').val()`;
const bonusOK=`(${n('bonuses')} === ${d('bonuses')} || (${end} && ${d('levelStart')} > 0 && now - ${d('levelStart')} - (${paused} - ${d('pauseBase')}) <= 60000 && ${n('bonuses')} === ${d('bonuses')} + 5))`;
const stateValidation=`newData.hasChildren(['step','score','errors','bonuses','at','levelStart','pauseBase','item','slot']) && ${n('at')} === now && ((!data.exists() && ${n('step')} === 0 && ${n('score')} === 0 && ${n('errors')} === 0 && ${n('bonuses')} === 0 && ${n('levelStart')} === 0 && ${n('pauseBase')} === 0 && ${n('item')} === '-' && ${n('slot')} === '-') || (data.exists() && ${meta}.child('status').val() === 'running' && ${admitted} && ${d('step')} < ${TOTAL_STEPS} && now >= ${d('at')} + 200 && root.child('catalog/v1/items').child(${n('item')}).exists() && root.child('catalog/v1/slots').child(${n('slot')}).exists() && ${n('step')} === ${d('step')} + (${correct} ? 1 : 0) && ${n('errors')} === ${d('errors')} + (${correct} ? 0 : 1) && ${bonusOK} && ${n('score')} === ${d('score')} + (${correct} ? 10 : -2) + ${n('bonuses')} - ${d('bonuses')} && ${n('levelStart')} === (${end} ? 0 : (${d('levelStart')} === 0 ? now : ${d('levelStart')})) && ${n('pauseBase')} === (${end} ? 0 : (${d('levelStart')} === 0 ? ${paused} : ${d('pauseBase')}))))`;
const state={'.validate':stateValidation};
for(const k of ['step','score','errors','bonuses','at','levelStart','pauseBase'])state[k]={'.validate':'newData.isNumber()'};
for(const k of ['item','slot'])state[k]={'.validate':'newData.isString() && newData.val().length <= 20'};
state.$other={'.validate':false};
const rules={rules:{'.read':false,'.write':false,teachers:{'$uid':{'.read':'auth != null && auth.uid === $uid','.write':false}},catalog:{'.read':'auth != null','.write':false},teacherRooms:{'$uid':{'.read':`${teach} && auth.uid === $uid`,'$code':{'.write':`${teach} && auth.uid === $uid`,'.validate':"newData.val() === true"}}},rooms:{'$code':{
 meta:{'.read':"auth != null",'.write':`${teach} && newData.exists() && ((!data.exists() && newData.child('owner').val() === auth.uid && $code.matches(/^[A-HJ-NP-Z2-9]{6}$/)) || data.child('owner').val() === auth.uid)`,'.validate':"newData.hasChildren(['owner','title','status','round','createdAt','startedAt','pausedAt','pausedMs'])",owner:{'.validate':"newData.isString() && (!data.exists() || newData.val() === data.val())"},title:{'.validate':"newData.isString() && newData.val().length > 0 && newData.val().length <= 80"},status:{'.validate':"newData.val() === 'waiting' || newData.val() === 'running' || newData.val() === 'paused' || newData.val() === 'ended'"},round:{'.validate':"newData.isNumber() && newData.val() >= 1 && newData.val() % 1 === 0"},createdAt:{'.validate':"newData.isNumber()"},startedAt:{'.validate':"newData.isNumber()"},pausedAt:{'.validate':"newData.isNumber()"},pausedMs:{'.validate':"newData.isNumber() && newData.val() >= 0"},'$other':{'.validate':false}},
 admissions:{'$round':{'.read':`(${owner}) || (auth != null && ${admitted})`,'.write':owner,'$uid':{'.read':`auth != null && auth.uid === $uid`,'.write':owner,'.validate':'newData.isBoolean()'}}},
 players:{'$round':{'.read':`(${owner}) || (auth != null && ${admitted})`,'$uid':{'.read':`auth != null && auth.uid === $uid`,'.write':`auth != null && auth.uid === $uid && ${round} && newData.exists() && (${meta}.child('status').val() === 'waiting' || ${meta}.child('status').val() === 'running' || ${meta}.child('status').val() === 'paused')`,'.validate':"newData.hasChildren(['name','className','joinedAt','state'])",name:{'.validate':"newData.isString() && newData.val().length >= 2 && newData.val().length <= 60 && (!data.exists() || newData.val() === data.val())"},className:{'.validate':"newData.isString() && newData.val().length >= 1 && newData.val().length <= 12 && (!data.exists() || newData.val() === data.val())"},joinedAt:{'.validate':"newData.isNumber() && (!data.exists() ? newData.val() === now : newData.val() === data.val())"},state,'$other':{'.validate':false}}}}
}}}};
// .validate does not run on deleted data. Keep required state children at player level;
// parent .write requires newData.exists(), preventing deletion and replay resets.
fs.writeFileSync(new URL('../database.rules.json',import.meta.url),JSON.stringify(rules,null,2)+'\n');
const catalog={v1:{steps:Object.fromEntries(STEPS.map((s,i)=>[i,s])),items:Object.fromEntries(Object.keys(ITEMS).map(k=>[k,true])),slots:{head:true,body:true,legs:true,waist:true,feet:true}}};
fs.writeFileSync(new URL('../catalog.seed.json',import.meta.url),JSON.stringify(catalog,null,2)+'\n');
