import {ITEMS} from './levels.js';
import {configured} from './firebase.js';
import {$} from './ui.js';
if($('catalog'))for(const [id,item]of Object.entries(ITEMS)){const card=document.createElement('article');card.className='garment-card';const img=document.createElement('img');img.src=`assets/thumb-${id}.svg`;img.alt=item.name;img.loading='lazy';const title=document.createElement('h3');title.textContent=item.name;const description=document.createElement('p');description.textContent=item.description;card.append(img,title,description);$('catalog').append(card);}
if(!configured()&&$('setup-note'))$('setup-note').hidden=false;
