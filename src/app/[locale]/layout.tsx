import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/700.css';
import '../globals.css';
import {isLocale} from '@/lib/content';
import {Header} from '@/components/interactive';
import {Footer} from '@/components/site';
export const metadata:Metadata={icons:{icon:'/icon.svg',apple:'/icon.svg'}};
export function generateStaticParams(){return [{locale:'en'},{locale:'ar'}]}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}><body><a className="skip-link" href="#main">{locale==='ar'?'انتقل إلى المحتوى':'Skip to content'}</a><Header locale={locale}/><main id="main">{children}</main><Footer locale={locale}/></body></html>}
