export type Inquiry = {name:string;email:string;service:string;message:string;locale:'en'|'ar'};
export function validateInquiry(input:unknown,services:readonly string[]):Inquiry|null {
 if(!input||typeof input!=='object'||Array.isArray(input))return null;
 const v=input as Record<string,unknown>;
 if(v.website!==undefined&&v.website!=='')return null;
 const clean=(key:string)=>typeof v[key]==='string'?(v[key] as string).trim():'';
 const name=clean('name'),email=clean('email'),service=clean('service'),message=clean('message');
 if(name.length<2||name.length>100||/[\r\n]/.test(name))return null;
 if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return null;
 if(!services.includes(service)||message.length<10||message.length>4000)return null;
 if(v.locale!=='en'&&v.locale!=='ar')return null;
 return {name,email,service,message,locale:v.locale};
}
export class RateLimiter {
 private requests = new Map<string,{count:number;expires:number}>();
 private limit:number; private windowMs:number; private capacity:number;
 constructor(limit=4,windowMs=15*60*1000,capacity=10000){this.limit=limit;this.windowMs=windowMs;this.capacity=capacity;}
 allow(key:string,now=Date.now()):boolean {
  for(const [id,bucket] of this.requests)if(bucket.expires<=now)this.requests.delete(id);
  const previous=this.requests.get(key);
  if(previous){if(previous.count>=this.limit)return false;previous.count++;return true;}
  if(this.requests.size>=this.capacity)return false;
  this.requests.set(key,{count:1,expires:now+this.windowMs});return true;
 }
}
