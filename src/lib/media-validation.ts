import type {ProjectItem,VideoItem} from './content.ts';
export function parseDesignFeed(input:unknown):ProjectItem[]{
 if(!Array.isArray(input)||input.length>2000)throw new Error('Invalid design feed');
 const seen=new Set<string>();
 return input.filter((item):item is Record<string,unknown>=>Boolean(item)&&typeof item==='object').flatMap(item=>{
  if(item.kind!=='static'||typeof item.url!=='string'||typeof item.image!=='string'||typeof item.category!=='string')return [];
  const title=item.title as Record<string,unknown>|undefined;
  if(!title||typeof title.en!=='string'||typeof title.ar!=='string'||!title.en.trim()||!title.ar.trim())return [];
  try{const url=new URL(item.url),image=new URL(item.image);if(url.protocol!=='https:'||url.hostname!=='www.behance.net'||!/^\/gallery\/\d+\//.test(url.pathname)||image.protocol!=='https:'||image.hostname!=='mir-s3-cdn-cf.behance.net'||item.category==='video-editing'||seen.has(url.pathname))return [];seen.add(url.pathname);return [{url:url.href,image:image.href,category:item.category,title:{en:title.en.slice(0,200),ar:title.ar.slice(0,200)}}];}catch{return [];}
 });
}
export function parseVimeoVideo(input:unknown,translations:VideoItem[]):VideoItem|null{
 if(!input||typeof input!=='object')return null;
 const value=input as {uri?:unknown;name?:unknown;duration?:unknown;privacy?:{view?:unknown;embed?:unknown}};
 if(typeof value.uri!=='string'||!/^\/videos\/\d+$/.test(value.uri)||typeof value.name!=='string'||!value.name.trim()||value.privacy?.view!=='anybody')return null;
 const id=value.uri.split('/')[2];const previous=translations.find(v=>v.id===id);
 const seconds=typeof value.duration==='number'&&Number.isFinite(value.duration)?Math.max(0,Math.floor(value.duration)):0;
 return {id,title:previous?.title||{en:value.name.slice(0,200),ar:value.name.slice(0,200)},duration:`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`};
}
