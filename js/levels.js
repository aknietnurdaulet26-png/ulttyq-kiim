export const ITEMS = {
 shapan:{name:'Шапан',slot:'body',description:'Ұзын әрі кең пішілген сырт киім. Сәнді шапанның өңірі мен жеңі ою-өрнекпен безендіріледі.'},
 kamzol:{name:'Камзол',slot:'body',description:'Көйлектің сыртынан киілетін, көбіне жеңсіз немесе қысқа жеңді, қынама киім.'},
 saukele:{name:'Сәукеле',slot:'head',description:'Қалыңдықтың биік, әшекейлі баскиімі. Үкісі, моншақтары және желегі болады.'},
 taqiya:{name:'Тақия',slot:'head',description:'Жеңіл, шағын баскиім. Ерлерге де, қыздарға да арналған түрлері бар.'},
 borik:{name:'Бөрік',slot:'head',description:'Жиегі аң терісімен көмкерілген жылы баскиім.'},
 koylek:{name:'Көйлек',slot:'body',description:'Денеге киілетін негізгі киім. Қыздардың ұлттық көйлегі бүрмелерімен және әшекейімен ерекшеленеді.'},
 shalbar:{name:'Шалбар',slot:'legs',description:'Аяққа киілетін екі балақты киім. Қимылдауға ыңғайлы етіп тігіледі.'},
 beldik:{name:'Белдік',slot:'waist',description:'Белді буатын бұйым. Киімді жинақы ұстап, сәндік қызмет те атқарады.'},
 masi:{name:'Мәсі',slot:'feet',description:'Жұмсақ былғарыдан тігілетін, өкшесі жоқ аяқкиім. Сыртынан кебіс киюге болады.'},
 ishik:{name:'Ішік',slot:'body',description:'Теріден тігіліп, сырты матамен қапталатын жылы сырт киім.'}
};
export const SLOTS={head:'Бас',body:'Дене',legs:'Аяқ',waist:'Бел',feet:'Табан'};
const definitions=[
 ['Алғашқы қадам','male',['shalbar','shapan','taqiya'],'Киімді төменнен бастап құрастыр. Шапан мен тақияны таны.'],
 ['Камзолдың көркі','female',['koylek','kamzol','taqiya'],'Көйлектің сыртынан камзол киіледі.'],
 ['Жылы киінейік','male',['shalbar','ishik','borik'],'Ішік пен бөрік суық күнге арналған.'],
 ['Мерекелік сән','female',['koylek','kamzol','beldik','taqiya'],'Белдік киімнің сәнін келтіреді.'],
 ['Жігіттің киімі','male',['shalbar','masi','shapan','beldik'],'Мәсі — жұмсақ былғары аяқкиім.'],
 ['Қалыңдықтың киімі','female',['koylek','kamzol','saukele'],'Сәукеле — қалыңдықтың ерекше баскиімі.'],
 ['Қысқы жиынтық','male',['shalbar','masi','ishik','borik'],'Қысқы баскиімнің тері жиегіне назар аудар.'],
 ['Ұлттық нақыш','female',['koylek','masi','kamzol','taqiya'],'Камзолдағы оюлар мен алтын түсті жиектерді байқа.'],
 ['Шапанның сәні','male',['shalbar','shapan','beldik','borik'],'Шапанды белдікпен буып, бөрікпен толықтыр.'],
 ['Салтанатты сәт','female',['koylek','masi','kamzol','saukele'],'Сәукелені тек қалыңдықтың жиынтығына қос.'],
 ['Шебердің таңдауы','male',['shalbar','masi','shapan','beldik','taqiya'],'Бес бұйымнан толық жиынтық жаса.'],
 ['Қыздың мерекелік киімі','female',['koylek','masi','kamzol','beldik','taqiya'],'Әр бұйымды өз орнына орналастыр.'],
 ['Аязға дайындық','male',['shalbar','masi','ishik','beldik','borik'],'Жылы сырт киім мен баскиімді шатастырма.'],
 ['Оюлы жиынтық','female',['koylek','masi','kamzol','beldik','saukele'],'Көйлек, камзол, белдік және сәукеленің үйлесімін байқа.'],
 ['Жас шебер','male',['shalbar','masi','shapan','beldik','borik'],'Ұлттық киімдердің атауын және қызметін есіңе түсір.']
];
let cursor=0;
export const LEVELS=definitions.map(([title,gender,items,fact],i)=>{const start=cursor;cursor+=items.length;return {id:i+1,title,gender,items,fact,start,end:cursor};});
export const TOTAL_STEPS=cursor;
export const STEPS=LEVELS.flatMap(l=>l.items.map((item,i)=>({item,slot:ITEMS[item].slot,level:l.id,end:i===l.items.length-1})));
export function currentLevel(step){return LEVELS.find(l=>step<l.end)||LEVELS.at(-1);}
export const LAYER_ORDER=['shalbar','masi','koylek','shapan','ishik','kamzol','beldik','taqiya','borik','saukele'];
