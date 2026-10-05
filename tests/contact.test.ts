import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateInquiry,RateLimiter} from '../src/lib/contact-validation.ts';
const services=['branding','frontend'];
const valid={name:'Ahmed',email:'client@example.com',service:'branding',message:'A new bilingual brand identity.',locale:'ar',website:''};
test('accepts and normalizes a valid bilingual inquiry',()=>{assert.equal(validateInquiry({...valid,name:'  أحمد  '},services)?.name,'أحمد');});
test('rejects malformed input, spoofed service, and spam trap',()=>{for(const value of [null,[],{}, {...valid,email:'bad'}, {...valid,service:'fake'}, {...valid,website:'spam'}, {...valid,locale:'xx'}, {...valid,name:'a\nb'}, {...valid,message:'short'}, {...valid,message:'x'.repeat(4001)}])assert.equal(validateInquiry(value,services),null);});
test('rate limiter rejects excess requests, resets expiry, and bounds memory',()=>{const limiter=new RateLimiter(2,100,1);assert.equal(limiter.allow('a',0),true);assert.equal(limiter.allow('a',1),true);assert.equal(limiter.allow('a',2),false);assert.equal(limiter.allow('b',3),false);assert.equal(limiter.allow('b',101),true);});
