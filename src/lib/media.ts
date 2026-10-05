// Server-only integrations. Never expose access tokens through client components.
import {projects,videos,type ProjectItem,type VideoItem} from './content';
import {parseDesignFeed,parseVimeoVideo} from './media-validation';
const refreshSeconds=3600;
export async function getDesigns():Promise<ProjectItem[]>{
 const feed=process.env.BEHANCE_FEED_URL;
 if(!feed)return projects;
 try{
  const url=new URL(feed);if(url.protocol!=='https:'||url.username||url.password)throw new Error('Invalid feed URL');
  const response=await fetch(url,{next:{revalidate:refreshSeconds},signal:AbortSignal.timeout(6000)});
  if(!response.ok)throw new Error('Unavailable feed');
  const designs=parseDesignFeed(await response.json());if(!designs.length)throw new Error('No valid designs');
  return designs;
 }catch{console.warn('Creative Shot: design feed unavailable; using bundled work.');return projects;}
}
export async function getVideos():Promise<VideoItem[]>{
 const token=process.env.VIMEO_ACCESS_TOKEN;
 if(!token)return videos;
 try{
  const list:VideoItem[]=[];const ids=new Set<string>();let page=1;
  // Pagination remains on a fixed Vimeo endpoint, never a URL returned by remote content.
  while(page<=20){
   const response=await fetch(`https://api.vimeo.com/users/217490771/videos?per_page=100&page=${page}&sort=date&direction=desc&fields=uri,name,duration,privacy,paging`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.vimeo.*+json;version=3.4'},next:{revalidate:refreshSeconds},signal:AbortSignal.timeout(6000)});
   if(!response.ok)throw new Error('Vimeo unavailable');
   const body=await response.json() as {data?:unknown[];paging?:{next?:string|null}};
   if(!Array.isArray(body.data))throw new Error('Invalid Vimeo response');
   for(const raw of body.data){const item=parseVimeoVideo(raw,videos);if(item&&!ids.has(item.id)){list.push(item);ids.add(item.id);}}
   if(!body.paging?.next)return list;
   page++;
  }
  throw new Error('Pagination limit exceeded');
 }catch{console.warn('Creative Shot: Vimeo refresh unavailable; using bundled videos.');return videos;}
}
