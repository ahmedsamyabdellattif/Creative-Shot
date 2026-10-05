import {createHash} from 'node:crypto';
import {services} from '@/lib/content';
import {RateLimiter,validateInquiry} from '@/lib/contact-validation';
export const runtime='nodejs';
const limiter=new RateLimiter();
const result=(error:string,status:number)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 const expectedOrigin=process.env.SITE_URL||new URL(request.url).origin;
 if(request.headers.get('origin')!==new URL(expectedOrigin).origin)return result('Invalid origin',403);
 if(!request.headers.get('content-type')?.includes('application/json'))return result('Expected JSON',415);
 if(Number(request.headers.get('content-length')||0)>20000)return result('Request too large',413);
 // The reverse proxy must replace, not append untrusted forwarding headers.
 const ip=request.headers.get('x-real-ip')||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const key=createHash('sha256').update(ip).digest('hex');
 if(!limiter.allow(key))return new Response(JSON.stringify({error:'Too many requests'}),{status:429,headers:{'Content-Type':'application/json','Retry-After':'900','Cache-Control':'no-store'}});
 let input:unknown;
 try{
  const reader=request.body?.getReader();if(!reader)return result('Missing body',400);
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>20000){await reader.cancel();return result('Request too large',413);}chunks.push(value);}
  input=JSON.parse(Buffer.concat(chunks).toString('utf8'));
 }catch{return result('Invalid JSON',400);}
 const inquiry=validateInquiry(input,services.map(s=>s.slug));if(!inquiry)return result('Invalid inquiry',400);
 const apiKey=process.env.RESEND_API_KEY;const from=process.env.CONTACT_FROM;
 if(!apiKey||!from)return result('Email service not configured',503);
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[process.env.CONTACT_TO||'ahmed.samy.abdellattif@gmail.com'],reply_to:inquiry.email,subject:`Portfolio inquiry: ${inquiry.service}`,text:`Name: ${inquiry.name}\nEmail: ${inquiry.email}\nService: ${inquiry.service}\nLanguage: ${inquiry.locale}\n\n${inquiry.message}`}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return result('Email delivery failed',502);
  const delivery=await response.json();if(!delivery.id)return result('Email delivery failed',502);
  return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return result('Email delivery unavailable',502);}
}
