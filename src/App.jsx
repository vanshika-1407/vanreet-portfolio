import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Noto+Serif+Devanagari:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;overflow-x:hidden;cursor:none}
@media(pointer:coarse){body{cursor:auto!important}}

:root{
  --cr:#FDF8F2; --bg:#EFE4D4; --pk:#FAE8EC; --ac:#C8845A; --acl:rgba(200,132,90,.12);
  --dk:#1E1510; --dk2:#2A1F18; --mu:#8B7B6B; --bd:rgba(200,132,90,.18);
  --wh:#FFFFFF; --gl:rgba(253,248,242,.8); --glb:rgba(255,255,255,.55);
  --shadow:rgba(200,132,90,.15);
}
.dm{
  --cr:#0A0806; --bg:#120E09; --pk:#160C0F; --dk:#EEE4D4; --dk2:#DDD0C0;
  --mu:#9A8A7A; --bd:rgba(230,210,185,.1); --wh:#181209; --gl:rgba(10,8,6,.85);
  --glb:rgba(230,210,185,.08); --acl:rgba(200,132,90,.07); --shadow:rgba(200,132,90,.2);
}

/* ── CURSOR ── */
.c-dot{position:fixed;top:0;left:0;width:7px;height:7px;background:var(--ac);border-radius:50%;
  pointer-events:none;z-index:10000;will-change:transform;
  transition:width .2s,height .2s,opacity .2s,background .2s}
.c-ring{position:fixed;top:0;left:0;width:44px;height:44px;border:1.5px solid rgba(200,132,90,.4);
  border-radius:50%;pointer-events:none;z-index:9999;will-change:transform;
  transition:width .25s cubic-bezier(.16,1,.3,1),height .25s cubic-bezier(.16,1,.3,1),
    border-color .25s,background .25s,opacity .3s}
.c-ring.big{width:68px;height:68px;border-color:rgba(200,132,90,.65);background:rgba(200,132,90,.05)}
.c-ring.view{width:88px;height:88px;border-color:rgba(200,132,90,.8);background:rgba(200,132,90,.07)}
.c-label{position:fixed;font-size:.58rem;font-weight:600;color:white;letter-spacing:.1em;
  text-transform:uppercase;pointer-events:none;z-index:10001;opacity:0;
  transition:opacity .2s;white-space:nowrap;transform:translate(-50%,-50%)}
.c-label.show{opacity:1}
@media(pointer:coarse){.c-dot,.c-ring,.c-label{display:none!important}}

/* ── SCROLL PROGRESS ── */
.sp-bar{position:fixed;top:0;left:0;height:2px;z-index:10002;pointer-events:none;
  background:linear-gradient(90deg,#C8845A,#F0D498,#C8845A);background-size:200%;
  animation:spShimmer 3s linear infinite}
@keyframes spShimmer{0%{background-position:0%}100%{background-position:200%}}

/* ── NOISE OVERLAY ── */
.noise-ov{position:fixed;inset:0;pointer-events:none;z-index:9990;opacity:.028;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── LOADER ── */
.ldr{position:fixed;inset:0;background:var(--dk);z-index:9998;display:flex;
  flex-direction:column;align-items:center;justify-content:center;
  transition:opacity .9s ease,visibility .9s ease}
.ldr.out{opacity:0;visibility:hidden;pointer-events:none}
.l-hindi{font-family:'Yatra One',serif;font-size:clamp(2.8rem,8vw,5rem);
  background:linear-gradient(90deg,#C8845A,#F0D498,#E8A870,#C8845A);background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  animation:lIn .9s cubic-bezier(.16,1,.3,1) .3s both,lShimmer 3s linear 1.2s infinite}
.l-eng{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;
  color:rgba(240,225,200,.3);letter-spacing:.3em;text-transform:uppercase;
  animation:lIn .6s ease .95s both;margin-top:.5rem}
.l-bar{width:160px;height:1px;background:rgba(200,132,90,.15);margin-top:2.5rem;
  border-radius:99px;overflow:hidden}
.l-fill{height:100%;background:linear-gradient(90deg,#C8845A,#F0D498);
  animation:lFill 2.1s ease forwards}
@keyframes lIn{from{opacity:0;transform:translateY(22px) scale(.9);filter:blur(10px)}to{opacity:1;transform:none;filter:none}}
@keyframes lShimmer{0%{background-position:0% center}100%{background-position:300% center}}
@keyframes lFill{from{width:0}to{width:100%}}

/* ── NAVBAR ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:1.5rem 2.8rem;
  display:flex;align-items:center;justify-content:space-between;
  transition:all .45s cubic-bezier(.16,1,.3,1)}

/* ── SECTION SCROLL OFFSET ─────────────────────────────────────────────────
   scroll-margin-top compensates for the fixed navbar on ALL anchor targets.
   88px = max navbar height (normal ~98px but once page is scrolled it shrinks
   to ~78px; 88px sits comfortably between the two so headings never hide).
──────────────────────────────────────────────────────────────────────────── */
#home,#about,#services,#portfolio,#packages,#contact,#why{
  scroll-margin-top:88px;
}
.nav.scr{background:var(--gl);backdrop-filter:blur(24px) saturate(180%);
  -webkit-backdrop-filter:blur(24px) saturate(180%);padding:.9rem 2.8rem;
  border-bottom:1px solid var(--bd);box-shadow:0 2px 40px rgba(0,0,0,.05)}
.nav-logo{text-decoration:none;display:flex;flex-direction:column;gap:.15rem}
.nl-en{font-family:'Playfair Display',serif;font-size:1.42rem;font-weight:700;
  color:var(--dk);letter-spacing:-.02em;line-height:1}
.nl-en span{color:var(--ac)}
.nl-hi{font-family:'Yatra One',serif;font-size:.7rem;color:var(--ac);
  letter-spacing:.04em;opacity:.7;line-height:1}
.nav-links{display:flex;gap:2.5rem;list-style:none}
.nav-links a{text-decoration:none;font-size:.73rem;font-weight:500;color:var(--mu);
  letter-spacing:.14em;text-transform:uppercase;transition:color .3s;
  position:relative;cursor:none}
.nav-links a::after{content:'';position:absolute;bottom:-3px;left:0;width:0;
  height:1px;background:var(--ac);transition:width .3s}
.nav-links a:hover{color:var(--dk)}
.nav-links a:hover::after{width:100%}
.nav-r{display:flex;align-items:center;gap:.85rem}
.dm-btn{background:transparent;border:1px solid var(--bd);border-radius:50px;
  padding:.38rem .9rem;cursor:none;font-size:.74rem;color:var(--mu);
  transition:all .3s;font-family:'DM Sans',sans-serif}
.dm-btn:hover{background:var(--dk);color:var(--cr)}
.nav-cta{background:var(--dk);color:var(--cr);padding:.55rem 1.4rem;border-radius:50px;
  font-size:.76rem;font-weight:500;text-decoration:none;transition:all .3s;
  letter-spacing:.04em;cursor:none;overflow:hidden;position:relative;display:inline-block}
.nav-cta:hover{background:var(--ac);transform:translateY(-1px)}

/* ── BUTTONS ── */
@keyframes ripA{from{transform:scale(0);opacity:.45}to{transform:scale(2.6);opacity:0}}
.rpl-el{position:absolute;border-radius:50%;background:rgba(255,255,255,.3);
  animation:ripA .58s ease-out forwards;pointer-events:none}
.btn-p{background:var(--dk);color:var(--cr);padding:.9rem 2.2rem;border-radius:50px;
  font-size:.87rem;font-weight:500;text-decoration:none;
  border:2px solid var(--dk);cursor:none;display:inline-flex;align-items:center;gap:.5rem;
  font-family:'DM Sans',sans-serif;position:relative;overflow:hidden;
  transition:all .38s cubic-bezier(.16,1,.3,1)}
.btn-p:hover{background:var(--ac);border-color:var(--ac);transform:translateY(-3px);
  box-shadow:0 16px 44px rgba(200,132,90,.3)}
.btn-p .arr{display:inline-block;transition:transform .35s cubic-bezier(.16,1,.3,1)}
.btn-p:hover .arr{transform:translateX(6px)}
.btn-p::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent);
  transition:left .55s ease}
.btn-p:hover::after{left:100%}
.btn-s{background:transparent;color:var(--dk);padding:.9rem 2.2rem;border-radius:50px;
  font-size:.87rem;font-weight:500;text-decoration:none;
  border:1.5px solid var(--bd);cursor:none;display:inline-flex;align-items:center;gap:.5rem;
  font-family:'DM Sans',sans-serif;position:relative;overflow:hidden;
  transition:all .35s;backdrop-filter:blur(8px)}
.btn-s:hover{border-color:var(--dk);background:var(--dk);color:var(--cr);transform:translateY(-3px)}

/* ── HERO LAYOUT ── */
.hero{min-height:100vh;background:var(--cr);display:flex;align-items:center;
  padding:8rem 2.8rem 5rem;position:relative;overflow:hidden}
.hero-inner{max-width:1220px;margin:0 auto;display:grid;
  grid-template-columns:1.1fr .9fr;gap:4.5rem;align-items:center;
  width:100%;position:relative;z-index:1}

/* ── BLOBS ── */
.blob{position:absolute;border-radius:50%;filter:blur(88px);pointer-events:none;will-change:transform}
.b1{width:660px;height:660px;background:radial-gradient(circle,rgba(240,192,202,.27),transparent);top:-160px;right:-160px}
.b2{width:520px;height:520px;background:radial-gradient(circle,rgba(212,196,230,.22),transparent);bottom:-110px;left:-130px}
.b3{width:400px;height:400px;background:radial-gradient(circle,rgba(200,132,90,.1),transparent);top:36%;left:28%}
.b4{width:280px;height:280px;background:radial-gradient(circle,rgba(232,212,192,.16),transparent);bottom:12%;right:36%}

/* ── AMBIENT FOLLOW ── */
.amb{position:absolute;width:800px;height:800px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(200,132,90,.055),transparent 65%);
  transform:translate(-50%,-50%);z-index:0}

/* ── PARTICLES ── */
@keyframes pfloat{
  0%,100%{transform:translateY(0) scale(1);opacity:var(--o1,.3)}
  50%{transform:translateY(-28px) scale(1.08);opacity:var(--o2,.6)}
}
.part{position:absolute;border-radius:50%;pointer-events:none;
  animation:pfloat var(--dur,8s) ease-in-out infinite var(--del,0s)}

/* ── HINDI SIGNATURE ── */
.hi-sig{font-family:'Yatra One',serif;font-size:clamp(1.15rem,2.2vw,1.55rem);
  color:var(--ac);letter-spacing:.04em;display:block;margin-bottom:.9rem;
  opacity:0;animation:sigIn .9s cubic-bezier(.16,1,.3,1) .6s both;
  position:relative;filter:drop-shadow(0 2px 12px rgba(200,132,90,.25))}
.hi-sig::before{content:'—';font-family:'DM Sans',sans-serif;font-size:.8rem;
  color:var(--ac);opacity:.45;margin-right:.6rem;letter-spacing:.05em}
.hi-sig::after{content:'';display:block;width:40px;height:1px;
  background:linear-gradient(90deg,var(--ac),transparent);margin-top:.4rem}
@keyframes sigIn{
  from{opacity:0;transform:translateY(14px) scale(.95);filter:blur(6px)}
  to{opacity:.9;transform:none;filter:none}
}

/* ── HERO TITLE ── */
.h-eye{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--ac);
  font-weight:500;margin-bottom:1.1rem;opacity:0;animation:fuA .6s ease .3s both;
  display:flex;align-items:center;gap:.7rem}
.ey-line{width:46px;height:1px;background:linear-gradient(90deg,var(--ac),transparent);flex-shrink:0}
.h-name-block{margin-bottom:.45rem}
.h-line{display:flex;flex-wrap:wrap;overflow:hidden}
.h-ltr{display:inline-block;font-family:'Playfair Display',serif;
  font-size:clamp(3rem,6.2vw,6rem);font-weight:800;line-height:.98;
  letter-spacing:-.025em;color:var(--dk);opacity:0;will-change:transform;
  animation:ltrIn .7s cubic-bezier(.16,1,.3,1) var(--ld,.5s) both}
.h-ltr.acc{color:var(--ac);font-style:italic;font-weight:700}
@keyframes ltrIn{
  from{opacity:0;transform:translateY(58%) scale(.9);filter:blur(5px)}
  to{opacity:1;transform:none;filter:none}
}

/* ── DUO PILL ── */
.duo-pill{display:inline-flex;align-items:center;gap:.55rem;
  background:var(--pk);border:1px solid var(--bd);border-radius:50px;
  padding:.4rem 1rem;margin-top:.6rem;margin-bottom:1.5rem;
  opacity:0;animation:fuA .6s ease 1.55s both;width:fit-content}
.duo-av{width:28px;height:28px;border-radius:50%;border:2px solid white;
  display:flex;align-items:center;justify-content:center;font-size:.72rem;
  font-weight:700;font-family:'Playfair Display',serif;flex-shrink:0}
.duo-av:last-of-type{margin-left:-10px}
.duo-txt{font-size:.72rem;font-weight:500;color:var(--dk);letter-spacing:.04em}

.h-sub{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--mu);
  margin-bottom:1.8rem;opacity:0;animation:fuA .6s ease 1.75s both}
.h-desc{font-family:'Cormorant Garamond',serif;font-size:clamp(1.05rem,1.7vw,1.2rem);
  color:var(--mu);line-height:1.84;max-width:490px;margin-bottom:2.5rem;
  font-style:italic;opacity:0;animation:fuA .6s ease 1.92s both}
.h-btns{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2.5rem;
  opacity:0;animation:fuA .6s ease 2.1s both}
.soc-row{display:flex;gap:.7rem;opacity:0;animation:fuA .6s ease 2.28s both;margin-bottom:2rem}
.soc-i{width:42px;height:42px;border-radius:50%;border:1px solid var(--bd);
  display:flex;align-items:center;justify-content:center;color:var(--mu);
  text-decoration:none;transition:all .3s;background:rgba(253,248,242,.65);
  backdrop-filter:blur(8px);font-size:.9rem;cursor:none}
.soc-i:hover{background:var(--dk);color:var(--cr);border-color:var(--dk);transform:translateY(-3px)}
@keyframes fuA{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}

/* ── HERO STAT CARDS ── */
.h-stats{display:flex;gap:.75rem;flex-wrap:wrap;opacity:0;animation:fuA .6s ease 2.44s both}
.h-stat{background:var(--gl);backdrop-filter:blur(18px) saturate(160%);
  -webkit-backdrop-filter:blur(18px);border:1px solid var(--glb);border-radius:14px;
  padding:.7rem 1.1rem;display:flex;align-items:center;gap:.8rem;
  box-shadow:0 4px 24px rgba(0,0,0,.06);transition:transform .3s,box-shadow .3s}
.h-stat:hover{transform:translateY(-3px);box-shadow:0 12px 32px var(--shadow)}
.h-st-ic{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;
  justify-content:center;flex-shrink:0;font-size:.95rem}
.h-st-val{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;
  color:var(--dk);line-height:1}
.h-st-lbl{font-size:.66rem;color:var(--mu);margin-top:.18rem;white-space:nowrap}

/* ── SCROLL INDICATOR ── */
.scr-ind{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:.5rem;cursor:none;
  opacity:0;animation:fuA .6s ease 2.9s both}
.scr-ln{width:1px;height:42px;background:linear-gradient(180deg,var(--ac),transparent);
  animation:scrP 2.1s ease-in-out infinite}
.scr-tx{font-size:.59rem;letter-spacing:.22em;text-transform:uppercase;color:var(--mu)}
@keyframes scrP{0%,100%{opacity:.38;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.12)}}

/* ── CREATOR IMAGE FRAME ── */
.img-area{position:relative;display:flex;justify-content:center;align-items:center;
  opacity:0;animation:imgIn 1.1s cubic-bezier(.16,1,.3,1) .45s both}
@keyframes imgIn{from{opacity:0;transform:scale(.92) translateY(18px)}to{opacity:1;transform:none}}
.img-glow{position:absolute;width:380px;height:480px;border-radius:50%;pointer-events:none;
  background:radial-gradient(ellipse,rgba(200,132,90,.17),rgba(240,195,165,.1) 45%,transparent 72%);
  filter:blur(35px);top:50%;left:50%;transform:translate(-50%,-50%);
  animation:glowP 4.5s ease-in-out infinite}
@keyframes glowP{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)}
  50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}}
.img-frame{width:305px;height:400px;
  border-radius:42% 58% 55% 45%/48% 42% 58% 52%;overflow:hidden;position:relative;
  box-shadow:0 45px 90px rgba(200,132,90,.2),0 0 0 1px rgba(200,132,90,.12),
    inset 0 1px 0 rgba(255,255,255,.4);
  transition:border-radius .9s cubic-bezier(.16,1,.3,1)}
.img-frame:hover{border-radius:35% 65% 45% 55%/55% 38% 62% 45%}
.img-inner{width:100%;height:100%;position:relative;overflow:hidden}
.img-bg{position:absolute;inset:0;background:linear-gradient(155deg,
  #F8EAD8 0%,#EDD4B0 30%,#DEC090 58%,#C8A878 78%,#B89060 100%)}
.img-grid{position:absolute;inset:0;display:grid;
  grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr;gap:3px}
.ig{border-radius:3px;transition:opacity .5s}
.img-frame:hover .ig{opacity:.7}
.ig1{background:linear-gradient(140deg,#F2C8B0,#E0A888)}
.ig2{background:linear-gradient(140deg,#EBD8C8,#D4B898)}
.ig3{background:linear-gradient(140deg,#DDD4F2,#C4B4E0)}
.ig4{background:linear-gradient(140deg,#CDE4F0,#AEC8DC)}
.ig5{background:linear-gradient(140deg,#F2E2C8,#E0C89E)}
.ig6{background:linear-gradient(140deg,#E2F0D8,#C8DCA8)}
.img-overlay{position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 28%,rgba(200,132,90,.22) 100%)}
.img-badge{position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);
  background:rgba(255,252,248,.92);backdrop-filter:blur(14px);
  border:1px solid rgba(255,255,255,.65);border-radius:28px;
  padding:.48rem 1.2rem;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.ib-hi{font-family:'Yatra One',serif;font-size:.72rem;color:var(--ac);
  display:block;text-align:center}
.ib-en{font-size:.62rem;color:var(--mu);display:block;text-align:center;
  letter-spacing:.1em;text-transform:uppercase;margin-top:.12rem}

/* ── FLOATING TAGS ── */
.ftag{position:absolute;background:var(--gl);backdrop-filter:blur(18px) saturate(155%);
  -webkit-backdrop-filter:blur(18px);border:1px solid var(--glb);border-radius:50px;
  padding:.42rem .95rem;display:flex;align-items:center;gap:.42rem;
  font-size:.71rem;font-weight:500;color:var(--dk);
  box-shadow:0 6px 24px rgba(0,0,0,.07);cursor:none;white-space:nowrap;
  transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s}
.ftag:hover{transform:translateY(-5px) scale(1.05)!important;box-shadow:0 14px 36px var(--shadow)}
.ft1{top:-28px;left:-22px;opacity:0;animation:ft1 6s ease-in-out infinite,tagIn .6s ease 1.5s both}
.ft2{top:15%;right:-62px;opacity:0;animation:ft2 7.5s ease-in-out infinite .8s,tagIn .6s ease 1.65s both}
.ft3{top:44%;right:-68px;opacity:0;animation:ft1 8s ease-in-out infinite 1.6s,tagIn .6s ease 1.8s both}
.ft4{bottom:18%;right:-58px;opacity:0;animation:ft2 7s ease-in-out infinite .4s,tagIn .6s ease 1.95s both}
.ft5{bottom:-22px;left:5%;opacity:0;animation:ft1 6.5s ease-in-out infinite 1.2s,tagIn .6s ease 2.1s both}
.ft6{top:30%;left:-78px;opacity:0;animation:ft2 8.5s ease-in-out infinite 2s,tagIn .6s ease 2.25s both}
@keyframes ft1{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
@keyframes ft2{0%,100%{transform:translateY(0)}50%{transform:translateY(11px)}}
@keyframes tagIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}

/* ── MARQUEE ── */
.mq-wrap{overflow:hidden;background:var(--dk);padding:1.2rem 0;position:relative}
.mq-wrap::before,.mq-wrap::after{content:'';position:absolute;top:0;bottom:0;
  width:120px;z-index:1;pointer-events:none}
.mq-wrap::before{left:0;background:linear-gradient(90deg,var(--dk),transparent)}
.mq-wrap::after{right:0;background:linear-gradient(-90deg,var(--dk),transparent)}
.mq-track{display:flex;white-space:nowrap;animation:mqScroll 28s linear infinite}
.mq-track:hover{animation-play-state:paused}
.mq-item{padding:0 2.2rem;display:flex;align-items:center;gap:.9rem;
  font-size:.71rem;font-weight:500;color:rgba(240,228,212,.35);
  letter-spacing:.14em;text-transform:uppercase}
.mq-hi{font-family:'Yatra One',serif;font-size:.92rem;
  color:rgba(200,132,90,.52);letter-spacing:.04em;text-transform:none}
.mq-dot{width:3px;height:3px;border-radius:50%;background:var(--ac);flex-shrink:0}
@keyframes mqScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ── REVEAL ── */
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}
.rv.on{opacity:1;transform:none}

/* ── SECTION BASE ── */
section{padding:6.5rem 2.8rem}
.con{max-width:1100px;margin:0 auto}
.s-label{font-size:.67rem;letter-spacing:.26em;text-transform:uppercase;
  color:var(--ac);font-weight:500;margin-bottom:.65rem}
.s-title{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,4vw,3rem);
  font-weight:700;color:var(--dk);line-height:1.15;margin-bottom:1.2rem}
.s-desc{font-size:.97rem;color:var(--mu);line-height:1.78;max-width:510px}

/* ── ABOUT ── */
.ab-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:5rem;align-items:start;margin-top:.5rem}
.ab-img{width:100%;aspect-ratio:3/4;border-radius:40px;overflow:hidden;position:relative;
  background:linear-gradient(150deg,#F5D8C4,#E8C8A8,#D4B088)}
.ab-ov{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(30,21,16,.5))}
.ab-tag{position:absolute;bottom:2rem;left:2rem;right:2rem;
  background:rgba(255,252,248,.9);backdrop-filter:blur(12px);border-radius:16px;padding:1rem 1.2rem}
.ab-tn{font-family:'Playfair Display',serif;font-size:1.08rem;font-weight:700;color:#1E1510}
.ab-ts{font-size:.72rem;color:var(--mu);margin-top:.18rem}
.ab-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1.25rem}
.st-c{background:var(--wh);border-radius:20px;padding:1.2rem;border:1px solid var(--bd);
  transition:transform .3s,box-shadow .3s;cursor:none}
.st-c:hover{transform:translateY(-4px);box-shadow:0 12px 32px var(--shadow)}
.st-n{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--ac);line-height:1}
.st-l{font-size:.7rem;color:var(--mu);margin-top:.3rem;line-height:1.4}
.traits{display:flex;flex-direction:column;margin-top:2.5rem}
.trait{display:flex;align-items:flex-start;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--bd)}
.tr-ic{width:36px;height:36px;background:var(--pk);border-radius:10px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.1rem}
.tr-n{font-size:.9rem;font-weight:600;color:var(--dk);margin-bottom:.2rem}
.tr-d{font-size:.8rem;color:var(--mu);line-height:1.55}

/* ── DUO MEET CARDS ── */
.duo-cards{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:2rem}
.duo-card{background:var(--pk);border-radius:20px;padding:1.25rem;
  border:1px solid var(--bd);transition:transform .3s,box-shadow .3s}
.duo-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px var(--shadow)}
.dc-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;
  color:var(--dk);margin-bottom:.2rem}
.dc-hi{font-family:'Yatra One',serif;font-size:.78rem;color:var(--ac);margin-bottom:.45rem}
.dc-role{font-size:.76rem;color:var(--mu);line-height:1.5}

/* ── SERVICES ── */
.sv-head{display:flex;align-items:flex-end;justify-content:space-between;
  margin-bottom:3rem;gap:2rem;flex-wrap:wrap}
.sv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:1.25rem}
.sv-card{background:var(--wh);border-radius:24px;padding:1.75rem;border:1px solid var(--bd);
  transition:all .4s cubic-bezier(.34,1.5,.64,1);position:relative;overflow:hidden;cursor:none}
.sv-card::after{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,var(--pk),transparent);opacity:0;transition:opacity .3s}
.sv-card:hover{transform:translateY(-8px);
  box-shadow:0 24px 60px rgba(200,132,90,.12);border-color:rgba(200,132,90,.35)}
.sv-card:hover::after{opacity:1}
.sv-ic{width:50px;height:50px;border-radius:15px;background:var(--pk);
  display:flex;align-items:center;justify-content:center;font-size:1.4rem;
  margin-bottom:1.2rem;transition:transform .3s;position:relative;z-index:1}
.sv-card:hover .sv-ic{transform:scale(1.1) rotate(-6deg)}
.sv-n{font-size:.92rem;font-weight:600;color:var(--dk);margin-bottom:.5rem;position:relative;z-index:1}
.sv-d{font-size:.8rem;color:var(--mu);line-height:1.6;position:relative;z-index:1}

/* ── PORTFOLIO ── */
.pf-head{display:flex;align-items:flex-end;justify-content:space-between;
  margin-bottom:2rem;flex-wrap:wrap;gap:1.5rem}
.pf-tabs{display:flex;gap:.4rem;background:var(--wh);padding:5px;
  border-radius:50px;border:1px solid var(--bd)}
.pf-tab{padding:.44rem 1.1rem;border-radius:50px;font-size:.74rem;font-weight:500;
  cursor:none;transition:all .3s;background:transparent;border:none;color:var(--mu);
  font-family:'DM Sans',sans-serif}
.pf-tab.on{background:var(--dk);color:var(--cr)}
.pf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.pf-item{border-radius:24px;overflow:hidden;cursor:none;position:relative}
.pf-th{aspect-ratio:9/16;border-radius:24px;overflow:hidden;position:relative;transition:transform .4s}
.pf-item:hover .pf-th{transform:scale(.97)}
.ph-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:1.2rem}
.ph-sc{width:82%;aspect-ratio:9/16;border-radius:16px;overflow:hidden;
  border:2.5px solid rgba(0,0,0,.07);box-shadow:0 8px 24px rgba(0,0,0,.08);
  display:flex;flex-direction:column;gap:4px;padding:8px}
.pf-ov{position:absolute;inset:0;background:linear-gradient(180deg,transparent 34%,rgba(28,18,10,.93));
  opacity:0;transition:opacity .35s;border-radius:24px;display:flex;align-items:flex-end;padding:1.5rem}
.pf-item:hover .pf-ov{opacity:1}
.pf-bdg{display:inline-block;background:rgba(200,132,90,.28);
  border:1px solid rgba(200,132,90,.5);border-radius:50px;padding:.2rem .7rem;
  font-size:.61rem;letter-spacing:.12em;text-transform:uppercase;
  margin-bottom:.4rem;color:rgba(255,248,242,.9)}
.pf-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;
  line-height:1.2;color:var(--cr)}
.pf-brand{font-size:.72rem;color:rgba(240,228,212,.5);margin-top:.22rem}

/* ── WHY ME ── */
.why-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:1.25rem;margin-top:3rem}
.why-c{border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:1.75rem;
  transition:all .3s;background:rgba(255,255,255,.03);cursor:none}
.why-c:hover{background:rgba(255,255,255,.07);border-color:rgba(200,132,90,.3);transform:translateY(-4px)}
.why-ic{width:46px;height:46px;border-radius:14px;background:rgba(200,132,90,.14);
  display:flex;align-items:center;justify-content:center;margin-bottom:1.2rem;font-size:1.3rem}
.why-t{font-size:.92rem;font-weight:600;color:rgba(240,228,212,.9);margin-bottom:.5rem}
.why-d{font-size:.8rem;color:rgba(255,255,255,.38);line-height:1.6}

/* ── TESTIMONIALS ── */
.ts-track{display:flex;gap:1.25rem;overflow-x:auto;padding-bottom:1.5rem;
  scrollbar-width:none;scroll-snap-type:x mandatory;margin-top:2.5rem;cursor:grab}
.ts-track:active{cursor:grabbing}
.ts-track::-webkit-scrollbar{display:none}
.ts-c{background:var(--wh);border-radius:24px;padding:2rem;min-width:292px;
  flex-shrink:0;scroll-snap-align:start;border:1px solid rgba(200,132,90,.12);
  transition:transform .3s,box-shadow .3s}
.ts-c:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.07)}
.ts-stars{color:#F5A623;font-size:.9rem;letter-spacing:.1em;margin-bottom:1rem}
.ts-txt{font-family:'Cormorant Garamond',serif;font-size:1.08rem;color:var(--mu);
  line-height:1.7;margin-bottom:1.5rem;font-style:italic}
.ts-auth{display:flex;align-items:center;gap:.75rem}
.ts-av{width:42px;height:42px;border-radius:50%;background:var(--bg);
  display:flex;align-items:center;justify-content:center;
  font-family:'Playfair Display',serif;font-size:.88rem;font-weight:700;
  color:var(--ac);flex-shrink:0}
.ts-an{font-size:.87rem;font-weight:600;color:var(--dk)}
.ts-ar{font-size:.73rem;color:var(--mu)}

/* ── FAQ ── */
.faq-list{display:flex;flex-direction:column;gap:.75rem;margin-top:2.5rem}
.faq-item{background:var(--wh);border-radius:18px;border:1px solid var(--bd);
  overflow:hidden;transition:box-shadow .3s}
.faq-item.open{box-shadow:0 8px 32px var(--shadow)}
.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;
  padding:1.2rem 1.5rem;background:none;border:none;cursor:none;
  font-size:.93rem;font-weight:600;color:var(--dk);font-family:'DM Sans',sans-serif;
  text-align:left;gap:1rem}
.faq-ic{width:26px;height:26px;border-radius:50%;background:var(--pk);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.82rem;
  transition:transform .35s,background .3s}
.faq-item.open .faq-ic{transform:rotate(45deg);background:var(--ac);color:white}
.faq-ans{max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.16,1,.3,1)}
.faq-ans.vis{max-height:250px}
.faq-a-in{padding:0 1.5rem 1.25rem;font-size:.87rem;color:var(--mu);line-height:1.72}

/* ── PACKAGES ── */
.pkg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));
  gap:1.25rem;margin-top:3rem}
.pkg-c{background:var(--wh);border-radius:28px;padding:2rem;
  border:1.5px solid var(--bd);position:relative;transition:all .4s}
.pkg-c:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,.08)}
.pkg-c.ft{background:var(--dk);border-color:var(--dk)}
.pkg-b{position:absolute;top:-13px;left:50%;transform:translateX(-50%);
  background:var(--ac);color:white;border-radius:50px;padding:.3rem 1.1rem;
  font-size:.64rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
.pkg-n{font-size:.67rem;font-weight:600;color:var(--mu);text-transform:uppercase;
  letter-spacing:.16em;margin-bottom:1rem}
.ft .pkg-n{color:rgba(255,255,255,.38)}
.pkg-p{font-family:'Playfair Display',serif;font-size:2.25rem;font-weight:700;
  color:var(--dk);line-height:1;margin-bottom:.2rem}
.ft .pkg-p{color:var(--cr)}
.pkg-per{font-size:.73rem;color:var(--mu);margin-bottom:1.75rem}
.ft .pkg-per{color:rgba(255,255,255,.34)}
.pkg-fl{list-style:none;margin-bottom:2rem}
.pkg-fl li{display:flex;align-items:flex-start;gap:.6rem;font-size:.79rem;
  color:var(--mu);padding:.42rem 0;border-bottom:1px solid var(--bd);line-height:1.5}
.ft .pkg-fl li{color:rgba(255,255,255,.54);border-bottom-color:rgba(255,255,255,.06)}
.ck{color:var(--ac);font-size:.84rem;flex-shrink:0;margin-top:2px}
.ft .ck{color:#D4C4E8}

/* ── SOCIAL ── */
.sc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin-top:3rem}
.sc-card{background:var(--wh);border-radius:24px;border:1px solid var(--bd);
  overflow:hidden;transition:transform .3s,box-shadow .3s}
.sc-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.07)}
.sc-h{padding:1.2rem 1.5rem;display:flex;align-items:center;gap:.85rem;
  border-bottom:1px solid var(--bd)}
.sc-ic{width:40px;height:40px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
.sc-n{font-weight:600;font-size:.88rem;color:var(--dk)}
.sc-hd{font-size:.72rem;color:var(--mu)}
.feed-g{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.feed-c{aspect-ratio:1;position:relative;overflow:hidden;cursor:none}
.feed-c:hover .f-ov{opacity:1}
.f-ov{position:absolute;inset:0;background:rgba(200,132,90,.52);opacity:0;
  transition:opacity .3s;display:flex;align-items:center;justify-content:center;
  color:white;font-size:.7rem;font-weight:600}
.sc-st{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--bd)}
.sc-sv{background:var(--wh);padding:.7rem 1rem;text-align:center}
.sc-sn{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--ac)}
.sc-sl{font-size:.64rem;color:var(--mu);text-transform:uppercase;letter-spacing:.1em;margin-top:.15rem}

/* ── CONTACT ── */
.ct-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:5rem;margin-top:3rem;align-items:start}
.ct-form{display:flex;flex-direction:column;gap:1.25rem}
.ct-2{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
.ct-fg{display:flex;flex-direction:column;gap:.45rem}
.ct-lb{font-size:.67rem;font-weight:600;color:var(--dk);letter-spacing:.12em;text-transform:uppercase}
.ct-in{background:var(--wh);border:1.5px solid var(--bd);border-radius:14px;
  padding:.85rem 1.2rem;font-size:.9rem;font-family:'DM Sans',sans-serif;
  color:var(--dk);outline:none;transition:border-color .3s;width:100%;appearance:none}
.ct-in:focus{border-color:var(--ac)}
textarea.ct-in{resize:vertical;min-height:120px}
.ct-info{background:var(--dk);border-radius:32px;padding:2.5rem}
.ci-t{font-family:'Playfair Display',serif;font-size:1.55rem;font-weight:700;
  color:var(--cr);margin-bottom:.7rem;line-height:1.2}
.ci-s{font-size:.84rem;color:rgba(255,255,255,.4);line-height:1.75;margin-bottom:2rem}
.ci-row{display:flex;align-items:center;gap:1rem;padding:1rem 0;
  border-bottom:1px solid rgba(255,255,255,.07)}
.ci-ic{width:38px;height:38px;background:rgba(200,132,90,.16);border-radius:11px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.95rem}
.ci-lb{font-size:.65rem;color:rgba(255,255,255,.34);text-transform:uppercase;letter-spacing:.1em}
.ci-vl{font-size:.86rem;color:rgba(255,255,255,.74);margin-top:.15rem}

/* ── FOOTER ── */
.ft-root{background:var(--dk);padding:4.5rem 2.8rem 2rem}
.ft-inner{max-width:1100px;margin:0 auto}
.ft-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:3.5rem}
.ft-logo{font-family:'Playfair Display',serif;font-size:1.65rem;color:var(--cr);
  font-weight:700;margin-bottom:.35rem}
.ft-logo span{color:var(--ac)}
.ft-hi{font-family:'Yatra One',serif;font-size:.72rem;color:var(--ac);
  opacity:.6;margin-bottom:.75rem}
.ft-tag{font-size:.82rem;color:rgba(255,255,255,.32);line-height:1.7;
  max-width:255px;margin-bottom:1.5rem}
.ft-soc{display:flex;gap:.6rem}
.ft-si{width:37px;height:37px;border-radius:50%;border:1px solid rgba(255,255,255,.1);
  display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.35);
  text-decoration:none;transition:all .3s;font-size:.85rem;cursor:none}
.ft-si:hover{background:var(--ac);color:white;border-color:var(--ac)}
.ft-h{font-size:.67rem;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(255,255,255,.24);font-weight:600;margin-bottom:1.5rem}
.ft-l{list-style:none;display:flex;flex-direction:column;gap:.65rem}
.ft-l a{text-decoration:none;font-size:.84rem;color:rgba(255,255,255,.44);
  transition:color .3s;cursor:none}
.ft-l a:hover{color:var(--ac)}
.ft-bot{display:flex;align-items:center;justify-content:space-between;
  padding-top:2rem;border-top:1px solid rgba(255,255,255,.06);
  font-size:.74rem;color:rgba(255,255,255,.2);flex-wrap:wrap;gap:.5rem}

/* ── FLOAT CTA ── */
.fl-wrap{position:fixed;bottom:1.75rem;right:1.75rem;z-index:990}
.fl-btn{background:var(--ac);color:white;border:none;border-radius:50px;
  padding:.85rem 1.7rem;font-size:.82rem;font-weight:600;cursor:none;
  box-shadow:0 8px 32px rgba(200,132,90,.42);transition:all .35s;
  display:flex;align-items:center;gap:.5rem;font-family:'DM Sans',sans-serif;
  letter-spacing:.02em;overflow:hidden;position:relative}
.fl-btn:hover{transform:translateY(-3px);box-shadow:0 20px 48px rgba(200,132,90,.55)}
.fl-btn::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);transition:left .5s}
.fl-btn:hover::after{left:100%}

/* ── MOBILE ── */
@media(max-width:900px){
  .hero-inner,.ab-grid,.ct-grid,.sc-grid{grid-template-columns:1fr}
  .ft-grid{grid-template-columns:1fr 1fr}
  .pf-grid{grid-template-columns:repeat(2,1fr)}
  .nav-links{display:none}
  .hero-inner{gap:3rem}
  .img-area{order:-1}
  .ft6{display:none}
  .duo-cards{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
  section{padding:4.5rem 1.5rem}
  .hero{padding:7rem 1.5rem 4rem}
  .pf-grid{grid-template-columns:1fr}
  .ft-grid{grid-template-columns:1fr}
  .pkg-grid{grid-template-columns:1fr;max-width:295px;margin-inline:auto}
  .ab-stats{grid-template-columns:repeat(3,1fr)}
  .ft1,.ft2,.ft3,.ft4,.ft5,.ft6{display:none}
  .img-frame{width:255px;height:335px}
  .sc-grid{grid-template-columns:1fr}
  .duo-cards{grid-template-columns:1fr}
}
@media(max-width:420px){
  .sv-grid,.why-grid{grid-template-columns:1fr}
  .ab-stats{grid-template-columns:1fr 1fr}
  .ct-2{grid-template-columns:1fr}
  .h-ltr{font-size:clamp(2.5rem,9vw,3.2rem)}
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PARTICLES = [
  {x:"12%",y:"18%",s:"6px",c:"rgba(200,132,90,.35)",dur:"7s",del:"0s",o1:.3,o2:.6},
  {x:"88%",y:"28%",s:"5px",c:"rgba(212,196,230,.45)",dur:"9s",del:"1.2s",o1:.2,o2:.5},
  {x:"22%",y:"75%",s:"4px",c:"rgba(200,132,90,.25)",dur:"8s",del:"2.4s",o1:.25,o2:.55},
  {x:"78%",y:"65%",s:"7px",c:"rgba(240,195,165,.4)",dur:"10s",del:"0.6s",o1:.3,o2:.6},
  {x:"45%",y:"14%",s:"4px",c:"rgba(212,196,230,.3)",dur:"6.5s",del:"3s",o1:.2,o2:.5},
  {x:"66%",y:"82%",s:"5px",c:"rgba(200,132,90,.2)",dur:"11s",del:"1.8s",o1:.15,o2:.4},
  {x:"8%",y:"52%",s:"6px",c:"rgba(240,195,165,.35)",dur:"7.5s",del:"0.9s",o1:.28,o2:.58},
  {x:"92%",y:"48%",s:"4px",c:"rgba(212,196,230,.28)",dur:"8.5s",del:"2s",o1:.2,o2:.45},
];

const H_STATS = [
  {icon:"✨",val:"5K+",label:"Content Views",bg:"rgba(200,132,90,.1)"},
  {icon:"👯",val:"Duo",label:"Two Creators · One Vision",bg:"rgba(212,196,230,.2)"},
  {icon:"🎬",val:"3 Niches",label:"Beauty • Lifestyle • Tech",bg:"rgba(232,212,192,.2)"},
];

const CREATOR_TAGS = [
  {icon:"🎬",label:"UGC Videos"},
  {icon:"💄",label:"Beauty Reviews"},
  {icon:"📱",label:"Tech Demos"},
  {icon:"🌿",label:"Lifestyle Reels"},
  {icon:"📸",label:"Photography"},
  {icon:"✨",label:"Brand Stories"},
];

// TikTok removed from marquee, replaced with duo-themed items
const MQ_ITEMS = [
  {text:"Beauty Reviews"},{text:"Lifestyle Reels"},{text:"UGC Content"},
  {text:"वनरीत",hi:true},{text:"Product Photography"},
  {text:"Duo Creators"},{text:"Brand Storytelling"},{text:"Aesthetic Visuals"},
  {text:"Short-form Reels"},{text:"Unboxing"},{text:"Voiceovers"},
];

const SERVICES = [
  {icon:"🎬",n:"UGC Videos",d:"Authentic, brand-ready short-form videos that genuinely convert"},
  {icon:"⭐",n:"Product Reviews",d:"Trust-building reviews that drive real purchase decisions"},
  {icon:"💄",n:"Beauty Tutorials",d:"Step-by-step beauty content that educates and inspires"},
  {icon:"✨",n:"Skincare Content",d:"Aesthetic routines and product showcases for beauty brands"},
  {icon:"🌿",n:"Lifestyle Reels",d:"Day-in-the-life content that resonates with modern audiences"},
  {icon:"📱",n:"Tech Product Demos",d:"Clear, compelling demos that make tech feel accessible"},
  {icon:"💻",n:"App Reviews",d:"Engaging app reviews designed for Gen Z and millennial audiences"},
  {icon:"📦",n:"Unboxing Videos",d:"Excitement-building unboxings that capture new product energy"},
  {icon:"🎙️",n:"Voiceovers",d:"Professional narrations for brand campaigns and reels"},
  {icon:"📸",n:"Product Photography",d:"Editorial flat-lays and lifestyle shots with premium feel"},
  {icon:"🎞️",n:"Instagram Reels",d:"Trending-format Reels optimized for maximum organic reach"},
];

const PORTFOLIO = [
  {cat:"Beauty",brand:"Glow Lab",title:"Morning Skincare Routine",bg1:"#F5D5C8",bg2:"#D8A898",lbl:"Concept Project"},
  {cat:"Tech",brand:"NovaTech",title:"Wireless Earbuds Review",bg1:"#D4D4F4",bg2:"#9898D8",lbl:"Concept Project"},
  {cat:"Lifestyle",brand:"Bloom & Co",title:"Aesthetic Morning Vlog",bg1:"#D4ECC8",bg2:"#8AC870",lbl:"Concept Project"},
  {cat:"Beauty",brand:"Velvet Skin",title:"Dewy Foundation Review",bg1:"#F0C0CC",bg2:"#D888A0",lbl:"Brand Collab"},
  {cat:"Tech",brand:"SmartHome Pro",title:"Smart Lamp Unboxing",bg1:"#C8D8F0",bg2:"#80A8D8",lbl:"Concept Project"},
  {cat:"Lifestyle",brand:"Maison Vibes",title:"Aesthetic Desk Setup",bg1:"#F0E4C4",bg2:"#C8B870",lbl:"Concept Project"},
];

const WHY = [
  {icon:"👯",t:"Two Perspectives",d:"Two creative minds, one cohesive vision — twice the ideas and energy for every brief."},
  {icon:"📊",t:"Gen Z Expertise",d:"Deep understanding of what actually resonates and converts online."},
  {icon:"✂️",t:"Trend-First Editing",d:"Fast, clean cuts with current transitions to maximize native engagement."},
  {icon:"🎨",t:"Elevated Aesthetic",d:"A consistent luxury-inspired visual identity that elevates your brand's feed."},
  {icon:"📖",t:"Story-Led Content",d:"Emotional storytelling that makes your audience feel something real."},
  {icon:"⚡",t:"Fast & Reliable",d:"On-time delivery, every single time, without compromising quality."},
  {icon:"💎",t:"Fresh Perspectives",d:"Creative energy untainted by fatigue — every brief genuinely excites us."},
  {icon:"🤝",t:"Seamless Collab",d:"Your brand message blended effortlessly into organic-feeling content."},
];

const TESTIMONIALS = [
  {stars:5,txt:"Vanreet created our skincare campaign and it felt incredibly authentic. Engagement tripled within a week.",auth:"Priya Sharma",role:"Founder, Bloom Skincare",init:"PS"},
  {stars:5,txt:"Working with both of them was a dream — they each brought a unique angle that made the content feel so complete.",auth:"Rahul Mehta",role:"Product Manager, AppVibe",init:"RM"},
  {stars:5,txt:"The unboxing content was stunning. Their combined aesthetic eye and editing skills genuinely blew us away.",auth:"Aisha Khan",role:"Owner, Minimal Living Co.",init:"AK"},
  {stars:5,txt:"They understood our brand vision on the first call. The lifestyle reel is now our best performing post.",auth:"Sneha Joshi",role:"Marketing Lead, Urban Bloom",init:"SJ"},
  {stars:5,txt:"Fresh, creative, passionate — and the duo dynamic brings something truly special to every collaboration.",auth:"Dev Patel",role:"CEO, TechBuddy",init:"DP"},
];

const PACKAGES = [
  {n:"Starter",p:"₹2,500",per:"per video",
    feats:["1 UGC Video (30–60s)","Basic editing","2 revisions","Usage rights","72hr delivery"],
    badge:null,feat:false},
  {n:"Monthly Bundle",p:"₹12,000",per:"per month",
    feats:["4 UGC Videos","Pro editing + audio","Unlimited revisions","Priority delivery","Monthly strategy call","Analytics report"],
    badge:"Most Popular",feat:true},
  {n:"Photo Pack",p:"₹4,500",per:"per shoot",
    feats:["10 product photos","Aesthetic flat-lay","Lifestyle context shots","Full editing","Commercial usage"],
    badge:null,feat:false},
  {n:"Tech Demo",p:"₹3,500",per:"per video",
    feats:["1 Tech product demo","Screen rec + voiceover","Trending format editing","Feature highlights","Platform optimized"],
    badge:"Best for Startups",feat:false},
  {n:"Custom Collab",p:"Custom",per:"let's talk",
    feats:["Any format / platform","Fully bespoke content","Campaign planning","Long-term partnership","Priority support"],
    badge:null,feat:false},
];

const FAQ_DATA = [
  {q:"How long does it take to deliver a UGC video?",a:"Standard delivery is 72 hours after a confirmed brief. Rush delivery (24hrs) is available at an additional fee. Monthly bundle clients get priority turnaround."},
  {q:"Do you provide usage rights for ads?",a:"Yes! All packages include full commercial usage rights. You can run the content as paid ads on any platform without additional licensing fees."},
  {q:"Can you create content without the product?",a:"For digital products like apps and SaaS tools, absolutely yes. For physical products, we'll need them shipped to us. We can also work with products already on hand."},
  {q:"What if we're not happy with the content?",a:"Revisions are included in every package. Our goal is for you to love what we create together. Most clients are happy after the first draft!"},
  {q:"Do you work with small brands and startups?",a:"Absolutely! We love working with passionate founders and growing brands. Our Starter package is specifically designed for early-stage brands and product launches."},
];

const FEED_COLS = ["#F5D5C8","#DCCCC0","#E8D0BE","#F0E4D4","#D8BEB0","#EAC8B4",
  "#D4D4F0","#BCC8E8","#D0E0F4","#E0E8F4","#C8C8E0","#B8C8DC"];

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION UTILITY
// Single source of truth for all in-page scrolling.
// Reads the live navbar height so headings are never hidden behind the fixed nav.
// ─────────────────────────────────────────────────────────────────────────────
function scrollToId(id) {
  const selector = id.startsWith('#') ? id : `#${id}`;
  const el = document.querySelector(selector);
  if (!el) return;
  // Read live nav height (shrinks when scrolled) + a small 8px breathing room
  const nav    = document.querySelector('.nav');
  const offset = (nav ? nav.offsetHeight : 80) + 8;
  window.scrollTo({
    top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset),
    behavior: 'smooth',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const lblRef  = useRef(null);

  useEffect(() => {
    let mx = -200, my = -200, rx = -200, ry = -200, rafId;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const animate = () => {
      rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${mx-3.5}px,${my-3.5}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx-22}px,${ry-22}px)`;
      if (lblRef.current)  lblRef.current.style.transform  = `translate(${mx}px,${my+28}px)`;
      rafId = requestAnimationFrame(animate);
    };
    const onOver = (e) => {
      const pf   = e.target.closest('.pf-item,[data-cv]');
      const inter = e.target.closest('a,button,.sv-card,.pkg-c,.why-c,.ts-c,.ftag,.soc-i');
      const ring = ringRef.current, lbl = lblRef.current;
      if (!ring) return;
      if (pf)    { ring.classList.add('view'); ring.classList.remove('big'); if (lbl) { lbl.textContent='View'; lbl.classList.add('show'); } }
      else if (inter) { ring.classList.add('big'); ring.classList.remove('view'); if (lbl) lbl.classList.remove('show'); }
      else { ring.classList.remove('big','view'); if (lbl) lbl.classList.remove('show'); }
    };
    document.addEventListener('mousemove', onMove, {passive:true});
    document.addEventListener('mouseover', onOver);
    rafId = requestAnimationFrame(animate);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', onOver); cancelAnimationFrame(rafId); };
  }, []);

  return (<><div ref={dotRef} className="c-dot"/><div ref={ringRef} className="c-ring"/><div ref={lblRef} className="c-label"/></>);
}

function ScrollProgress({ pct }) {
  return <div className="sp-bar" style={{width:`${pct}%`}} />;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('on'); obs.disconnect(); } }, {threshold:0.08});
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="rv" style={{transitionDelay:`${delay}ms`,...style}}>{children}</div>;
}

function Counter({ to, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now(), dur = 1800;
        const frame = (now) => { const p=Math.min((now-t0)/dur,1); const ease=1-Math.pow(1-p,3); setN(Math.round(to*ease)); if (p<1) requestAnimationFrame(frame); };
        requestAnimationFrame(frame);
      }
    },{threshold:0.4});
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

// Ripple button — also intercepts internal anchor hrefs so they use scrollToId
// instead of browser-native jump (which ignores our navbar offset).
function RipBtn({ children, className = "btn-p", href, onClick, style }) {
  const fire = (e) => {
    // Ripple visual
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const sz = Math.max(r.width, r.height);
    const sp = document.createElement('span');
    sp.className = 'rpl-el';
    sp.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px`;
    el.appendChild(sp);
    setTimeout(() => sp.remove(), 620);
    // Smooth-scroll for internal anchors
    if (href?.startsWith('#')) {
      e.preventDefault();
      scrollToId(href);
    }
    onClick?.();
  };
  const props = {className, style, onClick:fire};
  return href
    ? <a href={href} {...props}>{children}</a>
    : <button {...props}>{children}</button>;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark,     setDark]     = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spPct,    setSpPct]    = useState(0);
  const [filter,   setFilter]   = useState("All");
  const [openFaq,  setOpenFaq]  = useState(null);

  const b1 = useRef(null), b2 = useRef(null), b3 = useRef(null), b4 = useRef(null);
  const amb = useRef(null);
  const tsRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 2450); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const h = document.documentElement;
    const fn = () => { setScrolled(window.scrollY > 60); setSpPct(window.scrollY / (h.scrollHeight - h.clientHeight) * 100); };
    window.addEventListener('scroll', fn, {passive:true});
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    let tx=0,ty=0,lx=0,ly=0,raf;
    const mv = (e) => { tx = e.clientX/window.innerWidth-.5; ty = e.clientY/window.innerHeight-.5; };
    const loop = () => {
      lx+=(tx-lx)*.048; ly+=(ty-ly)*.048;
      if (b1.current) b1.current.style.transform = `translate(${lx*-38}px,${ly*-28}px)`;
      if (b2.current) b2.current.style.transform = `translate(${lx*30}px,${ly*38}px)`;
      if (b3.current) b3.current.style.transform = `translate(${lx*22}px,${ly*18}px)`;
      if (b4.current) b4.current.style.transform = `translate(${lx*-18}px,${ly*22}px)`;
      if (amb.current) amb.current.style.transform = `translate(calc(-50% + ${lx*90}px),calc(-50% + ${ly*90}px))`;
      raf = requestAnimationFrame(loop);
    };
    document.addEventListener('mousemove', mv, {passive:true}); raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener('mousemove', mv); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const el = tsRef.current; if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 20) el.scrollTo({left:0, behavior:'instant'});
      else el.scrollBy({left: 312, behavior:'smooth'});
    }, 3400);
    return () => clearInterval(t);
  }, []);

  // All in-page navigation routes through scrollToId (defined at module level)
  const go = scrollToId;
  const filtered = filter === "All" ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === filter);

  // "Van" dark + "reet" in accent — editorial two-tone split
  const L1 = "Van".split('');
  const L2 = "reet".split('');

  return (
    <div className={dark ? "dm" : ""} style={{background:"var(--cr)",minHeight:"100vh",transition:"background .5s,color .5s"}}>
      <style>{STYLES}</style>

      <div className="noise-ov" />
      <Cursor />
      <ScrollProgress pct={spPct} />

      {/* ── LOADER ── */}
      <div className={`ldr${loaded?" out":""}`}>
        <div className="l-hindi">वनरीत</div>
        <div className="l-eng">Vanreet · UGC Creator Duo</div>
        <div className="l-bar"><div className="l-fill" /></div>
      </div>

      {/* ════════ NAVBAR ════════ */}
      <nav className={`nav${scrolled?" scr":""}`}>
        <a href="#home" className="nav-logo"
          onClick={e=>{e.preventDefault();go('#home')}}>
          <span className="nl-en">Vanreet<span>.</span></span>
          <span className="nl-hi">वनरीत</span>
        </a>
        <ul className="nav-links">
          {[["About","#about"],["Services","#services"],["Portfolio","#portfolio"],["Packages","#packages"],["Contact","#contact"]].map(([l,h]) => (
            <li key={l}>
              <a href={h} onClick={e=>{e.preventDefault();go(h)}}>{l}</a>
            </li>
          ))}
        </ul>
        <div className="nav-r">
          <button className="dm-btn" onClick={() => setDark(!dark)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
          <a href="#contact" className="nav-cta"
            onClick={e=>{e.preventDefault();go('#contact')}}>Work With Us</a>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className="hero" id="home">
        <div className="blob b1" ref={b1} />
        <div className="blob b2" ref={b2} />
        <div className="blob b3" ref={b3} />
        <div className="blob b4" ref={b4} />
        <div className="amb"    ref={amb} />
        {PARTICLES.map((p,i) => (
          <div key={i} className="part" style={{width:p.s,height:p.s,left:p.x,top:p.y,background:p.c,"--dur":p.dur,"--del":p.del,"--o1":p.o1,"--o2":p.o2}} />
        ))}

        <div className="hero-inner">
          {/* LEFT */}
          <div>
            {/* Hindi signature */}
            <span className="hi-sig">वनरीत</span>

            <div className="h-eye">
              <span className="ey-line" />
              UGC Creator Duo
            </div>

            {/* VAN + reet — two-tone editorial name */}
            <div className="h-name-block">
              <div className="h-line">
                {L1.map((l,i) => (
                  <span key={i} className="h-ltr" style={{"--ld":`${0.52+i*0.07}s`}}>{l}</span>
                ))}
              </div>
              <div className="h-line" style={{marginTop:".08rem"}}>
                {L2.map((l,i) => (
                  <span key={i} className="h-ltr acc" style={{"--ld":`${0.78+i*0.08}s`}}>{l}</span>
                ))}
              </div>
            </div>

            {/* Duo pill — Vanshika + Manpreet */}
            <div className="duo-pill">
              <div className="duo-av" style={{background:"#F2C8B0"}}>V</div>
              <div className="duo-av" style={{background:"#D4D4F0",marginLeft:"-10px"}}>M</div>
              <span className="duo-txt">Vanshika &amp; Manpreet · Two friends, one brand</span>
            </div>

            <div className="h-sub">Beauty · Lifestyle · Tech</div>

            <p className="h-desc">
              Creating content that feels authentic, aesthetic,<br />
              and impossible to scroll past.
            </p>

            <div className="h-btns">
              <RipBtn href="#portfolio" className="btn-p">
                View Portfolio <span className="arr">→</span>
              </RipBtn>
              <RipBtn href="#contact" className="btn-s">Work With Us</RipBtn>
            </div>

            {/* Social — Instagram, Pinterest, X (no TikTok, no YouTube yet) */}
            <div className="soc-row">
              {[["📸","https://instagram.com/creativesbyvanreet"],["📌","#"],["𝕏","#"]].map(([ic,h]) => (
                <a key={ic} href={h} className="soc-i" target="_blank" rel="noopener noreferrer">{ic}</a>
              ))}
            </div>

            {/* Quick internal section links */}
            <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap",marginBottom:"1.75rem",
              opacity:0,animation:"fuA .6s ease 2.38s both"}}>
              {[["About Us","#about"],["Services","#services"],["Portfolio","#portfolio"],["Packages","#packages"]].map(([label,href]) => (
                <a key={label} href={href}
                  onClick={e=>{e.preventDefault();go(href)}}
                  style={{fontSize:".71rem",color:"var(--mu)",textDecoration:"none",
                    letterSpacing:".07em",display:"inline-flex",alignItems:"center",gap:".3rem",
                    fontWeight:500,transition:"color .3s",cursor:"none"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--ac)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--mu)"}>
                  {label}<span style={{color:"var(--ac)",fontSize:".62rem"}}>↓</span>
                </a>
              ))}
            </div>

            <div className="h-stats">
              {H_STATS.map(s => (
                <div key={s.label} className="h-stat">
                  <div className="h-st-ic" style={{background:s.bg}}>{s.icon}</div>
                  <div>
                    <div className="h-st-val">{s.val}</div>
                    <div className="h-st-lbl">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Image */}
          <div className="img-area">
            <div className="img-glow" />
            {CREATOR_TAGS.map((tag,i) => (
              <div key={i} className={`ftag ft${i+1}`}>
                <span>{tag.icon}</span>
                <span style={{fontSize:".71rem"}}>{tag.label}</span>
              </div>
            ))}
            <div className="img-frame">
              <div className="img-inner">
                <div className="img-bg" />
                <div className="img-grid">
                  {["ig1","ig2","ig3","ig4","ig5","ig6"].map(c => <div key={c} className={`ig ${c}`} />)}
                </div>
                <div className="img-overlay" />
              </div>
              <div className="img-badge">
                <span className="ib-hi">वनरीत</span>
                <span className="ib-en">Vanshika &amp; Manpreet · Open for Collabs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="scr-ind" onClick={() => go('#about')}>
          <div className="scr-ln" /><div className="scr-tx">Scroll</div>
        </div>
      </section>

      {/* ════════ MARQUEE ════════ */}
      <div className="mq-wrap">
        <div className="mq-track">
          {[...MQ_ITEMS,...MQ_ITEMS].map((m,i) => (
            <span key={i} className={`mq-item${m.hi?" mq-hi":""}`}>
              {m.text}<span className="mq-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ════════ ABOUT ════════ */}
      <section id="about" style={{background:"var(--cr)"}}>
        <div className="con">
          <div className="ab-grid">
            <Reveal>
              <div>
                <div className="ab-img">
                  <div style={{position:"absolute",top:"14%",right:"12%",width:"55px",height:"55px",border:"1.5px solid rgba(255,255,255,.25)",borderRadius:"50%"}} />
                  <div style={{position:"absolute",top:"20%",right:"18%",width:"36px",height:"36px",border:"1px solid rgba(255,255,255,.15)",borderRadius:"50%"}} />
                  <div className="ab-ov" />
                  <div className="ab-tag">
                    <div className="ab-tn">Vanreet</div>
                    <div className="ab-ts">
                      <span style={{fontFamily:"'Yatra One',serif",color:"var(--ac)",marginRight:".4rem",fontSize:".9rem"}}>वनरीत</span>
                      UGC Creators · Beauty, Lifestyle &amp; Tech
                    </div>
                  </div>
                </div>
                <div className="ab-stats">
                  {[{n:15,s:"+",l:"Brands Pitched"},{n:50,s:"+",l:"Content Pieces"},{n:100,s:"%",l:"Passion Driven"}].map(s => (
                    <div key={s.l} className="st-c">
                      <div className="st-n"><Counter to={s.n} suffix={s.s} /></div>
                      <div className="st-l">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <div className="s-label">About Us</div>
                <h2 className="s-title">
                  We're{" "}
                  <span style={{color:"var(--ac)",fontStyle:"italic"}}>Vanreet</span> 👯
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p style={{fontSize:"1rem",color:"var(--mu)",lineHeight:1.8,marginBottom:"1.2rem"}}>
                  Vanreet is Vanshika and Manpreet — two best friends who turned their shared
                  love for beauty, lifestyle, and tech into a content creation duo. Together
                  we bring double the creativity, double the perspectives, and double the energy
                  to every brand we work with.
                </p>
                <p style={{fontSize:"1rem",color:"var(--mu)",lineHeight:1.8,marginBottom:"2rem"}}>
                  We believe authentic storytelling is the most powerful tool a brand can have.
                  We don't just make content — we craft experiences that make people feel something real.
                </p>
              </Reveal>

              {/* Meet the duo cards */}
              <Reveal delay={150}>
                <div className="duo-cards">
                  <div className="duo-card">
                    <div className="dc-name">Vanshika</div>
                    <div className="dc-hi">वंशिका</div>
                    <div className="dc-role">Beauty & Lifestyle specialist · Aesthetic eye · Trend-led editing</div>
                  </div>
                  <div className="duo-card">
                    <div className="dc-name">Manpreet</div>
                    <div className="dc-hi">मनप्रीत</div>
                    <div className="dc-role">Tech & Storytelling specialist · Strategy · Brand voice</div>
                  </div>
                </div>
              </Reveal>

              <div className="traits">
                {[
                  {ic:"🎨",n:"Aesthetic & Creative",d:"Every frame is intentional — from lighting to colour grading"},
                  {ic:"📈",n:"Trend Aware",d:"Constantly studying what's performing on Instagram Reels right now"},
                  {ic:"✂️",n:"Strong Editors",d:"Fast, clean cuts with current transitions and trending audio"},
                  {ic:"💬",n:"Authentic Voices",d:"Real, relatable content that doesn't feel like a paid ad"},
                  {ic:"🔄",n:"Consistent & Reliable",d:"Deadline-driven duo, always delivering on time"},
                ].map((t,i) => (
                  <Reveal key={t.n} delay={i*70}>
                    <div className="trait">
                      <div className="tr-ic">{t.ic}</div>
                      <div><div className="tr-n">{t.n}</div><div className="tr-d">{t.d}</div></div>
                    </div>
                  </Reveal>
                ))}
              </div>
              {/* Internal link to next section */}
              <Reveal delay={380}>
                <div style={{marginTop:"2rem",paddingTop:"1.5rem",borderTop:"1px solid var(--bd)",
                  display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
                  <a href="#services"
                    onClick={e=>{e.preventDefault();go('#services')}}
                    style={{fontSize:".82rem",color:"var(--ac)",textDecoration:"none",
                    fontWeight:600,letterSpacing:".04em",display:"inline-flex",alignItems:"center",gap:".4rem",
                    cursor:"none",transition:"gap .3s"}}
                    onMouseEnter={e=>e.currentTarget.style.gap=".7rem"}
                    onMouseLeave={e=>e.currentTarget.style.gap=".4rem"}>
                    See what we create →
                  </a>
                  <a href="#portfolio"
                    onClick={e=>{e.preventDefault();go('#portfolio')}}
                    style={{fontSize:".82rem",color:"var(--mu)",textDecoration:"none",
                    fontWeight:500,letterSpacing:".04em",display:"inline-flex",alignItems:"center",gap:".4rem",
                    cursor:"none",transition:"color .3s"}}
                    onMouseEnter={e=>e.currentTarget.style.color="var(--ac)"}
                    onMouseLeave={e=>e.currentTarget.style.color="var(--mu)"}>
                    View our portfolio →
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section id="services" style={{background:"var(--bg)"}}>
        <div className="con">
          <div className="sv-head">
            <div>
              <Reveal><div className="s-label">What We Create</div></Reveal>
              <Reveal delay={100}><h2 className="s-title">Services & Content Types</h2></Reveal>
            </div>
            <Reveal delay={150}>
              <p className="s-desc" style={{textAlign:"right",maxWidth:"340px"}}>
                From viral Reels to premium product photography — crafted with full intention.
              </p>
            </Reveal>
          </div>
          <div className="sv-grid">
            {SERVICES.map((s,i) => (
              <Reveal key={s.n} delay={i*40}>
                <div className="sv-card">
                  <div className="sv-ic">{s.icon}</div>
                  <div className="sv-n">{s.n}</div>
                  <div className="sv-d">{s.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
          {/* Link to portfolio */}
          <Reveal delay={200}>
            <div style={{marginTop:"3rem",textAlign:"center",display:"flex",
              gap:"1.5rem",justifyContent:"center",flexWrap:"wrap"}}>
              <a href="#portfolio"
                style={{display:"inline-flex",alignItems:"center",gap:".55rem",
                  fontSize:".85rem",fontWeight:600,color:"var(--dk)",textDecoration:"none",
                  letterSpacing:".04em",padding:".75rem 1.8rem",borderRadius:"50px",
                  border:"1.5px solid var(--bd)",transition:"all .3s",cursor:"none",
                  backdropFilter:"blur(8px)"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--dk)";e.currentTarget.style.color="var(--cr)";e.currentTarget.style.borderColor="var(--dk)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--dk)";e.currentTarget.style.borderColor="var(--bd)"}}>
                See our work →
              </a>
              <a href="#packages"
                style={{display:"inline-flex",alignItems:"center",gap:".55rem",
                  fontSize:".85rem",fontWeight:600,color:"var(--ac)",textDecoration:"none",
                  letterSpacing:".04em",padding:".75rem 1.8rem",borderRadius:"50px",
                  border:"1.5px solid var(--ac)",transition:"all .3s",cursor:"none"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--ac)";e.currentTarget.style.color="white"}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--ac)"}}>
                View packages →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ PORTFOLIO ════════ */}
      <section id="portfolio" style={{background:"var(--cr)"}}>
        <div className="con">
          <div className="pf-head">
            <div>
              <Reveal><div className="s-label">Our Work</div></Reveal>
              <Reveal delay={100}><h2 className="s-title">Content Portfolio</h2></Reveal>
            </div>
            <Reveal delay={150}>
              <div className="pf-tabs">
                {["All","Beauty","Lifestyle","Tech"].map(f => (
                  <button key={f} className={`pf-tab${filter===f?" on":""}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="pf-grid">
            {filtered.map((p,i) => (
              <Reveal key={p.title+i} delay={i*80}>
                <div className="pf-item">
                  <div className="pf-th" style={{background:`linear-gradient(150deg,${p.bg1},${p.bg2})`}}>
                    <div className="ph-wrap">
                      <div className="ph-sc" style={{background:`linear-gradient(155deg,${p.bg1},${p.bg2})`}}>
                        <div style={{flex:"0 0 56%",borderRadius:"6px",background:"rgba(255,255,255,.38)"}} />
                        <div style={{height:"7px",borderRadius:"3px",width:"75%",background:"rgba(255,255,255,.55)"}} />
                        <div style={{height:"5px",borderRadius:"3px",width:"55%",background:"rgba(255,255,255,.32)"}} />
                        <div style={{display:"flex",gap:"4px",marginTop:"auto"}}>
                          {[1,2,3].map(n => <div key={n} style={{flex:1,height:"24px",borderRadius:"5px",background:"rgba(255,255,255,.28)"}} />)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pf-ov">
                    <div>
                      <div className="pf-bdg">{p.lbl}</div>
                      <div className="pf-title">{p.title}</div>
                      <div className="pf-brand">for {p.brand}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {/* Link to contact after portfolio */}
          <Reveal delay={200}>
            <div style={{marginTop:"3rem",textAlign:"center"}}>
              <a href="#contact"
                style={{display:"inline-flex",alignItems:"center",gap:".55rem",
                  fontSize:".85rem",fontWeight:600,color:"white",textDecoration:"none",
                  letterSpacing:".04em",padding:".85rem 2.2rem",borderRadius:"50px",
                  background:"var(--dk)",transition:"all .3s",cursor:"none",
                  boxShadow:"0 8px 24px rgba(30,21,16,.2)"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--ac)";e.currentTarget.style.boxShadow="0 12px 32px rgba(200,132,90,.3)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="var(--dk)";e.currentTarget.style.boxShadow="0 8px 24px rgba(30,21,16,.2)"}}>
                Like what you see? Let's collab ✨
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      <section style={{background:"var(--dk)"}}>
        <div className="con">
          <Reveal><div className="s-label" style={{color:"rgba(200,132,90,.8)"}}>Why Collaborate</div></Reveal>
          <Reveal delay={100}>
            <h2 className="s-title" style={{color:"rgba(240,228,212,.95)"}}>
              Why Brands Love{" "}
              <span style={{color:"var(--ac)",fontStyle:"italic"}}>Working With Vanreet</span>
            </h2>
          </Reveal>
          <div className="why-grid">
            {WHY.map((w,i) => (
              <Reveal key={w.t} delay={i*55}>
                <div className="why-c">
                  <div className="why-ic">{w.icon}</div>
                  <div className="why-t">{w.t}</div>
                  <div className="why-d">{w.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section style={{background:"var(--pk)"}}>
        <div className="con">
          <Reveal><div className="s-label">Client Love</div></Reveal>
          <Reveal delay={100}><h2 className="s-title">What People Say</h2></Reveal>
          <div className="ts-track" ref={tsRef}>
            {[...TESTIMONIALS,...TESTIMONIALS].map((t,i) => (
              <div key={i} className="ts-c">
                <div className="ts-stars">{"★".repeat(t.stars)}</div>
                <p className="ts-txt">"{t.txt}"</p>
                <div className="ts-auth">
                  <div className="ts-av">{t.init}</div>
                  <div><div className="ts-an">{t.auth}</div><div className="ts-ar">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PACKAGES ════════ */}
      <section id="packages" style={{background:"var(--bg)"}}>
        <div className="con">
          <Reveal><div className="s-label">Content Packages</div></Reveal>
          <Reveal delay={100}><h2 className="s-title">Pricing & Packages</h2></Reveal>
          <Reveal delay={150}>
            <p className="s-desc">Transparent pricing for every stage of your brand journey. Custom packages always available.</p>
          </Reveal>
          <div className="pkg-grid">
            {PACKAGES.map((p,i) => (
              <Reveal key={p.n} delay={i*75}>
                <div className={`pkg-c${p.feat?" ft":""}`}>
                  {p.badge && <div className="pkg-b">{p.badge}</div>}
                  <div className="pkg-n">{p.n}</div>
                  <div className="pkg-p">{p.p}</div>
                  <div className="pkg-per">{p.per}</div>
                  <ul className="pkg-fl">
                    {p.feats.map(f => <li key={f}><span className="ck">✓</span>{f}</li>)}
                  </ul>
                  <RipBtn href="#contact" className={p.feat?"btn-p":"btn-s"}
                    style={{width:"100%",justifyContent:"center",borderColor:p.feat?"var(--ac)":"var(--bd)"}}>
                    Get Started
                  </RipBtn>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SOCIAL MEDIA — Instagram + Pinterest only ════════ */}
      <section style={{background:"var(--cr)"}}>
        <div className="con">
          <Reveal><div className="s-label">Social Presence</div></Reveal>
          <Reveal delay={100}><h2 className="s-title">Find Us Online</h2></Reveal>
          <div className="sc-grid">
            {[
              {ic:"📸",n:"Instagram",hd:"@creativesbyvanreet",
                bg:"linear-gradient(135deg,#F090B8,#E06080)",
                link:"https://instagram.com/creativesbyvanreet",
                stats:[{n:"Open",l:"For Collabs"},{n:"✨",l:"Daily Content"}],
                cols:[0,1,2,3,4,5]},
              {ic:"📌",n:"Pinterest",hd:"@creativesbyvanreet",
                bg:"linear-gradient(135deg,#E60023,#B8001A)",
                link:"#",
                stats:[{n:"Beauty",l:"Lifestyle Boards"},{n:"Tech",l:"Inspiration"}],
                cols:[6,7,8,9,10,11]},
            ].map((p,pi) => (
              <Reveal key={p.n} delay={pi*90}>
                <div className="sc-card">
                  <div className="sc-h">
                    <div className="sc-ic" style={{background:p.bg}}>{p.ic}</div>
                    <div><div className="sc-n">{p.n}</div><div className="sc-hd">{p.hd}</div></div>
                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{marginLeft:"auto",fontSize:".72rem",color:"var(--ac)",textDecoration:"none",fontWeight:500,cursor:"none"}}>Follow →</a>
                  </div>
                  <div className="feed-g">
                    {p.cols.map((ci,fi) => <div key={fi} className="feed-c" style={{background:FEED_COLS[ci]}}><div className="f-ov">View</div></div>)}
                  </div>
                  <div className="sc-st">
                    {p.stats.map(s => <div key={s.l} className="sc-sv"><div className="sc-sn">{s.n}</div><div className="sc-sl">{s.l}</div></div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section style={{background:"var(--bg)"}}>
        <div className="con" style={{maxWidth:"750px"}}>
          <Reveal><div className="s-label">Questions</div></Reveal>
          <Reveal delay={100}><h2 className="s-title">Frequently Asked</h2></Reveal>
          <div className="faq-list">
            {FAQ_DATA.map((f,i) => (
              <Reveal key={i} delay={i*55}>
                <div className={`faq-item${openFaq===i?" open":""}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                    {f.q}<span className="faq-ic">+</span>
                  </button>
                  <div className={`faq-ans${openFaq===i?" vis":""}`}>
                    <div className="faq-a-in">{f.a}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CONTACT ════════ */}
      <section id="contact" style={{background:"var(--cr)"}}>
        <div className="con">
          <Reveal><div className="s-label">Get In Touch</div></Reveal>
          <Reveal delay={100}>
            <h2 className="s-title">
              Let's Create Something{" "}
              <span style={{color:"var(--ac)",fontStyle:"italic"}}>Beautiful</span>
            </h2>
          </Reveal>
          <div className="ct-grid">
            <Reveal>
              <form className="ct-form" onSubmit={e => e.preventDefault()}>
                <div className="ct-2">
                  <div className="ct-fg"><label className="ct-lb">First Name</label><input className="ct-in" placeholder="Your name" type="text" /></div>
                  <div className="ct-fg"><label className="ct-lb">Last Name</label><input className="ct-in" placeholder="Last name" type="text" /></div>
                </div>
                <div className="ct-fg"><label className="ct-lb">Brand / Company</label><input className="ct-in" placeholder="Your Brand Name" type="text" /></div>
                <div className="ct-fg"><label className="ct-lb">Email Address</label><input className="ct-in" placeholder="hello@yourbrand.com" type="email" /></div>
                <div className="ct-fg">
                  <label className="ct-lb">Content Type</label>
                  <select className="ct-in">
                    <option>UGC Video</option>
                    <option>Product Photography</option>
                    <option>Monthly Bundle</option>
                    <option>Tech Demo</option>
                    <option>Custom Collaboration</option>
                  </select>
                </div>
                <div className="ct-fg">
                  <label className="ct-lb">Tell Us About Your Brand</label>
                  <textarea className="ct-in" placeholder="Share your vision, campaign goals, and what makes your brand unique…" />
                </div>
                <RipBtn className="btn-p" style={{width:"100%",justifyContent:"center",border:"none"}} onClick={() => {}}>
                  Send Message ✨
                </RipBtn>
              </form>
            </Reveal>

            <Reveal delay={200}>
              <div className="ct-info">
                <div className="ci-t">Ready to work together?</div>
                <p className="ci-s">
                  We're currently open for new brand collaborations. Let's create content
                  your audience will love and that drives real results.
                </p>
                {[
                  {ic:"📧",lb:"Email",vl:"creativesbyvanreet@gmail.com"},
                  {ic:"📸",lb:"Instagram",vl:"@creativesbyvanreet"},
                  {ic:"📌",lb:"Pinterest",vl:"@creativesbyvanreet"},
                  {ic:"⏱️",lb:"Response Time",vl:"Within 24 hours"},
                ].map(c => (
                  <div key={c.lb} className="ci-row">
                    <div className="ci-ic">{c.ic}</div>
                    <div><div className="ci-lb">{c.lb}</div><div className="ci-vl">{c.vl}</div></div>
                  </div>
                ))}
                <div style={{marginTop:"2rem",padding:"1.5rem",background:"rgba(200,132,90,.1)",borderRadius:"16px",border:"1px solid rgba(200,132,90,.2)"}}>
                  <div style={{fontSize:".68rem",color:"var(--ac)",letterSpacing:".14em",textTransform:"uppercase",fontWeight:600,marginBottom:".5rem"}}>✦ Currently Available</div>
                  <div style={{fontSize:".85rem",color:"rgba(240,228,212,.6)",lineHeight:1.65}}>
                    Taking new brand collaborations now. Limited spots — reach out early!
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="ft-root">
        <div className="ft-inner">
          <div className="ft-grid">
            <div>
              <div className="ft-logo">Vanreet<span>.</span></div>
              <div className="ft-hi">वनरीत</div>
              <p className="ft-tag">
                Beauty · Lifestyle · Tech UGC Creator Duo crafting authentic,
                high-converting content for modern brands.
              </p>
              <div className="ft-soc">
                {["📸","📌","𝕏"].map(i => <a key={i} href={i==="📸"?"https://instagram.com/creativesbyvanreet":"#"} className="ft-si" target="_blank" rel="noopener noreferrer">{i}</a>)}
              </div>
            </div>
            <div>
              <div className="ft-h">Quick Links</div>
              <ul className="ft-l">
                {[["About","#about"],["Services","#services"],["Portfolio","#portfolio"],["Packages","#packages"],["Contact","#contact"]].map(([l,h]) => <li key={l}><a href={h}>{l}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="ft-h">Services</div>
              <ul className="ft-l">
                {["UGC Videos","Product Reviews","Beauty Tutorials","Tech Demos","Voiceovers"].map(s => <li key={s}><a href="#services">{s}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="ft-h">Contact</div>
              <ul className="ft-l">
                <li><a href="mailto:creativesbyvanreet@gmail.com">creativesbyvanreet@gmail.com</a></li>
                <li><a href="https://instagram.com/creativesbyvanreet" target="_blank" rel="noopener noreferrer">@creativesbyvanreet</a></li>
                <li><a href="#contact">Open for Collabs</a></li>
              </ul>
            </div>
          </div>
          <div className="ft-bot">
            <span>© 2025 Vanreet · All rights reserved.</span>
            <span style={{color:"var(--ac)",fontFamily:"'Yatra One',serif",fontSize:".78rem"}}>
              वनरीत ✦ Vanshika &amp; Manpreet
            </span>
          </div>
        </div>
      </footer>

      {/* ── Floating CTA ── */}
      <div className="fl-wrap">
        <RipBtn className="fl-btn" onClick={() => go('#contact')}>✨ Work With Us</RipBtn>
      </div>
    </div>
  );
}
