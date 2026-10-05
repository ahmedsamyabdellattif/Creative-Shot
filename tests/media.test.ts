import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseDesignFeed,parseVimeoVideo} from '../src/lib/media-validation.ts';
import {projects,videos} from '../src/lib/content.ts';
test('design collection excludes motion and mixed video projects',()=>{assert.equal(projects.length,10);assert.ok(projects.every(p=>p.category!=='video-editing'&&!p.url.includes('/184456905/')));});
test('design feed requires explicit static classification and safe original links',()=>{const item={...projects[0],kind:'static'};assert.equal(parseDesignFeed([item,item,{...item,kind:'video'},{...item,url:'javascript:alert(1)'},{...item,image:'http://example.com/a.jpg'}]).length,1);assert.throws(()=>parseDesignFeed({}));});
test('video imports exclude private entries and retain existing translations',()=>{const sample={uri:'/videos/'+videos[0].id,name:'Updated title',duration:65,privacy:{view:'anybody'}};assert.deepEqual(parseVimeoVideo(sample,videos)?.title,videos[0].title);assert.equal(parseVimeoVideo(sample,videos)?.duration,'01:05');assert.equal(parseVimeoVideo({...sample,privacy:{view:'password'}},videos),null);assert.equal(parseVimeoVideo({...sample,uri:'/users/1'},videos),null);});
