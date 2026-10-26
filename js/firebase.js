import {firebaseConfig,USE_EMULATORS} from './firebase-config.js';
let pending;
export const configured=()=>USE_EMULATORS||['apiKey','authDomain','databaseURL','projectId','appId'].every(k=>firebaseConfig[k]);
export async function connect(){
 if(!configured())throw Error('Firebase әлі бапталмаған. README.md нұсқаулығымен js/firebase-config.js файлын толтырыңыз.');
 if(!pending)pending=(async()=>{
  const [appSDK,a,d]=await Promise.all([import('./vendor/firebase-app.js'),import('./vendor/firebase-auth.js'),import('./vendor/firebase-database.js')]);
  const app=appSDK.initializeApp(USE_EMULATORS?{apiKey:'demo-key',projectId:'demo-ulttyq-kiim',authDomain:'localhost',databaseURL:'https://demo-ulttyq-kiim-default-rtdb.firebaseio.com'}:firebaseConfig);
  const auth=a.getAuth(app),db=d.getDatabase(app);
  if(USE_EMULATORS){a.connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});d.connectDatabaseEmulator(db,'127.0.0.1',9000);}
  await a.setPersistence(auth,a.browserLocalPersistence);await auth.authStateReady();
  let offset=0,online=false;
  d.onValue(d.ref(db,'.info/serverTimeOffset'),s=>offset=s.val()||0);
  d.onValue(d.ref(db,'.info/connected'),s=>{online=s.val()===true;document.dispatchEvent(new CustomEvent('connection',{detail:online}));});
  return {auth,db,a,d,now:()=>Date.now()+offset,isOnline:()=>online};
 })().catch(e=>{pending=null;throw e;});
 return pending;
}
export async function student(){const c=await connect();if(!c.auth.currentUser)await c.a.signInAnonymously(c.auth);return c;}
export async function isTeacher(c){if(!c.auth.currentUser)return false;return (await c.d.get(c.d.ref(c.db,`teachers/${c.auth.currentUser.uid}`))).val()===true;}
export function roomCode(value){const code=String(value||'').trim().toUpperCase();if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code))throw Error('Бөлме коды 6 таңбадан тұрады. Мұғалім берген кодты енгіз.');return code;}
export function randomHex(bytes){return [...crypto.getRandomValues(new Uint8Array(bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function recoveryKey(){const c=await student();const existing=localStorage.getItem('kiim-recovery-'+c.auth.currentUser.uid);if(existing)return existing;if(!c.auth.currentUser.isAnonymous)throw Error('Қалпына келтіру кілтін бұрын сақтаған жерден іздеңіз. Жаңа кілт жасалмайды.');const key=randomHex(12)+'.'+randomHex(20),[id,password]=key.split('.');await c.a.linkWithCredential(c.auth.currentUser,c.a.EmailAuthProvider.credential(`s-${id}@students.invalid`,password));localStorage.setItem('kiim-recovery-'+c.auth.currentUser.uid,key);return key;}
export async function restoreKey(key){if(!/^[a-f0-9]{24}\.[a-f0-9]{40}$/.test(key.trim()))throw Error('Қалпына келтіру кілті дұрыс емес.');const c=await connect();const [id,password]=key.trim().split('.');await c.a.signInWithEmailAndPassword(c.auth,`s-${id}@students.invalid`,password);localStorage.setItem('kiim-recovery-'+c.auth.currentUser.uid,key.trim());return c;}
export function friendly(error){const codes={'auth/invalid-credential':'Электрондық пошта немесе құпиясөз қате.','auth/invalid-email':'Электрондық пошта мекенжайын тексеріңіз.','auth/too-many-requests':'Сұрау тым көп. Біраздан кейін қайталап көріңіз.','auth/network-request-failed':'Желіге қосылуды тексеріңіз.','PERMISSION_DENIED':'Рұқсат берілмеді. Бөлме күйін, мұғалім рұқсатын және Firebase ережелерін тексеріңіз.','permission-denied':'Рұқсат берілмеді. Бөлме күйін және мұғалім рұқсатын тексеріңіз.'};return codes[error.code]||(/permission_denied/i.test(error.message)?codes.PERMISSION_DENIED:error.message)||'Қате орын алды.';}
