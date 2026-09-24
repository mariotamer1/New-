(()=>{var me=typeof window<"u"&&window.ML_CONFIG||{};function Je(){let e=document.querySelector('meta[name="ml-root"]');try{return new URL(e?e.content:"./",location.href).href}catch{return location.href}}var M={cfg:me,routing:me.routing||(location.protocol==="file:"?"hash":"path"),root:Je(),embed:typeof window<"u"&&window.ML_EMBED||null};M.rootPath=new URL(M.root).pathname;var w=(e,t=document)=>t.querySelector(e),E=(e,t=document)=>Array.from(t.querySelectorAll(e)),l=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),$=e=>"$"+Number(e||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),q=e=>e.originalPrice&&Number(e.originalPrice)>Number(e.price)?Math.round((1-e.price/e.originalPrice)*100):0,K=e=>String(e||"").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/["']/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80),D=()=>crypto.randomUUID?crypto.randomUUID():"id-"+Date.now().toString(36)+Math.random().toString(36).slice(2,10);var H=e=>"tel:"+String(e||"").replace(/[^\d+]/g,""),O=e=>Math.round(Number(e)*100)/100;function f(e){return e=e||"/",M.routing==="path"?M.rootPath+e.replace(/^\//,""):"#"+e}function R(e){return e?/^(https?:|data:|blob:)/.test(e)?e:M.embed&&M.embed[e]?M.embed[e]:M.root+e:""}function A(e,{alt:t="",sizes:a="(min-width:1024px) 25vw, 50vw",eager:n=!1,cls:s="",w:i=480}={}){if(!e)return`<img class="${s}" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" width="${i}" height="${i}">`;let o=R(e.sm||e.lg),r=R(e.lg||e.sm),c=o!==r&&!M.embed?` srcset="${l(o)} 480w, ${l(r)} 960w" sizes="${a}"`:"";return`<img class="${s}" src="${l(o)}"${c} alt="${l(t||e.alt||"")}" width="${i}" height="${i}" ${n?'fetchpriority="high"':'loading="lazy"'} decoding="async">`}var Ye={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',bag:'<path d="M5.5 8h13l-1 13h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',menu:'<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',down:'<path d="m6 9 6 6 6-6"/>',left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>',grid4:'<path d="M3 5h3.5v5.5H3zM8.5 5H12v5.5H8.5zM14 5h3.5v5.5H14zM19.5 5H21v5.5h-1.5zM3 13.5h3.5V19H3zM8.5 13.5H12V19H8.5zM14 13.5h3.5V19H14zM19.5 13.5H21V19h-1.5z"/>',grid2:'<rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/>',list:'<rect x="3.5" y="4.5" width="5" height="5"/><rect x="3.5" y="14.5" width="5" height="5"/><path d="M11.5 6h9M11.5 8.5h6M11.5 16h9M11.5 18.5h6"/>',rows:'<rect x="2.5" y="6" width="6" height="12"/><rect x="10" y="6" width="6" height="12"/><path d="M17.5 6h4v12h-4"/>',truck:'<path d="M2.5 6.5h11.5v10H2.5z"/><path d="M14 9.5h4.2l3.3 3.4v3.6H14"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',store:'<path d="M4 10.5V20h16v-9.5"/><path d="M3 10.5 5 4h14l2 6.5z"/><path d="M9.5 20v-5.5h5V20"/>',tag:'<path d="M3 12.5V4h8.5l9.5 9.5-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',box:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',check:'<path d="m4.5 12.5 5 5 10-11"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13.5h10L18 7"/>',phone:'<path d="M5 3.5h3.5l2 5-2.5 1.6a11 11 0 0 0 5.9 5.9l1.6-2.5 5 2v3.5a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2"/>',mail:'<rect x="3" y="5" width="18" height="14"/><path d="m3.5 6 8.5 7 8.5-7"/>',pin:'<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',filter:'<path d="M3.5 6h17M7 12h10M10.5 18h3"/>',refund:'<path d="M4 12a8 8 0 1 0 2.8-6.1"/><path d="M4 4.5v4.5h4.5"/>',percent:'<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',lock:'<rect x="4.5" y="10.5" width="15" height="10"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',eye:'<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',logout:'<path d="M14 4h6v16h-6"/><path d="M10 8l-4 4 4 4M6 12h10"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/>',inbox:'<path d="M3 13.5 5.5 5h13l2.5 8.5V19H3z"/><path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',cash:'<rect x="2.5" y="6" width="19" height="12"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9v6M18 9v6"/>',link:'<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',grip:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z"/>',home:'<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/>',msg:'<path d="M4 5h16v11H9l-5 4z"/>',download:'<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>'},h=(e,t="")=>`<svg class="icon ${t}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${Ye[e]||""}</svg>`,_e="M0 0H35L48 13V48H0Z M36.4 9a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0Z M6 41V20H11.6L15 30.4L18.4 20H24V41H19.3V29.6L16.9 36.6H13.1L10.7 29.6V41Z M27 20H32.2V36H41V41H27Z",Qe=e=>`<svg viewBox="0 0 48 48" ${e?`role="img" aria-label="${e}"`:'aria-hidden="true"'}><path fill="currentColor" fill-rule="evenodd" d="${_e}"/></svg>`,J=(e=!0)=>`${Qe()}${e?'<span class="logo-word">GROUP</span>':""}`,fe=["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0001011"];function ge(e){let t=String(e||"").replace(/\D/g,"");if(t.length!==12)return"";let a="101";for(let i=0;i<6;i++)a+=fe[+t[i]];a+="01010";for(let i=6;i<12;i++)a+=fe[+t[i]].replace(/./g,o=>o==="1"?"0":"1");a+="101";let n=new Set([0,1,2,45,46,47,48,49,92,93,94]),s="";for(let i=0;i<a.length;i++)a[i]==="1"&&(s+=`<rect x="${i}" y="0" width="1" height="${n.has(i)?44:38}"/>`);return`<svg viewBox="0 0 95 44" aria-hidden="true" preserveAspectRatio="none" style="width:142px;height:44px"><g fill="currentColor">${s}</g></svg>`}async function ie(e,t){let a=URL.createObjectURL(e);try{let n=await new Promise((p,m)=>{let y=new Image;y.onload=()=>p(y),y.onerror=m,y.src=a}),s=Math.min(1,t/Math.max(n.naturalWidth,n.naturalHeight)),i=Math.round(n.naturalWidth*s),o=Math.round(n.naturalHeight*s),r=document.createElement("canvas");r.width=i,r.height=o;let c=r.getContext("2d");c.fillStyle="#fff",c.fillRect(0,0,i,o),c.drawImage(n,0,0,i,o);let d=await new Promise(p=>r.toBlob(p,"image/webp",.82));return(!d||d.type!=="image/webp")&&(d=await new Promise(p=>r.toBlob(p,"image/jpeg",.86))),d}finally{URL.revokeObjectURL(a)}}var ne=e=>new Promise((t,a)=>{let n=new FileReader;n.onload=()=>t(n.result),n.onerror=a,n.readAsDataURL(e)});async function N(e){try{let t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return Array.from(new Uint8Array(t)).map(a=>a.toString(16).padStart(2,"0")).join("")}catch{return"plain:"+e}}var T={get(e,t){try{let a=localStorage.getItem(e);return a==null?t:JSON.parse(a)}catch{return t}},set(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}},del(e){try{localStorage.removeItem(e)}catch{}}},Y={get(e,t){try{let a=sessionStorage.getItem(e);return a==null?t:JSON.parse(a)}catch{return t}},set(e,t){try{sessionStorage.setItem(e,JSON.stringify(t))}catch{}},del(e){try{sessionStorage.removeItem(e)}catch{}}};var be={"ultrabook-laptop-16gb-512gb":[1,2],"tablet-with-stylus-64gb":[1,2],"curved-ultrawide-monitor-34-inch":[1,2],"4k-ips-monitor-27-inch":[1,2],"mechanical-keyboard-hot-swap":[1,2],"wireless-optical-mouse":[1,2],"gaming-desktop-pc-32gb":[1,2],"portable-bluetooth-cd-boombox":[1,2,3],"ddr4-desktop-memory-32gb":[1,2],"instant-film-camera-white":[1,2],"aluminum-travel-tripod-60-inch":[1,2],"usb-c-charging-cable-3-pack":[1,2],"2tb-internal-hard-drive":[1,2],"mid-century-leather-sofa-cognac":[1,2],"velvet-accent-chair-mango":[1,2,3],"velvet-loveseat-navy":[1,2],"upholstered-armchair-slate-blue":[1,2],"porcelain-teacup-saucer-set":[1,2],"glass-serving-dish-with-dome":[1,2],"insulated-water-bottle-24-oz":[1,2],"white-oak-side-table":[1,2],"matte-white-pendant-light":[1,2],"glass-bud-vase-faux-stems":[1,2],"portable-steel-toolbox-20-inch":[1,2],"screwdriver-set-6-piece":[1,2],"tape-measure-25-ft":[1,2],"garden-hand-trowel":[1,2],"robot-vacuum-cleaner":[1,2],"countertop-microwave-1-1-cu-ft":[1,2],"stainless-electric-kettle-1-7l":[1,2],"stainless-2-slice-toaster":[1,2],"glass-door-beverage-cooler":[1,2],"vintage-tin-toy-car":[1,2,3],"weighted-wooden-chess-set":[1,2,3],"building-bricks-set-500-piece":[1,2],"cruiser-skateboard-22-inch":[1,2],"aluminum-road-bike-54cm":[1,2],"4-person-dome-tent":[1,2],"commuter-backpack-blue":[1,2],"messenger-bag-black":[1],"rolling-duffle-bag":[1],"dual-time-analog-watch":[1],"resistance-band-kit":[1],"indoor-outdoor-basketball":[1,2],"live-bonsai-tree":[1,2]};var ve=[{id:"cat-electronics",slug:"electronics",name:"Electronics",sort:1},{id:"cat-home-kitchen",slug:"home-kitchen",name:"Home & Kitchen",sort:2},{id:"cat-tools",slug:"tools",name:"Tools",sort:3},{id:"cat-appliances",slug:"appliances",name:"Appliances",sort:4},{id:"cat-toys",slug:"toys",name:"Toys",sort:5},{id:"cat-other",slug:"other",name:"Other",sort:6}],_={storeName:"ML Group",phone:"(800) 555-0142",email:"sales@mlgroup.store",address1:"4200 Commerce Way, Unit 5",city:"Springfield",state:"IL",zip:"62701",pickupHours:"Mon\u2013Fri 10am\u20136pm \xB7 Sat 10am\u20134pm",pickupNote:"Bring your order number. We load large items for you.",announcement:"Local pickup always available \xB7 Ships nationwide \xB7 New deals every week"};function Xe(e){let t=("850316"+String(e*7919%1e5).padStart(5,"0")).slice(0,11),a=0;for(let n=0;n<11;n++)a+=Number(t[n])*(n%2===0?3:1);return t+(10-a%10)%10}var et=e=>"cat-"+e,tt=[["ultrabook-laptop-16gb-512gb",'15.6" Ultrabook Laptop \u2013 16GB RAM, 512GB SSD',"Nexa","electronics","Refurbished",629,1099,19.99,4,!0,`Thin aluminum laptop with a 15.6" Full HD display, 12th-gen quad-core processor, 16GB RAM and a fast 512GB SSD. Professionally refurbished, tested and wiped.

\u2022 Up to 10 hours of battery
\u2022 Backlit keyboard, fingerprint login
\u2022 Includes 65W USB-C charger
\u2022 90-day ML Group warranty`],["tablet-with-stylus-64gb",'10.9" Tablet with Stylus \u2013 64GB, Wi-Fi',"Nexa","electronics","Open Box",279,449,9.99,7,!1,`Bright 10.9" Liquid Retina-style display with a pressure-sensitive stylus for notes and sketching. Open-box unit in excellent condition; screen is flawless.

\u2022 64GB storage, Wi-Fi 6
\u2022 Stylus and USB-C cable included
\u2022 Original box included`],["curved-ultrawide-monitor-34-inch",'34" Curved Ultrawide Monitor \u2013 144Hz',"Viewpro","electronics","New",329,549,29.99,5,!0,`A 34" 1500R curved ultrawide with 3440\xD71440 resolution and a 144Hz refresh rate \u2014 room for two full windows side by side.

\u2022 HDR10, 1ms response
\u2022 Height- and tilt-adjustable stand
\u2022 HDMI \xD72, DisplayPort, USB-C 65W`],["4k-ips-monitor-27-inch",'27" 4K IPS Monitor \u2013 USB-C',"Viewpro","electronics","Open Box",219,399,24.99,6,!1,`Sharp 27" 4K IPS panel with 99% sRGB color and single-cable USB-C connection for laptops. Open box, all accessories included.

\u2022 3840\xD72160, 60Hz
\u2022 USB-C with 65W charging
\u2022 VESA mount compatible`],["mechanical-keyboard-hot-swap","Mechanical Keyboard \u2013 Hot-Swap, Tactile Switches","Keyforge","electronics","New",64.99,129,8.99,14,!0,`Full-size mechanical keyboard with hot-swappable tactile switches and double-shot keycaps in a mixed color set.

\u2022 Swap switches without soldering
\u2022 Detachable USB-C cable
\u2022 Per-key backlight`],["wireless-optical-mouse","Wireless Optical Mouse \u2013 Silent Click","Clikr","electronics","New",12.99,29.99,4.99,40,!1,`Comfortable wireless mouse with silent buttons and a precise optical sensor. Plug-and-play USB receiver stores inside the mouse.

\u2022 18-month battery life
\u2022 1600 DPI
\u2022 Works with Windows, macOS, ChromeOS`],["gaming-desktop-pc-32gb","Gaming Desktop PC \u2013 32GB RAM, 1TB SSD","Vortex","electronics","Refurbished",1149,1899,49.99,2,!0,`Tempered-glass gaming tower with 8-core processor, 12GB graphics card, 32GB RAM and a 1TB NVMe SSD. Refurbished and stress-tested for 24 hours.

\u2022 RGB cooling fans
\u2022 Wi-Fi 6 + Bluetooth
\u2022 Windows installed and activated`],["portable-bluetooth-cd-boombox","Portable Bluetooth CD Boombox","Soundwell","electronics","New",44.99,89.99,12.99,18,!0,`Retro-styled boombox with a top-loading CD player, Bluetooth streaming and FM radio. Runs on AC power or batteries for the backyard or garage.

\u2022 Twin full-range speakers
\u2022 Telescopic FM antenna
\u2022 AUX input and headphone jack`],["ddr4-desktop-memory-32gb","DDR4 Desktop Memory 32GB (2\xD716GB) 3200MHz","Corvex","electronics","New",54.99,109.99,4.99,22,!1,`Dual-channel 32GB kit (2\xD716GB) of DDR4-3200 desktop memory with low-profile heat spreaders.

\u2022 CL16, 1.35V
\u2022 Intel XMP 2.0 ready
\u2022 Lifetime limited warranty`],["instant-film-camera-white","Instant Film Camera \u2013 White","Retrolux","electronics","Open Box",59.99,119.99,8.99,9,!0,`Point, shoot and hold a real print in seconds. Built-in flash, selfie mirror and a rechargeable battery. Open box \u2014 film not included.

\u2022 Auto exposure
\u2022 USB charging
\u2022 Uses standard instant film`],["aluminum-travel-tripod-60-inch",'Aluminum Travel Tripod \u2013 60"',"Stablo","electronics","New",18.99,39.99,7.99,25,!1,`Lightweight 60" tripod with a quick-release plate, bubble level and 3-way pan head. Folds down to 20" for travel.

\u2022 Supports up to 11 lb
\u2022 Phone clamp included
\u2022 Carry bag included`],["usb-c-charging-cable-3-pack","USB-C to USB-A Charging Cable, 6 ft (3-Pack)","Voltlink","electronics","New",8.99,19.99,3.99,60,!1,`Braided 6-foot USB-C to USB-A cables for phones, tablets and accessories. Fast-charge and data transfer supported.

\u2022 3A fast charging
\u2022 10,000+ bend lifespan
\u2022 3 cables per pack`],["2tb-internal-hard-drive","2TB Internal Hard Drive \u2013 7200 RPM","DataCore","electronics","Refurbished",34.99,79.99,5.99,12,!1,`Reliable 3.5" SATA hard drive for desktop storage upgrades and backups. Factory refurbished, zero bad sectors.

\u2022 2TB capacity, 7200 RPM
\u2022 256MB cache
\u2022 1-year warranty`],["mid-century-leather-sofa-cognac","Mid-Century Leather Sofa \u2013 Cognac","Hartwell Home","home-kitchen","Open Box",849,1599,149,1,!0,`Three-seat sofa in top-grain cognac leather with a solid wood frame and tapered legs. Open box, never used; minor scuff on the back rail.

\u2022 84" W \xD7 36" D \xD7 34" H
\u2022 Freight delivery or free local pickup
\u2022 Assembly: attach legs only`],["velvet-accent-chair-mango","Velvet Accent Chair \u2013 Mango","Hartwell Home","home-kitchen","New",179,349,39.99,3,!1,`Plush mango velvet accent chair with a curved back, walnut-finish legs and brass details.

\u2022 32" W \xD7 22" D \xD7 27" H
\u2022 Supports up to 300 lb
\u2022 Arrives fully assembled`],["velvet-loveseat-navy","Velvet Loveseat \u2013 Navy","Hartwell Home","home-kitchen","New",429,899,99,2,!0,`Deep navy velvet loveseat with channel-tufted seat cushions and slim gold legs. A statement piece for small spaces.

\u2022 86" W \xD7 40" D \xD7 31" H
\u2022 Kiln-dried hardwood frame
\u2022 Freight delivery or local pickup`],["upholstered-armchair-slate-blue","Upholstered Armchair \u2013 Slate Blue","Hartwell Home","home-kitchen","Like New",139,279,49.99,2,!1,`Comfortable tufted armchair in slate blue fabric with wood legs. Floor model in like-new condition.

\u2022 28" W \xD7 30" D \xD7 33" H
\u2022 Stain-resistant fabric`],["porcelain-teacup-saucer-set","Porcelain Teacup & Saucer Set (Set of 4)","Maison Blanc","home-kitchen","New",22.99,48,7.99,16,!1,`Fine white porcelain teacups with matching saucers. Dishwasher- and microwave-safe.

\u2022 8 oz cups
\u2022 Set of 4 cups + 4 saucers
\u2022 Gift-boxed`],["glass-serving-dish-with-dome","Glass Serving Dish with Dome Lid","Maison Blanc","home-kitchen","New",26.99,59,9.99,8,!1,`Hand-blown glass serving dish with a tall dome lid and gold-leaf rim \u2014 for olives, pastries or cheese.

\u2022 11" diameter
\u2022 Food-safe glass
\u2022 Hand wash`],["insulated-water-bottle-24-oz","Insulated Stainless Water Bottle \u2013 24 oz","Trailmate","home-kitchen","New",12.99,29.99,4.99,45,!1,`Double-wall vacuum-insulated bottle keeps drinks cold for 24 hours or hot for 12.

\u2022 18/8 stainless steel
\u2022 Leak-proof screw cap
\u2022 BPA-free`],["white-oak-side-table","Scandinavian Side Table \u2013 White & Oak","Nordhus","home-kitchen","New",69,149,24.99,5,!1,`Round side table with a white top and solid oak splayed legs. Perfect as a nightstand or sofa side table.

\u2022 18" diameter \xD7 20" H
\u2022 Tool-free leg assembly`],["matte-white-pendant-light","Matte White Pendant Light","Nordhus","home-kitchen","Open Box",34.99,89,12.99,11,!1,`Minimal dome pendant in matte white metal with an adjustable 6 ft cord. Great over kitchen islands.

\u2022 12" shade diameter
\u2022 E26 bulb (not included)
\u2022 Hardwire or plug-in kit`],["glass-bud-vase-faux-stems","Glass Bud Vase with Faux Stems","Maison Blanc","home-kitchen","New",14.99,34,6.99,20,!1,`Clear glass bud vase with realistic faux flower stems \u2014 decor that never needs water.

\u2022 8" tall
\u2022 Stems removable`],["portable-steel-toolbox-20-inch",'Portable Steel Toolbox \u2013 20"',"IronLine","tools","New",24.99,49.99,12.99,12,!0,`Heavy-gauge steel toolbox with a removable tray, padlock eye and two metal latches. Powder-coated red finish.

\u2022 20" \xD7 8.5" \xD7 9"
\u2022 Removable cantilever tray
\u2022 Padded carry handle`],["screwdriver-set-6-piece","Screwdriver Set \u2013 6 Piece","IronLine","tools","New",11.99,24.99,5.99,30,!1,`Six essential screwdrivers \u2014 3 Phillips, 3 slotted \u2014 with chrome-vanadium shafts and cushioned two-tone grips.

\u2022 Magnetic tips
\u2022 Hanging storage rack included`],["tape-measure-25-ft","Tape Measure \u2013 25 ft","IronLine","tools","New",7.99,17.99,4.99,40,!1,`Rugged 25 ft tape with a 1" wide blade, slide lock and belt clip. Rubber over-mold survives drops.

\u2022 Standout up to 11 ft
\u2022 Magnetic end hook`],["garden-hand-trowel","Garden Hand Trowel","GreenRow","tools","New",5.99,14.99,4.99,35,!1,`Rust-resistant garden trowel with depth markings and a comfortable grip for planting and potting.

\u2022 Stainless steel blade
\u2022 Hanging hole`],["robot-vacuum-cleaner","Robot Vacuum Cleaner \u2013 App & Voice Control","Cleanbot","appliances","Open Box",119,299,19.99,6,!0,`Slim robot vacuum with LiDAR mapping, 2700Pa suction and 150-minute runtime. Open box, all accessories included.

\u2022 Maps rooms and no-go zones
\u2022 Auto-returns to charge
\u2022 Works with voice assistants`],["countertop-microwave-1-1-cu-ft","Countertop Microwave \u2013 1.1 cu ft","HomeChef","appliances","Open Box",79,149,29.99,4,!0,`1000-watt microwave with 10 power levels, one-touch presets and a turntable. Open box with light shelf wear.

\u2022 1.1 cu ft capacity
\u2022 Child lock
\u2022 Stainless-look door`],["stainless-electric-kettle-1-7l","Stainless Electric Kettle \u2013 1.7 L","HomeChef","appliances","New",24.99,49.99,9.99,14,!1,`Fast-boil 1500W kettle with a brushed stainless body, water window and auto shut-off.

\u2022 1.7 L capacity
\u2022 Boil-dry protection
\u2022 360\xB0 swivel base`],["stainless-2-slice-toaster","Stainless 2-Slice Toaster","HomeChef","appliances","New",22.99,44.99,9.99,10,!1,`Wide-slot toaster with 7 shade settings plus bagel, defrost and cancel functions.

\u2022 1.5" wide slots
\u2022 Removable crumb tray`],["glass-door-beverage-cooler","Glass-Door Beverage Cooler","ChillPro","appliances","Scratch & Dent",649,1499,199,1,!0,`Commercial-grade single-door beverage cooler with LED lighting and adjustable shelves. Scratch & dent: small dent on the left side panel, fully working.

\u2022 12 cu ft
\u2022 33\u201341\xB0F temperature range
\u2022 Freight delivery or local pickup`],["vintage-tin-toy-car","Vintage-Style Tin Toy Car","Tinworks","toys","New",19.99,39.99,6.99,12,!1,`Collectible tin toy car with a glossy two-tone finish and rolling wheels \u2014 a nostalgic gift or desk display.

\u2022 7" long
\u2022 Display piece, ages 14+`],["weighted-wooden-chess-set","Weighted Chess Set with Board","Kingsgate","toys","New",34.99,79.99,9.99,7,!0,`Tournament-size chess set with weighted pieces and a 20" board. A great family game night upgrade.

\u2022 3.75" king
\u2022 Felted piece bases
\u2022 Storage bag included`],["building-bricks-set-500-piece","Building Bricks Set \u2013 500 Pieces","BrickBox","toys","New",17.99,39.99,7.99,24,!1,`Classic building bricks in 7 colors, compatible with major brick brands.

\u2022 500 pieces
\u2022 Idea booklet included
\u2022 Ages 4+`],["cruiser-skateboard-22-inch",'Cruiser Skateboard \u2013 22"',"Rollr","toys","New",19.99,44.99,9.99,9,!1,`Compact 22" plastic cruiser with grippy deck texture and smooth 59mm wheels.

\u2022 ABEC-7 bearings
\u2022 Supports up to 200 lb`],["aluminum-road-bike-54cm","Aluminum Road Bike \u2013 54 cm","Veloce","other","Used \u2013 Good",449,1099,89,1,!1,`Lightweight aluminum road bike with carbon fork, 18-speed drivetrain and dual-pivot brakes. Tuned up and ready to ride; light cosmetic wear.

\u2022 54 cm frame (fits 5'6"\u20135'10")
\u2022 700\xD725c tires`],["4-person-dome-tent","4-Person Dome Tent","Trailmate","other","Open Box",59.99,149.99,14.99,6,!0,`Weather-ready 4-person dome tent with full rainfly, two doors and gear loft. Sets up in about 10 minutes.

\u2022 9' \xD7 7' floor
\u2022 Carry bag included`],["commuter-backpack-blue","Commuter Backpack \u2013 25 L","Trailmate","other","New",24.99,59,7.99,18,!1,`Everyday backpack with padded laptop sleeve, bungee front and breathable back panel.

\u2022 Fits 15" laptops
\u2022 Water-resistant fabric
\u2022 Available in blue or gray`],["messenger-bag-black","Laptop Messenger Bag","Trailmate","other","New",22.99,45,7.99,10,!1,`Structured messenger bag with padded laptop compartment and organizer pockets.

\u2022 Fits 15" laptops
\u2022 Adjustable shoulder strap`],["rolling-duffle-bag","Rolling Duffle Bag \u2013 80 L","Trailmate","other","New",34.99,74,12.99,7,!1,`Large wheeled duffle with a telescoping handle and U-shaped main compartment.

\u2022 80 L capacity
\u2022 Durable ripstop`],["dual-time-analog-watch","Dual-Time Analog Watch","Harbor & Co.","other","Open Box",27.99,55,4.99,6,!1,`Two-dial analog watch with a brown leather strap \u2014 set a second time zone for travel.

\u2022 Water-resistant to 50 m
\u2022 Stainless case`],["resistance-band-kit","Resistance Band Kit","FitCore","other","New",11.99,22,5.99,20,!1,`Complete home-workout band kit with handles, ankle straps, door anchor and carry bag.

\u2022 5 resistance levels
\u2022 Stackable up to 150 lb`],["indoor-outdoor-basketball","Indoor/Outdoor Basketball \u2013 Size 7","Courtline","other","New",14.99,34.99,8.99,15,!1,`Composite leather basketball with deep channels for grip on any court.

\u2022 Official size 7
\u2022 Ships deflated`],["live-bonsai-tree","Live Juniper Bonsai Tree","GreenRow","other","New",24.99,49.99,14.99,4,!1,`Hand-shaped juniper bonsai in a ceramic pot. Arrives with care instructions. Local pickup recommended.

\u2022 6\u20138 years old
\u2022 10" tall`]],at=Date.UTC(2026,8,20),ye=tt.map((e,t)=>{let[a,n,s,i,o,r,c,d,p,m,y]=e,L=(be[a]||[]).map((S,u)=>({sm:`img/p/${a}-${S}-sm.webp`,lg:`img/p/${a}-${S}-lg.webp`,alt:u===0?n:`${n} \u2013 view ${u+1}`}));return{id:"p-"+String(t+1).padStart(3,"0"),slug:a,title:n,brand:s,categoryId:et(i),condition:o,price:r,originalPrice:c,shipping:d,inventory:p,bestDeal:m,published:!0,noShipping:a==="live-bonsai-tree",upc:Xe(t+11),description:y,images:L,createdAt:new Date(at-t*36e5*7).toISOString()}});function we(){throw new Error("Database backend not configured")}var Q="mlgroup-db-v1";function $e(){return{v:1,products:JSON.parse(JSON.stringify(ye)),categories:JSON.parse(JSON.stringify(ve)),settings:{..._},orders:[],offers:[],inquiries:[],customers:[],nextOrder:1001,adminHash:null}}var ke={db:null,async open(){return this.db?this.db:(this.db=await new Promise((e,t)=>{let a=indexedDB.open("mlgroup",1);a.onupgradeneeded=()=>a.result.createObjectStore("kv"),a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)}),this.db)},async get(e){let t=await this.open();return new Promise((a,n)=>{let s=t.transaction("kv").objectStore("kv").get(e);s.onsuccess=()=>a(s.result),s.onerror=()=>n(s.error)})},async set(e,t){let a=await this.open();return new Promise((n,s)=>{let i=a.transaction("kv","readwrite");i.objectStore("kv").put(t,e),i.oncomplete=()=>n(),i.onerror=()=>s(i.error)})}};function xe(){let e=null,t=null,a=()=>{clearTimeout(t),t=setTimeout(async()=>{try{await ke.set(Q,e)}catch{T.set(Q,e)}},60)},n=i=>e.products.find(o=>o.id===i),s=(i,o)=>{let r=i||"product",c=2;for(;e.products.some(d=>d.slug===r&&d.id!==o);)r=`${i}-${c++}`;return r};return{kind:"local",async init(){try{e=await ke.get(Q)}catch{e=null}e||(e=T.get(Q,null)),(!e||!e.products)&&(e=$e()),e.adminHash||(e.adminHash=await N("MLGROUP")),a()},catalog(){return{products:e.products,categories:e.categories,settings:e.settings}},async placeOrder(i){let o=[];for(let u of i.items){let b=n(u.id),x=Math.max(1,Math.floor(u.qty));if(!b||!b.published||b.inventory<=0)throw new Error(`${b?b.title:"An item in your cart"} is no longer available.`);if(b.inventory<x)throw new Error(`Only ${b.inventory} left of \u201C${b.title}\u201D. Please lower the quantity.`);o.push({p:b,qty:x})}let r=i.fulfillment==="pickup",c=o.find(({p:u})=>u.noShipping);if(!r&&c)throw new Error(`\u201C${c.p.title}\u201D is available for pick up only. Choose local pickup.`);let d=o.map(({p:u,qty:b})=>({productId:u.id,slug:u.slug,title:u.title,image:u.images[0]||null,price:u.price,qty:b,shipping:r?0:u.shipping})),p=O(d.reduce((u,b)=>u+b.price*b.qty,0)),m=O(d.reduce((u,b)=>u+b.shipping,0));o.forEach(({p:u,qty:b})=>{u.inventory-=b});let y=null,L=(i.customer.email||"").trim().toLowerCase();if(i.createAccount&&i.createAccount.password){let u=e.customers.find(b=>b.email===L);u||(u={id:D(),email:L,name:i.customer.name,phone:i.customer.phone,pw:await N(i.createAccount.password),createdAt:new Date().toISOString()},e.customers.push(u)),y=u.id,T.set("ml-customer",u.id)}else{let u=T.get("ml-customer",null),b=u&&e.customers.find(x=>x.id===u&&x.email===L);b&&(y=b.id)}let S={id:D(),number:e.nextOrder++,createdAt:new Date().toISOString(),status:"new",fulfillment:i.fulfillment,payment:i.payment,customer:{name:i.customer.name,email:L,phone:i.customer.phone},address:r?null:i.address,notes:i.notes||"",items:d,subtotal:p,shippingTotal:m,total:O(p+m),customerId:y};return e.orders.unshift(S),a(),S},async getOrder(i){return e.orders.find(o=>o.id===i)||null},async submitOffer(i){let o=n(i.productId);if(!o)throw new Error("This product is no longer available.");e.offers.unshift({id:D(),productId:o.id,productTitle:o.title,productSlug:o.slug,productImage:o.images[0]||null,listPrice:o.price,name:i.name,phone:i.phone,amount:O(i.amount),status:"new",createdAt:new Date().toISOString()}),a()},async submitInquiry(i){e.inquiries.unshift({id:D(),status:"new",createdAt:new Date().toISOString(),...i}),a()},async register({email:i,password:o,name:r,phone:c}){if(i=i.trim().toLowerCase(),e.customers.some(p=>p.email===i))throw new Error("An account with this email already exists. Try signing in.");let d={id:D(),email:i,name:r,phone:c,pw:await N(o),createdAt:new Date().toISOString()};return e.customers.push(d),a(),T.set("ml-customer",d.id),{email:d.email,name:d.name,phone:d.phone}},async login({email:i,password:o}){i=i.trim().toLowerCase();let r=e.customers.find(c=>c.email===i);if(!r||r.pw!==await N(o))throw new Error("Email or password is incorrect.");return T.set("ml-customer",r.id),{email:r.email,name:r.name,phone:r.phone}},async logout(){T.del("ml-customer")},async me(){let i=T.get("ml-customer",null),o=i&&e.customers.find(r=>r.id===i);return o?{email:o.email,name:o.name,phone:o.phone,orders:e.orders.filter(r=>r.customerId===o.id)}:null},admin:{async login(i){if(await N(i)!==e.adminHash)throw new Error("That password is incorrect.");Y.set("ml-admin",1)},async logout(){Y.del("ml-admin")},async session(){return!!Y.get("ml-admin",0)},async changePassword(i){e.adminHash=await N(i),a()},async products(){return e.products},async saveProduct(i){let o=i.id?n(i.id):null,r={...o||{},...i};return r.slug=s(K(i.slug||i.title),r.id),o?Object.assign(o,r):(r.id=D(),r.createdAt=new Date().toISOString(),e.products.unshift(r)),r.updatedAt=new Date().toISOString(),a(),o||r},async deleteProduct(i){e.products=e.products.filter(o=>o.id!==i),a()},async patchProduct(i,o){let r=n(i);return r&&Object.assign(r,o),a(),r},async adjustInventory(i,o){let r=n(i);return r&&(r.inventory=Math.max(0,(r.inventory||0)+o)),a(),r},async orders(){return e.orders},async updateOrder(i,o){let r=e.orders.find(c=>c.id===i);if(r)return o.status==="cancelled"&&r.status!=="cancelled"&&o.restock&&r.items.forEach(c=>{let d=n(c.productId);d&&(d.inventory+=c.qty)}),delete o.restock,Object.assign(r,o),a(),r},async offers(){return e.offers},async updateOffer(i,o){let r=e.offers.find(c=>c.id===i);r&&Object.assign(r,o),a()},async inquiries(){return e.inquiries},async updateInquiry(i,o){let r=e.inquiries.find(c=>c.id===i);r&&Object.assign(r,o),a()},async deleteInquiry(i){e.inquiries=e.inquiries.filter(o=>o.id!==i),a()},async saveCategory(i){if(i.id){let o=e.categories.find(r=>r.id===i.id);Object.assign(o,i,{slug:K(i.slug||i.name)})}else e.categories.push({id:D(),name:i.name,slug:K(i.slug||i.name),sort:e.categories.length+1});a()},async deleteCategory(i){e.categories=e.categories.filter(o=>o.id!==i),e.products.forEach(o=>{o.categoryId===i&&(o.categoryId=null)}),a()},async reorderCategories(i){i.forEach((o,r)=>{let c=e.categories.find(d=>d.id===o);c&&(c.sort=r+1)}),a()},async saveSettings(i){Object.assign(e.settings,i),a()},async uploadImage(i){let[o,r]=await Promise.all([ie(i,1400),ie(i,520)]);return{lg:await ne(o),sm:await ne(r)}},async removeImage(){},async exportData(){return JSON.stringify(e,null,1)},async importData(i){let o=JSON.parse(i);if(!o.products)throw new Error("That file is not an ML Group backup.");e=o,a()},async reset(){let i=e.adminHash;e=$e(),e.adminHash=i,a()}}}}var P=null,W={products:[],categories:[],settings:{..._}},g={get kind(){return P?P.kind:"local"},async init(){let e=M.cfg||{};if(e.supabaseUrl&&e.supabaseKey&&e.routing!=="memory")try{P=we(e),await P.init()}catch(t){console.warn("Store database unreachable, using built-in catalog",t),P=xe(),await P.init(),P.offline=!0}else P=xe(),await P.init();this.refresh()},get offline(){return!!(P&&P.offline)},refresh(){W=P.catalog()},async reload(){P.reload&&await P.reload(),this.refresh()},settings(){return W.settings||_},categories(){return[...W.categories].sort((e,t)=>(e.sort||0)-(t.sort||0))},category(e){return W.categories.find(t=>t.id===e||t.slug===e)||null},products(){return W.products.filter(e=>e.published&&e.inventory>0)},product(e){return this.products().find(t=>t.slug===e)||null},productById(e){return W.products.find(t=>t.id===e)||null},placeOrder:e=>P.placeOrder(e).then(t=>(g.refresh(),t)),getOrder:e=>P.getOrder(e),submitOffer:e=>P.submitOffer(e),submitInquiry:e=>P.submitInquiry(e),account:{register:e=>P.register(e),login:e=>P.login(e),logout:()=>P.logout(),me:()=>P.me()},get admin(){return P.admin}},Se="ml-cart",B={lines(){return T.get(Se,[]).filter(e=>e&&e.id&&e.qty>0)},save(e){T.set(Se,e),window.dispatchEvent(new CustomEvent("cart:change"))},items(){return this.lines().map(e=>{let t=g.productById(e.id);return!t||!t.published||t.inventory<=0?null:{product:t,qty:Math.min(e.qty,t.inventory)}}).filter(Boolean)},count(){return this.items().reduce((e,t)=>e+t.qty,0)},subtotal(){return O(this.items().reduce((e,t)=>e+t.product.price*t.qty,0))},add(e,t=1){let a=g.productById(e);if(!a)return;let n=this.lines(),s=n.find(i=>i.id===e);s?s.qty=Math.min(a.inventory,s.qty+t):n.push({id:e,qty:Math.min(a.inventory,t)}),this.save(n)},set(e,t){let a=g.productById(e),n=this.lines().map(s=>s.id===e?{...s,qty:Math.max(1,Math.min(a?a.inventory:t,t))}:s);this.save(n)},remove(e){this.save(this.lines().filter(t=>t.id!==e))},clear(){this.save([])}};function re({title:e,description:t,path:a="/",image:n,jsonld:s,noindex:i}={}){let o=g.settings(),r=e?`${e} | ${o.storeName||"ML Group"}`:`${o.storeName||"ML Group"} \u2014 Big Savings. Great Products.`;document.title=r;let c=(m,y,L)=>{let S=document.head.querySelector(m);if(!S){S=document.createElement("meta");let[u,b]=m.match(/\[(.+?)="(.+?)"\]/).slice(1);S.setAttribute(u,b),document.head.appendChild(S)}S.setAttribute(y,L)},d=t||"Discounted electronics, home goods, tools, appliances and more for retail and wholesale buyers. Fast shipping and free local pickup.";if(c('meta[name="description"]',"content",d),c('meta[property="og:title"]',"content",r),c('meta[property="og:description"]',"content",d),M.routing==="path"){let m=M.root+a.replace(/^\//,"");c('meta[property="og:url"]',"content",m);let y=document.head.querySelector('link[rel="canonical"]');y||(y=document.createElement("link"),y.rel="canonical",document.head.appendChild(y)),y.href=m.split("?")[0]}n&&c('meta[property="og:image"]',"content",R(n)),c('meta[name="robots"]',"content",i?"noindex":"index,follow");let p=document.getElementById("ld-page");s?(p||(p=document.createElement("script"),p.type="application/ld+json",p.id="ld-page",document.head.appendChild(p)),p.textContent=JSON.stringify(s)):p&&p.remove()}function ee(e,t=""){let a=w(".toasts");a||(a=document.createElement("div"),a.className="toasts",a.setAttribute("role","status"),a.setAttribute("aria-live","polite"),document.body.appendChild(a));let n=document.createElement("div");n.className="toast "+t,n.innerHTML=`${h(t==="err"?"close":"check","icon-sm")}<span>${l(e)}</span>`,a.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transition="opacity .3s",setTimeout(()=>n.remove(),320)},2600)}var st=[["/","Home"],["/products","Products"],["#cat","Categories"],["/wholesale","Wholesale"],["/about","About"],["/contact","Contact"]];function it(){let e={};return g.products().forEach(t=>{e[t.categoryId]=(e[t.categoryId]||0)+1}),e}function Ce(){let e=g.settings(),t=it(),n=g.categories().map(r=>`<a href="${f("/categories/"+r.slug)}">${l(r.name)} <span class="count">${t[r.id]||0}</span></a>`).join(""),s=st.map(([r,c])=>r==="#cat"?`<li class="nav-dd"><button class="nav-btn" type="button" aria-expanded="false" aria-controls="dd-cats" data-dd>Categories ${h("down")}</button>
        <div class="dd-panel" id="dd-cats">${n}<hr><a href="${f("/categories")}">All categories ${h("arrow","icon-sm")}</a></div></li>`:`<li><a href="${f(r)}" data-nav="${r}">${c}</a></li>`).join(""),o=String(e.announcement||"").split("\xB7").map(r=>r.trim()).filter(Boolean).map((r,c)=>`${c?'<span class="sep hide-sm" aria-hidden="true">\xB7</span>':""}<span class="${c?"hide-sm":""}">${c===0?`<b>${l(r)}</b>`:l(r)}</span>`).join("");return`
  <a class="skip-link" href="#main">Skip to content</a>
  ${o?`<div class="announce"><div class="wrap">${o}</div></div>`:""}
  <header class="site-header on-ink">
    <div class="wrap header-row">
      <a class="logo" href="${f("/")}" aria-label="ML Group home">${J()}</a>
      <nav class="main-nav" aria-label="Main"><ul>${s}</ul></nav>
      <div class="header-search">${Me("hs")}</div>
      <div class="header-actions">
        <button class="icon-btn only-mobile" type="button" aria-label="Search" aria-expanded="false" aria-controls="mobile-search" data-msearch>${h("search")}</button>
        <a class="icon-btn" href="${f("/account")}" aria-label="Account">${h("user")}</a>
        <button class="icon-btn" type="button" aria-label="Cart" data-open-cart>${h("bag")}<span class="cart-count" data-cart-count hidden>0</span></button>
        <button class="icon-btn only-mobile" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu-sheet" data-menu>${h("menu")}</button>
      </div>
    </div>
    <div class="mobile-search" id="mobile-search" hidden>${Me("ms")}</div>
  </header>`}function Pe(){let e=g.settings(),t=g.categories();return`
  <div class="overlay" data-overlay="menu"></div>
  <aside class="sheet left menu-sheet" id="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="sheet-head"><a class="logo" href="${f("/")}" aria-label="ML Group home">${J()}</a><button class="icon-btn" type="button" aria-label="Close menu" data-close-menu>${h("close")}</button></div>
    <div class="sheet-body">
      <ul class="menu-list">
        <li><a href="${f("/")}">Home</a></li>
        <li><a href="${f("/products")}">Products ${h("right","icon-sm")}</a></li>
        <li><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-cats">Categories ${h("down")}</button>
          <ul class="menu-sub" id="menu-cats" hidden>${t.map(a=>`<li><a href="${f("/categories/"+a.slug)}">${l(a.name)}</a></li>`).join("")}<li><a href="${f("/categories")}">All categories</a></li></ul></li>
        <li><a href="${f("/products?deals=1")}">Best Deals ${h("right","icon-sm")}</a></li>
        <li><a href="${f("/wholesale")}">Wholesale ${h("right","icon-sm")}</a></li>
        <li><a href="${f("/about")}">About ${h("right","icon-sm")}</a></li>
        <li><a href="${f("/contact")}">Contact ${h("right","icon-sm")}</a></li>
        <li><a href="${f("/account")}">My account ${h("right","icon-sm")}</a></li>
      </ul>
      <div class="menu-contact">
        <span class="eyebrow">Call or text</span>
        <a href="${H(e.phone)}">${l(e.phone)}</a>
        <span class="muted">${h("store","icon-sm")} Local pickup: ${l(e.city)}, ${l(e.state)}</span>
      </div>
    </div>
  </aside>`}function Te(){let e=g.settings(),t=new Date().getFullYear();return`
  <footer class="site-footer on-ink">
    <div class="wrap footer-grid">
      <div class="f-brand">
        <a class="logo" href="${f("/")}" aria-label="ML Group home">${J()}</a>
        <p>Discounted products for retail customers and wholesale buyers. New deals every week, shipped fast or ready for local pickup.</p>
        <div class="f-ship"><b>${h("truck","icon-sm")} Shipping</b><span>Flat shipping price shown on every product. Orders ship in 1\u20132 business days.</span><b>${h("store","icon-sm")} Local pickup always available</b><span>${l(e.pickupHours)}</span></div>
      </div>
      <div class="f-col"><h2>Shop</h2><ul>
        <li><a href="${f("/products")}">All products</a></li>
        <li><a href="${f("/products?deals=1")}">Best deals</a></li>
        <li><a href="${f("/categories")}">Categories</a></li>
        <li><a href="${f("/wholesale")}">Wholesale</a></li>
      </ul></div>
      <div class="f-col"><h2>Help</h2><ul>
        <li><a href="${f("/shipping-policy")}">Shipping &amp; pickup</a></li>
        <li><a href="${f("/refund-policy")}">Refund policy</a></li>
        <li><a href="${f("/account")}">Order history</a></li>
        <li><a href="${f("/about")}">About ML Group</a></li>
        <li><a href="${f("/contact")}">Contact us</a></li>
      </ul></div>
      <div class="f-col"><h2>Contact</h2><ul class="f-contact">
        <li>${h("phone","icon-sm")}<a href="${H(e.phone)}">${l(e.phone)}</a></li>
        <li>${h("mail","icon-sm")}<a href="mailto:${l(e.email)}">${l(e.email)}</a></li>
        <li>${h("pin","icon-sm")}<span>${l(e.address1)}<br>${l(e.city)}, ${l(e.state)} ${l(e.zip)}</span></li>
        <li>${h("clock","icon-sm")}<span>${l(e.pickupHours)}</span></li>
      </ul></div>
    </div>
    <div class="footer-bottom"><div class="wrap">
      <span>\xA9 ${t} ML Group. All rights reserved.</span>
      <nav aria-label="Footer"><a href="${f("/refund-policy")}">Refund Policy</a><a href="${f("/shipping-policy")}">Shipping</a><a href="${f("/contact")}">Contact</a><a class="admin-link" href="${f("/admin")}">${h("lock","icon-sm")} Admin</a></nav>
    </div></div>
  </footer>`}function nt(e,{save:t=!1}={}){let a=q(e);return`<div class="price"><span class="now tabnum">${$(e.price)}</span>${a?`<s class="was tabnum">${$(e.originalPrice)}</s>`:""}${t&&a?`<span class="save">Save ${$(e.originalPrice-e.price)}</span>`:""}</div>`}function F(e,{eager:t=!1,sizes:a}={}){let n=q(e),s=f("/products/"+e.slug),i=e.images.length?e.images:[null],o=i.map((r,c)=>`<a href="${s}" ${c?'tabindex="-1" aria-hidden="true"':`aria-label="${l(e.title)}"`}>${A(r,{alt:c?"":e.title,eager:t&&c===0,sizes:a})}</a>`).join("");return`<article class="card" data-pid="${e.id}">
    <div class="card-media" data-carousel>
      <div class="track">${o}</div>
      ${n?`<span class="badge">-${n}%</span>`:""}
      ${e.bestDeal?'<span class="badge-deal">Best deal</span>':""}
      ${i.length>1?`<button class="car-btn prev" type="button" aria-label="Previous photo" data-car="-1">${h("left","icon-sm")}</button><button class="car-btn next" type="button" aria-label="Next photo" data-car="1">${h("right","icon-sm")}</button><div class="dots">${i.map((r,c)=>`<i class="${c?"":"on"}"></i>`).join("")}</div>`:""}
    </div>
    <div class="card-body">
      <p class="card-cond">${l(e.condition)}</p>
      <h3 class="card-title"><a href="${s}">${l(e.title)}</a></h3>
      ${nt(e)}
      <ul class="card-ship"><li>${h("store","icon-sm")} Available for pick up</li>${e.noShipping?"":`<li>${h("truck","icon-sm")} Available for shipping${e.shipping>0?` \xB7 ${$(e.shipping)}`:" \xB7 Free"}</li>`}</ul>
      ${e.inventory<=3?`<p class="stock-low">Only ${e.inventory} left</p>`:""}
      <div class="card-actions">
        <button class="btn" type="button" data-offer="${e.id}">Make Offer</button>
        <button class="btn btn-primary" type="button" data-add="${e.id}">Add to Cart</button>
      </div>
    </div>
  </article>`}function U(e=document){E("[data-carousel]",e).forEach(t=>{if(t._car)return;t._car=!0;let a=w(".track",t),n=E(".dots i",t),s=w(".g-count",t),i=t.closest(".gallery")?E(".g-thumbs button",t.closest(".gallery")):[],o=0,r=()=>{o=0;let c=Math.round(a.scrollLeft/Math.max(1,a.clientWidth));n.forEach((d,p)=>d.classList.toggle("on",p===c)),i.forEach((d,p)=>d.setAttribute("aria-current",p===c?"true":"false")),s&&(s.textContent=`${c+1} / ${a.children.length}`)};a.addEventListener("scroll",()=>{o||(o=requestAnimationFrame(r))},{passive:!0}),t.addEventListener("click",c=>{let d=c.target.closest("[data-car]");if(!d)return;c.preventDefault(),c.stopPropagation();let p=a.children.length,m=a.clientWidth,L=(Math.round(a.scrollLeft/m)+Number(d.dataset.car)+p)%p;a.scrollTo({left:L*m,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}),i.forEach((c,d)=>c.addEventListener("click",()=>a.scrollTo({left:d*a.clientWidth,behavior:"smooth"})))})}function Me(e){return`<form class="search" role="search" data-search action="${f("/products")}">
    <div class="search-field">${h("search")}
      <label class="sr-only" for="${e}-q">Search products</label>
      <input id="${e}-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Search products, brands, UPC\u2026" role="combobox" aria-expanded="false" aria-controls="${e}-pop" aria-autocomplete="list">
      <button class="search-clear" type="button" aria-label="Clear search" data-clear hidden>${h("close","icon-sm")}</button>
    </div>
    <div class="search-pop" id="${e}-pop" role="listbox" aria-label="Search suggestions"></div>
  </form>`}var I=e=>String(e||"").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"");function Z(e,t){let a=l(e);return t.filter(n=>n.length>1).forEach(n=>{a=a.replace(new RegExp("("+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig"),"<mark>$1</mark>")}),a}function le(e,t=99){let a=I(e).split(/\s+/).filter(Boolean);if(!a.length)return[];let n=Object.fromEntries(g.categories().map(i=>[i.id,i.name])),s=[];for(let i of g.products()){let o=I(i.title),r=I(i.brand),c=I(n[i.categoryId]),d=String(i.upc||""),p=`${o} ${r} ${c} ${d} ${I(i.condition)}`;if(!a.every(y=>p.includes(y)))continue;let m=0;a.forEach(y=>{o.startsWith(y)&&(m+=6),new RegExp("\\b"+y.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).test(o)&&(m+=3),r.startsWith(y)&&(m+=4),d&&d.startsWith(y)&&(m+=8),c.startsWith(y)&&(m+=2)}),s.push({p:i,score:m+(i.bestDeal?1:0)})}return s.sort((i,o)=>o.score-i.score).slice(0,t).map(i=>i.p)}function ot(e,t){let a=w("input",e),n=w(".search-pop",e),s=w("[data-clear]",e),i=-1,o=()=>E('[role="option"]',n),r=()=>{n.classList.remove("open"),a.setAttribute("aria-expanded","false"),i=-1,a.removeAttribute("aria-activedescendant")},c=p=>{let m=o();m.length&&(i=(p+m.length)%m.length,m.forEach((y,L)=>y.classList.toggle("active",L===i)),a.setAttribute("aria-activedescendant",m[i].id),m[i].scrollIntoView({block:"nearest"}))},d=()=>{let p=a.value.trim();if(s.hidden=!p,!p){r();return}let m=I(p).split(/\s+/).filter(Boolean),y=g.categories().filter(v=>m.every(k=>I(v.name).includes(k))),L=[...new Set(g.products().map(v=>v.brand).filter(Boolean))].filter(v=>m.every(k=>I(v).includes(k))).slice(0,4),S=le(p,6),u=a.id,b=0,x="";y.length&&(x+=`<div class="sp-group"><p class="sp-label">Categories</p><div class="sp-chips">${y.map(v=>`<a class="chip" role="option" id="${u}-o${b++}" href="${f("/categories/"+v.slug)}">${Z(v.name,m)}</a>`).join("")}</div></div>`),L.length&&(x+=`<div class="sp-group"><p class="sp-label">Brands</p><div class="sp-chips">${L.map(v=>`<a class="chip" role="option" id="${u}-o${b++}" href="${f("/products?q="+encodeURIComponent(v))}">${Z(v,m)}</a>`).join("")}</div></div>`),S.length&&(x+=`<div class="sp-group"><p class="sp-label">Products</p>${S.map(v=>`<a class="sp-item" role="option" id="${u}-o${b++}" href="${f("/products/"+v.slug)}">${A(v.images[0],{alt:"",sizes:"48px",w:48})}<span><span class="sp-name">${Z(v.title,m)}</span><span class="sp-meta">${l(v.brand||"")} \xB7 ${l(v.condition)}${/^\d{4,}$/.test(p)?` \xB7 UPC ${Z(v.upc,m)}`:""}</span></span><span class="sp-price tabnum">${$(v.price)}${q(v)?`<s>${$(v.originalPrice)}</s>`:""}</span></a>`).join("")}</div>`),x?x+=`<a class="sp-all" role="option" id="${u}-o${b++}" href="${f("/products?q="+encodeURIComponent(p))}">See all results for \u201C${l(p)}\u201D \u2192</a>`:x=`<p class="sp-empty">No matches for \u201C${l(p)}\u201D. Try a brand, category or UPC.</p>`,n.innerHTML=x,n.classList.add("open"),a.setAttribute("aria-expanded","true"),i=-1};a.addEventListener("input",d),a.addEventListener("focus",()=>{a.value.trim()&&d()}),a.addEventListener("keydown",p=>{p.key==="ArrowDown"?(p.preventDefault(),n.classList.contains("open")||d(),c(i+1)):p.key==="ArrowUp"?(p.preventDefault(),c(i-1)):p.key==="Escape"?r():p.key==="Enter"&&i>=0&&(p.preventDefault(),o()[i].click())}),s.addEventListener("click",()=>{a.value="",d(),a.focus()}),e.addEventListener("submit",p=>{p.preventDefault();let m=a.value.trim();r(),t("/products"+(m?"?q="+encodeURIComponent(m):"")),a.blur()}),n.addEventListener("click",p=>{if(p.target.closest("a")){r(),a.blur();let m=document.getElementById("mobile-search");m&&e.closest("#mobile-search")&&(m.hidden=!0,w("[data-msearch]").setAttribute("aria-expanded","false"))}}),document.addEventListener("click",p=>{e.contains(p.target)||r()})}var X=null;function rt(e){let t=w(".sheet.open");if(!t||e.key!=="Tab")return;let a=E('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',t).filter(n=>n.offsetParent!==null);a.length&&(e.shiftKey&&document.activeElement===a[0]?(e.preventDefault(),a[a.length-1].focus()):!e.shiftKey&&document.activeElement===a[a.length-1]&&(e.preventDefault(),a[0].focus()))}function oe(e){let t=document.getElementById(e);if(!t)return;X=document.activeElement,z(!0),t.classList.add("open");let a=w(`[data-overlay="${e==="cart-sheet"?"cart":"menu"}"]`);a&&a.classList.add("open"),document.documentElement.style.overflow="hidden",setTimeout(()=>{let n=w("button, a[href]",t);n&&n.focus()},60),E("[data-menu]").forEach(n=>n.setAttribute("aria-expanded",e==="menu-sheet"?"true":"false"))}function z(e){let t=w(".sheet.open");E(".sheet.open, .overlay.open").forEach(a=>a.classList.remove("open")),document.documentElement.style.overflow="",E("[data-menu]").forEach(a=>a.setAttribute("aria-expanded","false")),t&&!e&&X&&document.contains(X)&&X.focus()}function qe(){return`<div class="overlay" data-overlay="cart"></div>
  <aside class="sheet right" id="cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <div class="sheet-head"><h2 id="cart-title">Your cart</h2><button class="icon-btn" type="button" aria-label="Close cart" data-close-cart>${h("close")}</button></div>
    <div class="sheet-body" data-cart-body></div>
    <div class="sheet-foot" data-cart-foot></div>
  </aside>`}function Le(){let e=w("[data-cart-body]"),t=w("[data-cart-foot]"),a=B.items(),n=a.reduce((s,i)=>s+i.qty,0);if(E("[data-cart-count]").forEach(s=>{s.textContent=n,s.hidden=!n}),!!e){if(w("#cart-title").textContent=n?`Your cart (${n})`:"Your cart",!a.length){e.innerHTML=`<div class="cart-empty">${h("bag")}<p><b>Your cart is empty.</b></p><p class="muted">Find something good in today\u2019s deals.</p><a class="btn btn-primary" href="${f("/products?deals=1")}" data-close-cart>Browse Deals</a></div>`,t.innerHTML="";return}e.innerHTML=`<ul class="cart-items">${a.map(({product:s,qty:i})=>`
    <li class="cart-item" data-line="${s.id}">
      <a href="${f("/products/"+s.slug)}" data-close-cart tabindex="-1" aria-hidden="true">${A(s.images[0],{alt:"",sizes:"84px"})}</a>
      <div>
        <div class="ci-top"><a class="ci-title" href="${f("/products/"+s.slug)}" data-close-cart>${l(s.title)}</a><span class="ci-price tabnum">${$(s.price*i)}</span></div>
        <p class="ci-meta">${l(s.condition)} \xB7 ${$(s.price)} each${s.inventory<=5?` \xB7 ${s.inventory} available`:""}</p>
        <div class="ci-row">
          <div class="qty" role="group" aria-label="Quantity for ${l(s.title)}">
            <button type="button" aria-label="Decrease quantity" data-qty="-1" ${i<=1?"disabled":""}>${h("minus","icon-sm")}</button>
            <input type="number" inputmode="numeric" min="1" max="${s.inventory}" value="${i}" aria-label="Quantity" data-qty-input>
            <button type="button" aria-label="Increase quantity" data-qty="1" ${i>=s.inventory?"disabled":""}>${h("plus","icon-sm")}</button>
          </div>
          <button class="ci-remove" type="button" data-remove>${h("trash","icon-sm")} Remove</button>
        </div>
      </div>
    </li>`).join("")}</ul>`,t.innerHTML=`<div class="cart-sum"><div class="row total"><span>Subtotal</span><span class="tabnum">${$(B.subtotal())}</span></div></div>
    <p class="cart-note">${h("truck","icon-sm")} Shipping or free local pickup \u2014 choose at checkout.</p>
    <a class="btn btn-primary btn-lg btn-block" href="${f("/checkout")}" data-close-cart>Checkout</a>
    <button class="btn btn-block" type="button" data-close-cart>Continue shopping</button>`}}function lt(){let e=w("#cart-sheet");e.addEventListener("click",t=>{let a=t.target.closest("[data-line]"),n=t.target.closest("[data-qty]");if(n&&a){let s=B.items().find(i=>i.product.id===a.dataset.line);s&&B.set(s.product.id,s.qty+Number(n.dataset.qty))}t.target.closest("[data-remove]")&&a&&B.remove(a.dataset.line)}),e.addEventListener("change",t=>{if(t.target.matches("[data-qty-input]")){let a=t.target.closest("[data-line]");B.set(a.dataset.line,Math.max(1,parseInt(t.target.value,10)||1))}}),window.addEventListener("cart:change",()=>{Le(),E("[data-cart-count]").forEach(t=>{t.classList.remove("bump"),t.offsetWidth,t.classList.add("bump")})}),Le()}function ce(e,t=1){let a=g.productById(e);if(!a||a.inventory<=0){ee("Sorry, that item just sold out.","err");return}B.add(e,t),oe("cart-sheet")}function ct(e){let t=g.productById(e);if(!t)return;let a=w("#offer-dialog");a||(a=document.createElement("dialog"),a.id="offer-dialog",a.className="modal",a.setAttribute("aria-labelledby","offer-title"),document.body.appendChild(a)),a.innerHTML=`
    <div class="modal-head"><h2 id="offer-title">Make an offer</h2><button class="icon-btn" type="button" aria-label="Close" data-close-dialog>${h("close")}</button></div>
    <form class="modal-body form" novalidate data-offer-form>
      <div class="offer-item">${A(t.images[0],{alt:"",sizes:"64px"})}<div><b>${l(t.title)}</b><span>Listed at <b class="tabnum" style="display:inline">${$(t.price)}</b> \xB7 ${l(t.condition)}</span></div></div>
      <div class="field"><label for="of-name">Name</label><input id="of-name" name="name" autocomplete="name" required maxlength="80"></div>
      <div class="field"><label for="of-phone">Phone number</label><input id="of-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(555) 555-5555" maxlength="24"></div>
      <div class="field"><label for="of-amount">Your offer</label><div class="money-input"><span>$</span><input id="of-amount" name="amount" type="number" inputmode="decimal" min="1" step="0.01" required placeholder="${Math.round(t.price*.85)}"></div><span class="hint">We usually reply by text within one business day.</span></div>
      <div class="hp" aria-hidden="true"><label for="of-web">Website</label><input id="of-web" name="website" tabindex="-1" autocomplete="off"></div>
      <p class="form-error" data-err hidden></p>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Submit offer</button>
    </form>`;let n=w("[data-offer-form]",a);n.addEventListener("submit",async s=>{s.preventDefault();let i=new FormData(n),o=w("[data-err]",n),r=String(i.get("name")||"").trim(),c=String(i.get("phone")||"").trim(),d=Number(i.get("amount")),p=[];if([["of-name",!r],["of-phone",c.replace(/\D/g,"").length<10],["of-amount",!(d>0)]].forEach(([y,L])=>{w("#"+y).setAttribute("aria-invalid",L?"true":"false"),L&&p.push(y)}),p.length){o.textContent="Please enter your name, a 10-digit phone number and an offer amount.",o.hidden=!1,w("#"+p[0]).focus();return}let m=w('button[type="submit"]',n);m.disabled=!0,m.textContent="Sending\u2026";try{i.get("website")||await g.submitOffer({productId:t.id,name:r,phone:c,amount:d}),n.innerHTML=`<div class="success"><span class="check">${h("check")}</span><h3>Offer sent</h3><p>Thanks, ${l(r.split(" ")[0])}. We received your offer of <b>${$(d)}</b> for <b>${l(t.title)}</b>. We\u2019ll call or text <b>${l(c)}</b> soon.</p><button class="btn btn-primary" type="button" data-close-dialog>Done</button></div>`}catch(y){o.textContent=y.message||"Something went wrong. Please try again.",o.hidden=!1,m.disabled=!1,m.textContent="Submit offer"}}),a.addEventListener("click",s=>{(s.target===a||s.target.closest("[data-close-dialog]"))&&a.close()}),a.showModal?a.showModal():a.setAttribute("open",""),setTimeout(()=>{let s=w("#of-name",a);s&&s.focus()},50)}function Ee(e){E("[data-search]").forEach(a=>ot(a,e)),lt();let t=w("[data-dd]");if(t){let a=document.getElementById(t.getAttribute("aria-controls")),n=t.closest(".nav-dd"),s,i=o=>{t.setAttribute("aria-expanded",o?"true":"false"),a.classList.toggle("open",o)};t.addEventListener("click",()=>i(t.getAttribute("aria-expanded")!=="true")),n.addEventListener("mouseenter",()=>{matchMedia("(hover:hover)").matches&&(clearTimeout(s),i(!0))}),n.addEventListener("mouseleave",()=>{matchMedia("(hover:hover)").matches&&(s=setTimeout(()=>i(!1),160))}),n.addEventListener("keydown",o=>{o.key==="Escape"&&(i(!1),t.focus())}),a.addEventListener("click",o=>{o.target.closest("a")&&i(!1)}),document.addEventListener("click",o=>{n.contains(o.target)||i(!1)})}document.addEventListener("click",a=>{let n=a.target;if(n.closest("[data-open-cart]")){oe("cart-sheet");return}if(n.closest("[data-menu]")){oe("menu-sheet");return}(n.closest("[data-close-cart]")||n.closest("[data-close-menu]")||n.closest(".overlay"))&&z(!!n.closest("a"));let s=n.closest(".menu-toggle");if(s){let c=s.getAttribute("aria-expanded")!=="true";s.setAttribute("aria-expanded",c),document.getElementById(s.getAttribute("aria-controls")).hidden=!c}n.closest(".menu-sheet a")&&z(!0);let i=n.closest("[data-msearch]");if(i){let c=w("#mobile-search"),d=c.hidden;c.hidden=!d,i.setAttribute("aria-expanded",d),d&&setTimeout(()=>w("input",c).focus(),30)}let o=n.closest("[data-add]");o&&(a.preventDefault(),ce(o.dataset.add,Number(o.dataset.qty||1)));let r=n.closest("[data-offer]");r&&(a.preventDefault(),ct(r.dataset.offer))}),document.addEventListener("keydown",a=>{a.key==="Escape"&&w(".sheet.open")&&z(),rt(a)})}function Ae(e){E("[data-nav]").forEach(t=>{let a=t.dataset.nav;(a==="/"?e==="/":e.startsWith(a))?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}var Be=e=>(g.category(e)||{}).name||"Other",de=()=>{let e=g.products(),t=e.filter(n=>n.bestDeal).sort((n,s)=>q(s)-q(n)),a=e.filter(n=>!n.bestDeal).sort((n,s)=>q(s)-q(n));return[...t,...a]};function He(){let e=g.settings(),t=de(),a=d=>g.product(d),s=["portable-bluetooth-cd-boombox","countertop-microwave-1-1-cu-ft","portable-steel-toolbox-20-inch","velvet-accent-chair-mango","vintage-tin-toy-car","robot-vacuum-cleaner"].map(a).filter(Boolean);t.forEach(d=>{s.length<6&&!s.includes(d)&&s.push(d)}),s=s.slice(0,6);let i=g.categories(),o={};g.products().forEach(d=>{o[d.categoryId]=(o[d.categoryId]||0)+1});let r=d=>{let p=t.find(m=>m.categoryId===d.id);return p?p.images[0]:null},c=Math.max(0,...g.products().map(q));return{title:"",description:`Big savings on electronics, home goods, tools, appliances, toys and more \u2014 up to ${c}% off retail. Fast shipping, free local pickup, and wholesale pricing from ML Group.`,html:`
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Retail &amp; wholesale \xB7 Up to ${c}% off</p>
          <h1 class="display"><span>Big savings.</span><span>Great products.</span></h1>
          <p class="hero-lede">ML Group sells discounted electronics, home goods, tools, appliances and more \u2014 one piece at a time for shoppers, or by the case and pallet for wholesale buyers.</p>
          <div class="hero-cta">
            <a class="btn btn-primary btn-lg" href="${f("/products?deals=1")}">Browse Deals ${h("arrow","icon-sm")}</a>
            <a class="btn btn-lg" href="${f("/wholesale")}">Wholesale buyers</a>
          </div>
          <div class="hero-proof"><span>${h("truck")} Ships nationwide</span><span>${h("store")} Free local pickup</span><span>${h("box")} Bulk lots available</span></div>
        </div>
        <div class="hero-collage" aria-label="Featured deals">
          ${s.map((d,p)=>`<a class="hero-tile ${p===0?"big":""}" href="${f("/products/"+d.slug)}">
            ${A(d.images[0],{alt:d.title,eager:p<3,sizes:p===0?"(min-width:900px) 34vw, 66vw":"(min-width:900px) 17vw, 33vw"})}
            <span class="cat">${l(Be(d.categoryId))}</span>
            <span class="tag">${q(d)?`<b>-${q(d)}%</b>`:""}<span class="tabnum">${$(d.price)}</span></span>
          </a>`).join("")}
        </div>
      </div>
    </section>
    <section class="proof-strip on-ink" aria-label="Why shop ML Group">
      <ul class="wrap">
        <li>${h("percent")}<div><b>Up to ${c}% off</b><span>Below retail, every day</span></div></li>
        <li>${h("store")}<div><b>Local pickup</b><span>Always free, always available</span></div></li>
        <li>${h("truck")}<div><b>Fast shipping</b><span>Flat price shown on every item</span></div></li>
        <li>${h("box")}<div><b>Wholesale</b><span>Case packs &amp; pallets</span></div></li>
      </ul>
    </section>
    <section class="section" aria-labelledby="deals-h">
      <div class="wrap">
        <div class="section-head"><div><h2 id="deals-h">Best deals</h2><p>The biggest markdowns in the warehouse right now. When they\u2019re gone, they\u2019re gone.</p></div><a class="link-arrow" href="${f("/products?deals=1")}">View all deals ${h("arrow","icon-sm")}</a></div>
        <div class="grid cols-4">${t.slice(0,8).map(d=>F(d)).join("")}</div>
      </div>
    </section>
    <section class="section band alt" aria-labelledby="cats-h">
      <div class="wrap">
        <div class="section-head"><div><h2 id="cats-h">Shop by category</h2></div><a class="link-arrow" href="${f("/categories")}">All categories ${h("arrow","icon-sm")}</a></div>
        <div class="cat-grid six">${i.map(d=>`<a class="cat-tile" href="${f("/categories/"+d.slug)}"><div class="ct-img">${A(r(d),{alt:"",sizes:"(min-width:1200px) 16vw, 50vw"})}</div><div class="ct-body"><div><h3>${l(d.name)}</h3><span class="ct-count">${o[d.id]||0} items</span></div>${h("arrow")}</div></a>`).join("")}</div>
      </div>
    </section>
    <section class="band ws-band on-ink" aria-labelledby="ws-h">
      <div class="wrap">
        <div style="display:grid;gap:18px">
          <p class="eyebrow">For resellers, stores &amp; businesses</p>
          <h2 id="ws-h">Buy by the case. Save by the pallet.</h2>
          <p>ML Group works with buyers who need larger quantities \u2014 mixed lots, case packs and full pallets at wholesale pricing.</p>
          <div class="hero-cta"><a class="btn btn-invert btn-lg" href="${f("/wholesale")}">Wholesale pricing</a><a class="btn btn-ghost-ink btn-lg" href="${H(e.phone)}">${h("phone","icon-sm")} ${l(e.phone)}</a></div>
        </div>
        <ul class="ws-points">
          <li>${h("layers")}<div><b>Volume discounts</b><span>Tiered pricing starting at 10 units.</span></div></li>
          <li>${h("box")}<div><b>Mixed lots &amp; pallets</b><span>Electronics, home, tools and general merchandise.</span></div></li>
          <li>${h("truck")}<div><b>Freight or dock pickup</b><span>We load your truck or arrange LTL shipping.</span></div></li>
        </ul>
      </div>
    </section>
    <section class="section" aria-labelledby="pickup-h">
      <div class="wrap">
        <div class="section-head"><div><h2 id="pickup-h">Local pickup, made easy</h2><p>${l(e.address1)}, ${l(e.city)}, ${l(e.state)} \xB7 ${l(e.pickupHours)}</p></div></div>
        <ol class="steps">
          <li><h3>Order online</h3><p>Choose \u201CLocal pickup\u201D at checkout \u2014 it\u2019s always free.</p></li>
          <li><h3>Get a text</h3><p>We\u2019ll text you when your order is ready, usually within one business day.</p></li>
          <li><h3>Pick it up</h3><p>Show your order number. We\u2019ll help load large items.</p></li>
        </ol>
      </div>
    </section>`,mount:d=>U(d)}}var dt=[["grid4","4-column grid","grid4"],["grid2","2-column grid","grid2"],["list","List view","list"],["scroll","Horizontal scrolling","rows"]],pt=[["deals","Best deals"],["price-asc","Price: Low to High"],["price-desc","Price: High to Low"],["new","Newest"]],ut=[["","Any price"],["0-25","Under $25"],["25-100","$25 \u2013 $100"],["100-500","$100 \u2013 $500"],["500-","$500 & up"]];function pe({query:e,params:t={}}){let a=t.cat||e.get("category")||"",n=a?g.category(a):null,s={q:e.get("q")||"",cat:n?n.slug:"",deals:e.get("deals")==="1",min:e.get("min")||"",max:e.get("max")||"",sort:e.get("sort")||"deals",view:e.get("view")||T.get("ml-view","grid4"),shown:24},i=n?n.name:s.q?`Search: ${s.q}`:s.deals?"Best Deals":"All Products",o=n?`Discounted ${n.name.toLowerCase()} \u2014 new and like-new stock at below-retail prices.`:"Every deal in stock right now. Filter by category, price or best deals.";return{title:i,description:n?`Shop discounted ${n.name.toLowerCase()} at ML Group. Big savings, fast shipping and free local pickup.`:"Shop all discounted products at ML Group \u2014 electronics, home & kitchen, tools, appliances, toys and more.",path:n?"/categories/"+n.slug:"/products",html:`
    <div class="page-head"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${f("/")}">Home</a><span aria-hidden="true">/</span>${n?`<a href="${f("/categories")}">Categories</a><span aria-hidden="true">/</span><span aria-current="page">${l(n.name)}</span>`:'<span aria-current="page">Products</span>'}</nav>
      <h1>${l(i)}</h1><p>${l(o)}</p>
    </div></div>
    <div class="wrap catalog">
      <aside class="filters" aria-label="Filters" data-filters></aside>
      <div>
        <div class="toolbar">
          <p class="result-count" data-count aria-live="polite"></p>
          <button class="btn btn-sm filter-btn" type="button" data-open-filters>${h("filter","icon-sm")} Filters</button>
          <div class="select"><label class="sr-only" for="sort">Sort by</label><select id="sort" data-sort>${pt.map(([r,c])=>`<option value="${r}" ${s.sort===r?"selected":""}>${c}</option>`).join("")}</select>${h("down")}</div>
          <div class="views" role="group" aria-label="View">${dt.map(([r,c,d])=>`<button type="button" aria-label="${c}" title="${c}" aria-pressed="${s.view===r}" data-view="${r}">${h(d)}</button>`).join("")}</div>
        </div>
        <div class="active-filters" data-active></div>
        <div data-results></div>
      </div>
    </div>
    <dialog class="modal" id="filter-dialog" aria-labelledby="filter-title"><div class="modal-head"><h2 id="filter-title">Filters</h2><button class="icon-btn" type="button" aria-label="Close filters" data-close-filters>${h("close")}</button></div><div class="modal-body" data-filters-m></div><div class="modal-body" style="padding-top:0"><button class="btn btn-primary btn-block" type="button" data-close-filters>Show results</button></div></dialog>`,mount(r,{navigateReplace:c}){let d=u=>{let b={};g.products().forEach(v=>{b[v.categoryId]=(b[v.categoryId]||0)+1});let x=`${s.min}-${s.max}`;return`
        <div class="f-group"><h3>Category</h3><div class="f-options">
          <label class="f-opt"><input type="radio" name="cat${u}" value="" ${s.cat?"":"checked"}> All categories <span class="count">${g.products().length}</span></label>
          ${g.categories().map(v=>`<label class="f-opt"><input type="radio" name="cat${u}" value="${v.slug}" ${s.cat===v.slug?"checked":""}> ${l(v.name)} <span class="count">${b[v.id]||0}</span></label>`).join("")}
        </div></div>
        <div class="f-group"><h3>Deals</h3><label class="f-opt"><input type="checkbox" name="deals${u}" ${s.deals?"checked":""}> Best deals only</label></div>
        <div class="f-group"><h3>Price</h3><div class="f-options">
          ${ut.map(([v,k])=>`<label class="f-opt"><input type="radio" name="range${u}" value="${v}" ${(v===""?!s.min&&!s.max:x===v)?"checked":""}> ${k}</label>`).join("")}
        </div>
        <div class="price-inputs" style="margin-top:10px"><label><span>$</span><input type="number" inputmode="numeric" min="0" placeholder="Min" aria-label="Minimum price" name="min${u}" value="${l(s.min)}"></label><span aria-hidden="true">\u2013</span><label><span>$</span><input type="number" inputmode="numeric" min="0" placeholder="Max" aria-label="Maximum price" name="max${u}" value="${l(s.max)}"></label></div></div>`},p=()=>{let u=s.q?le(s.q):g.products().slice();if(s.cat){let k=g.category(s.cat);u=u.filter(C=>k&&C.categoryId===k.id)}s.deals&&(u=u.filter(k=>k.bestDeal||q(k)>=40));let b=parseFloat(s.min),x=parseFloat(s.max);isNaN(b)||(u=u.filter(k=>k.price>=b)),isNaN(x)||(u=u.filter(k=>k.price<=x));let v={deals:(k,C)=>C.bestDeal-k.bestDeal||q(C)-q(k),"price-asc":(k,C)=>k.price-C.price,"price-desc":(k,C)=>C.price-k.price,new:(k,C)=>String(C.createdAt).localeCompare(String(k.createdAt))};return s.q&&s.sort==="deals"||u.sort(v[s.sort]||v.deals),u},m=()=>{let u=new URLSearchParams;s.q&&u.set("q",s.q),s.deals&&u.set("deals","1"),s.min&&u.set("min",s.min),s.max&&u.set("max",s.max),s.sort!=="deals"&&u.set("sort",s.sort);let b=s.cat?"/categories/"+s.cat:"/products";c(b+(u.toString()?"?"+u:""))},y=()=>{let u=p();w("[data-count]",r).innerHTML=`<b>${u.length}</b> ${u.length===1?"product":"products"}`;let b=[];s.q&&b.push(["q",`\u201C${s.q}\u201D`]),s.cat&&b.push(["cat",Be((g.category(s.cat)||{}).id)]),s.deals&&b.push(["deals","Best deals"]),(s.min||s.max)&&b.push(["price",`${s.min?"$"+s.min:"$0"} \u2013 ${s.max?"$"+s.max:"any"}`]),w("[data-active]",r).innerHTML=b.map(([v,k])=>`<button class="chip" type="button" data-clear-f="${v}" aria-label="Remove filter ${l(k)}">${l(k)} ${h("close")}</button>`).join("")+(b.length>1?'<button class="link" type="button" data-clear-f="all" style="font-size:13px">Clear all</button>':"");let x=w("[data-results]",r);if(!u.length){x.innerHTML='<div class="empty"><h2>No matches</h2><p class="muted">Try removing a filter or searching for something else.</p><button class="btn" type="button" data-clear-f="all">Clear filters</button></div>';return}if(s.view==="scroll"){let v=g.categories().map(C=>[C,u.filter(V=>V.categoryId===C.id)]).filter(([,C])=>C.length),k=u.filter(C=>!g.category(C.categoryId));k.length&&v.push([{name:"More",slug:""},k]),x.innerHTML=`<div class="shelves">${v.map(([C,V])=>`<section><div class="shelf-head"><h3>${l(C.name)}</h3>${C.slug?`<a href="${f("/categories/"+C.slug)}">See all ${V.length}</a>`:""}</div><div class="shelf" tabindex="0" aria-label="${l(C.name)} products, scroll horizontally">${V.map(Ke=>F(Ke,{sizes:"260px"})).join("")}</div></section>`).join("")}</div>`}else{let v={grid4:"cols-4",grid2:"cols-2big",list:"list"}[s.view]||"cols-4",k=s.view==="grid2"?"(min-width:1024px) 38vw, 50vw":s.view==="list"?"220px":"(min-width:1024px) 20vw, 50vw";x.innerHTML=`<div class="grid ${v}">${u.slice(0,s.shown).map(C=>F(C,{sizes:k})).join("")}</div>${u.length>s.shown?`<div class="load-more"><button class="btn btn-lg" type="button" data-more>Show more (${u.length-s.shown} left)</button></div>`:""}`}U(x)},L=()=>{w("[data-filters]",r).innerHTML=d("");let u=w("[data-filters-m]",r);u&&(u.innerHTML=d("-m"))},S=()=>{L(),y(),m()};r.addEventListener("change",u=>{let b=u.target,x=(b.name||"").replace(/-m$/,"");if(x==="cat")s.cat=b.value;else if(x==="deals")s.deals=b.checked;else if(x==="range"){let[v,k]=b.value.split("-");s.min=v||"",s.max=k||""}else if(x==="min"||x==="max")s[x]=b.value.trim();else if(b.matches("[data-sort]"))s.sort=b.value;else return;s.shown=24,S()}),r.addEventListener("click",u=>{let b=u.target.closest("[data-view]");b&&(s.view=b.dataset.view,T.set("ml-view",s.view),E("[data-view]",r).forEach(v=>v.setAttribute("aria-pressed",v===b)),y());let x=u.target.closest("[data-clear-f]");if(x){let v=x.dataset.clearF;(v==="q"||v==="all")&&(s.q=""),(v==="cat"||v==="all")&&(s.cat=""),(v==="deals"||v==="all")&&(s.deals=!1),(v==="price"||v==="all")&&(s.min="",s.max=""),S()}u.target.closest("[data-more]")&&(s.shown+=24,y()),u.target.closest("[data-open-filters]")&&w("#filter-dialog").showModal(),u.target.closest("[data-close-filters]")&&w("#filter-dialog").close()}),L(),y()}}}function De({params:e}){let t=g.product(e.slug);if(!t)return te("This item is sold out or no longer available.");let a=g.settings(),n=q(t),s=g.category(t.categoryId),i=g.products().filter(p=>p.categoryId===t.categoryId&&p.id!==t.id).slice(0,4),o=t.images.length?t.images:[null],r={New:"NewCondition",Refurbished:"RefurbishedCondition"},c={"@context":"https://schema.org","@type":"Product",name:t.title,sku:t.id,gtin12:t.upc||void 0,image:t.images.map(p=>R(p.lg)),description:t.description.replace(/\n+/g," ").replace(/•/g,""),brand:t.brand?{"@type":"Brand",name:t.brand}:void 0,category:s?s.name:void 0,offers:{"@type":"Offer",url:M.root+"products/"+t.slug,priceCurrency:"USD",price:t.price.toFixed(2),availability:"https://schema.org/InStock",itemCondition:"https://schema.org/"+(r[t.condition]||"UsedCondition"),seller:{"@type":"Organization",name:"ML Group"},shippingDetails:t.noShipping?void 0:{"@type":"OfferShippingDetails",shippingRate:{"@type":"MonetaryAmount",value:Number(t.shipping).toFixed(2),currency:"USD"},shippingDestination:{"@type":"DefinedRegion",addressCountry:"US"}}}},d=l(t.description).split(/\n\n+/).map(p=>p.trim().startsWith("\u2022")?`<ul>${p.split(`
`).map(m=>`<li>${m.replace(/^•\s*/,"")}</li>`).join("")}</ul>`:`<p>${p.replace(/\n/g,"<br>")}</p>`).join("");return{title:t.title,image:t.images[0]&&t.images[0].lg,jsonld:c,path:"/products/"+t.slug,description:`${t.title} \u2014 ${t.condition}, ${$(t.price)}${n?` (${n}% off)`:""}. ${t.noShipping?"Available for local pickup only":`Shipping ${$(t.shipping)} or free local pickup`} at ML Group.`,html:`
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb" style="margin-top:18px"><a href="${f("/")}">Home</a><span aria-hidden="true">/</span><a href="${f("/products")}">Products</a><span aria-hidden="true">/</span>${s?`<a href="${f("/categories/"+s.slug)}">${l(s.name)}</a><span aria-hidden="true">/</span>`:""}<span aria-current="page">${l(t.title)}</span></nav>
      <div class="pdp">
        <div class="gallery">
          <div class="g-main" data-carousel>
            <div class="track">${o.map((p,m)=>`<div>${A(p,{alt:m?`${t.title} \u2013 photo ${m+1}`:t.title,eager:m===0,sizes:"(min-width:900px) 50vw, 100vw",w:960})}</div>`).join("")}</div>
            ${n?`<span class="badge">-${n}%</span>`:""}
            ${o.length>1?`<button class="car-btn prev" type="button" aria-label="Previous photo" data-car="-1">${h("left")}</button><button class="car-btn next" type="button" aria-label="Next photo" data-car="1">${h("right")}</button><span class="g-count" aria-hidden="true">1 / ${o.length}</span>`:""}
          </div>
          ${o.length>1?`<div class="g-thumbs">${o.map((p,m)=>`<button type="button" aria-label="Show photo ${m+1}" aria-current="${m===0}">${A(p,{alt:"",sizes:"84px"})}</button>`).join("")}</div>`:""}
        </div>
        <div class="pdp-info">
          <div style="display:grid;gap:10px">
            ${t.brand?`<p class="pdp-brand"><a href="${f("/products?q="+encodeURIComponent(t.brand))}">${l(t.brand)}</a></p>`:""}
            <h1>${l(t.title)}</h1>
            <div class="cond-row"><span class="cond">Condition: ${l(t.condition)}</span>${t.bestDeal?'<span class="cond">Best deal</span>':""}${t.inventory<=5?`<span class="stock-low">Only ${t.inventory} left</span>`:'<span class="muted" style="font-size:14px">In stock</span>'}</div>
          </div>
          <div class="pdp-price">
            <div class="row"><span class="now tabnum">${$(t.price)}</span>${n?`<span class="off">-${n}%</span>`:""}</div>
            ${n?`<div class="row"><span class="was">Retail <s class="tabnum">${$(t.originalPrice)}</s></span><span class="save">You save ${$(t.originalPrice-t.price)}</span></div>`:""}
          </div>
          <ul class="facts">
            <li>${h("store")}<div><b>Available for pick up</b><span>Free \xB7 ${l(a.city)}, ${l(a.state)} \xB7 ${l(a.pickupHours)}</span></div></li>
            ${t.noShipping?"":`<li>${h("truck")}<div><b>Available for shipping</b><span>Shipping: ${t.shipping>0?$(t.shipping):"Free"} \xB7 ships in 1\u20132 business days</span></div></li>`}
          </ul>
          <div class="buy-row">
            <div class="qty" role="group" aria-label="Quantity"><button type="button" aria-label="Decrease quantity" data-q="-1">${h("minus","icon-sm")}</button><input id="pdp-qty" type="number" inputmode="numeric" min="1" max="${t.inventory}" value="1" aria-label="Quantity"><button type="button" aria-label="Increase quantity" data-q="1">${h("plus","icon-sm")}</button></div>
            <button class="btn btn-primary btn-lg" type="button" data-pdp-add>Add to Cart</button>
            <button class="btn btn-lg btn-offer" type="button" data-offer="${t.id}">Make Offer</button>
          </div>
          ${t.upc?`<div class="upc">${ge(t.upc)}<dl><dt>UPC</dt><dd>${l(t.upc)}</dd></dl></div>`:""}
          <section class="desc" aria-labelledby="desc-h"><h2 id="desc-h">Description</h2><div class="prose">${d}</div></section>
        </div>
      </div>
      ${i.length?`<section class="section" style="padding-top:0" aria-labelledby="rel-h"><div class="section-head"><h2 id="rel-h">More ${l(s?s.name:"")} deals</h2>${s?`<a class="link-arrow" href="${f("/categories/"+s.slug)}">View all ${h("arrow","icon-sm")}</a>`:""}</div><div class="grid cols-4">${i.map(p=>F(p)).join("")}</div></section>`:""}
    </div>
    <div class="sticky-buy" data-sticky><button class="btn" type="button" data-offer="${t.id}">Make Offer</button><button class="btn btn-primary" type="button" data-add="${t.id}">Add \xB7 ${$(t.price)}</button></div>`,mount(p){U(p);let m=w("#pdp-qty",p);p.addEventListener("click",S=>{let u=S.target.closest("[data-q]");u&&(m.value=Math.min(t.inventory,Math.max(1,(parseInt(m.value,10)||1)+Number(u.dataset.q)))),S.target.closest("[data-pdp-add]")&&ce(t.id,Math.min(t.inventory,Math.max(1,parseInt(m.value,10)||1)))});let y=w(".buy-row",p),L=w("[data-sticky]",p);if("IntersectionObserver"in window&&y&&L){let S=new IntersectionObserver(([u])=>L.classList.toggle("show",!u.isIntersecting&&u.boundingClientRect.top<0));return S.observe(y),()=>S.disconnect()}}}}function Oe(){let e={};g.products().forEach(a=>{e[a.categoryId]=(e[a.categoryId]||0)+1});let t=de();return{title:"Categories",description:"Browse ML Group deals by category \u2014 electronics, home & kitchen, tools, appliances, toys and more.",html:`<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${f("/")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Categories</span></nav><h1>Categories</h1><p>Pick a department. Every listing shows its condition, discount, shipping price and local pickup.</p></div></div>
    <div class="wrap section" style="padding-top:28px"><div class="cat-grid">${g.categories().map(a=>{let n=t.find(s=>s.categoryId===a.id);return`<a class="cat-tile" href="${f("/categories/"+a.slug)}"><div class="ct-img">${A(n&&n.images[0],{alt:"",sizes:"(min-width:900px) 33vw, 50vw"})}</div><div class="ct-body"><div><h3>${l(a.name)}</h3><span class="ct-count">${e[a.id]||0} items</span></div>${h("arrow")}</div></a>`}).join("")}</div></div>`}}function Ie(e){let t=e==="wholesale";return`<form class="form" novalidate data-inquiry="${e}">
    <div class="form-row two"><div class="field"><label for="iq-name">Name</label><input id="iq-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="iq-phone">Phone</label><input id="iq-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div></div>
    <div class="form-row two"><div class="field"><label for="iq-email">Email</label><input id="iq-email" name="email" type="email" autocomplete="email" required></div>
    ${t?'<div class="field"><label for="iq-company">Company <span class="opt">(optional)</span></label><input id="iq-company" name="company" autocomplete="organization"></div>':'<div class="field"><label for="iq-topic">Topic</label><select id="iq-topic" name="company"><option>Question about an item</option><option>Order help</option><option>Local pickup</option><option>Returns</option><option>Something else</option></select></div>'}</div>
    ${t?'<div class="field"><label for="iq-qty">What are you looking for?</label><select id="iq-qty" name="interest"><option>Mixed lots</option><option>Case packs of one item</option><option>Full pallets</option><option>Truckloads</option><option>Not sure yet</option></select></div>':""}
    <div class="field"><label for="iq-msg">${t?"Categories, quantities and budget":"Message"}</label><textarea id="iq-msg" name="message" required maxlength="2000"></textarea></div>
    <div class="hp" aria-hidden="true"><label for="iq-web">Website</label><input id="iq-web" name="website" tabindex="-1" autocomplete="off"></div>
    <p class="form-error" data-err hidden></p>
    <button class="btn btn-primary btn-lg" type="submit">${t?"Request wholesale pricing":"Send message"}</button>
  </form>`}function Ne(e){let t=w("[data-inquiry]",e);t&&t.addEventListener("submit",async a=>{a.preventDefault();let n=Object.fromEntries(new FormData(t)),s=w("[data-err]",t),i=[["iq-name",!String(n.name).trim()],["iq-phone",String(n.phone).replace(/\D/g,"").length<10],["iq-email",!/^\S+@\S+\.\S+$/.test(n.email)],["iq-msg",!String(n.message).trim()]];i.forEach(([c,d])=>w("#"+c).setAttribute("aria-invalid",d?"true":"false"));let o=i.find(([,c])=>c);if(o){s.textContent="Please fill in your name, a 10-digit phone number, a valid email and a message.",s.hidden=!1,w("#"+o[0]).focus();return}let r=w('button[type="submit"]',t);r.disabled=!0;try{n.website||await g.submitInquiry({type:t.dataset.inquiry,name:n.name.trim(),phone:n.phone.trim(),email:n.email.trim(),company:(n.company||"").trim(),message:(n.interest?`[${n.interest}] `:"")+n.message.trim()}),t.innerHTML=`<div class="success"><span class="check">${h("check")}</span><h3>Message sent</h3><p>Thanks, ${l(n.name.split(" ")[0])}. We\u2019ll get back to you within one business day.</p></div>`}catch(c){s.textContent=c.message,s.hidden=!1,r.disabled=!1}})}function Re(){let e=g.settings();return{title:"Wholesale",description:"Wholesale and bulk purchasing from ML Group: mixed lots, case packs and pallets of discounted merchandise with volume pricing.",html:`<section class="band on-ink"><div class="wrap" style="padding-block:48px 52px;display:grid;gap:16px">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${f("/")}" style="color:#b9b9b3">Home</a><span aria-hidden="true">/</span><span aria-current="page" style="color:#fff">Wholesale</span></nav>
      <p class="eyebrow">ML Group Wholesale</p>
      <h1 class="display" style="font-size:clamp(38px,8vw,80px)">Bulk deals for<br>serious buyers.</h1>
      <p style="color:#b9b9b3;max-width:56ch;font-size:17.5px">We work with resellers, retailers, flea-market vendors and businesses that want larger quantities of discounted merchandise. Tell us what you need and we\u2019ll put together a quote.</p>
      <div class="hero-cta"><a class="btn btn-invert btn-lg" href="#ws-form">Request pricing</a><a class="btn btn-ghost-ink btn-lg" href="${H(e.phone)}">${h("phone","icon-sm")} ${l(e.phone)}</a></div>
    </div></section>
    <section class="section"><div class="wrap" style="display:grid;gap:28px">
      <div class="section-head" style="margin:0"><div><h2>Volume pricing</h2><p>Discounts off our already-reduced retail prices. Mix and match within a category.</p></div></div>
      <div class="tiers">
        <div class="tier"><span class="t-qty">10\u201349 units</span><span class="t-off">10% off</span><p>Case packs and small mixed lots.</p></div>
        <div class="tier"><span class="t-qty">50\u2013199 units</span><span class="t-off">20% off</span><p>Larger mixed lots, priority picking.</p></div>
        <div class="tier dark"><span class="t-qty">Pallets &amp; truckloads</span><span class="t-off">Custom</span><p>Manifested pallets with freight quotes.</p></div>
      </div>
      <ol class="steps">
        <li><h3>Tell us what you need</h3><p>Categories, quantities, condition and budget.</p></li>
        <li><h3>Get a quote</h3><p>We send available lots, photos and pricing within one business day.</p></li>
        <li><h3>Pay &amp; pick up</h3><p>Dock pickup is free, or we arrange LTL freight to your door.</p></li>
      </ol>
    </div></section>
    <section class="section band alt" id="ws-form"><div class="wrap split" style="padding-block:0">
      <div style="display:grid;gap:14px;align-content:start"><h2 class="display" style="font-size:clamp(28px,5vw,44px)">Request wholesale pricing</h2><p class="muted">Prefer to talk? Call or text <a href="${H(e.phone)}"><b>${l(e.phone)}</b></a> or email <a href="mailto:${l(e.email)}"><b>${l(e.email)}</b></a>.</p>
      <ul class="info-list" style="margin-top:8px"><li>${h("check")}<span>No minimum to request a quote</span></li><li>${h("check")}<span>Resale certificates accepted</span></li><li>${h("check")}<span>Photos and manifests on request</span></li></ul></div>
      <div class="info-card" style="background:#fff">${Ie("wholesale")}</div>
    </div></section>`,mount:Ne}}function We(){let e=g.settings();return{title:"About",description:"ML Group is a retail and wholesale seller offering discounted products at competitive prices, with fast shipping and free local pickup.",html:`<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${f("/")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">About</span></nav><h1>About ML Group</h1></div></div>
    <div class="wrap split">
      <div class="prose">
        <p><b>ML Group is a retail and wholesale seller focused on one thing: great products at prices well below retail.</b></p>
        <p>We buy overstock, open-box returns, closeouts and brand-new inventory, inspect it, and pass the savings on \u2014 whether you need one item for your home or a pallet for your store.</p>
        <h2>How we keep prices low</h2>
        <ul><li>We buy in volume and sell direct \u2014 no middlemen.</li><li>Every item is checked and honestly graded: New, Open Box, Like New, Refurbished or Used.</li><li>Flat shipping prices and free local pickup, so there are no surprises at checkout.</li></ul>
        <h2>Visit us</h2>
        <p>Pickup is at ${l(e.address1)}, ${l(e.city)}, ${l(e.state)} ${l(e.zip)} \u2014 ${l(e.pickupHours)}.</p>
        <p><a class="btn btn-primary" href="${f("/products?deals=1")}">Browse Deals</a></p>
      </div>
      <div style="display:grid;gap:12px;align-content:start">
        <div class="tiers"><div class="tier"><span class="t-qty">Products in stock</span><span class="t-off tabnum">${g.products().length}</span></div><div class="tier dark"><span class="t-qty">Top discount</span><span class="t-off">${Math.max(0,...g.products().map(q))}%</span></div></div>
        <div class="info-card"><h2>Condition guide</h2><ul class="info-list">
          <li>${h("tag")}<div><b>New</b><span class="muted">Unused, in original packaging.</span></div></li>
          <li>${h("tag")}<div><b>Open Box</b><span class="muted">Opened or returned, unused and complete.</span></div></li>
          <li>${h("tag")}<div><b>Like New / Refurbished</b><span class="muted">Tested and restored to full working order.</span></div></li>
          <li>${h("tag")}<div><b>Used / Scratch &amp; Dent</b><span class="muted">Works perfectly; cosmetic wear described in the listing.</span></div></li>
        </ul></div>
      </div>
    </div>`}}function ze(){let e=g.settings();return{title:"Contact",description:`Contact ML Group \u2014 call or text ${e.phone}, email ${e.email}, or visit our local pickup location.`,html:`<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${f("/")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav><h1>Contact us</h1><p>Questions about an item, an order or local pickup? We answer quickly.</p></div></div>
    <div class="wrap split">
      <div style="display:grid;gap:16px;align-content:start">
        <div class="info-card"><h2>Get in touch</h2><ul class="info-list">
          <li>${h("phone")}<div><b>Call or text</b><a href="${H(e.phone)}">${l(e.phone)}</a></div></li>
          <li>${h("mail")}<div><b>Email</b><a href="mailto:${l(e.email)}">${l(e.email)}</a></div></li>
        </ul></div>
        <div class="info-card"><h2>Local pickup</h2><ul class="info-list">
          <li>${h("pin")}<div><b>${l(e.address1)}</b><span>${l(e.city)}, ${l(e.state)} ${l(e.zip)}</span></div></li>
          <li>${h("clock")}<div><b>Pickup hours</b><span>${l(e.pickupHours)}</span></div></li>
          <li>${h("store")}<div><b>How it works</b><span>Choose \u201CLocal pickup\u201D at checkout. We text you when it\u2019s ready. ${l(e.pickupNote)}</span></div></li>
        </ul>
        <a class="btn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.address1}, ${e.city}, ${e.state} ${e.zip}`)}" target="_blank" rel="noopener">${h("pin","icon-sm")} Get directions</a></div>
      </div>
      <div class="info-card"><h2>Send a message</h2>${Ie("contact")}</div>
    </div>`,mount:Ne}}function ue({kind:e}){let t=g.settings(),a=e==="shipping";return{title:a?"Shipping & Pickup":"Refund Policy",description:a?"ML Group shipping prices, delivery times and free local pickup details.":"ML Group refund and return policy for retail purchases.",html:`<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${f("/")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">${a?"Shipping & Pickup":"Refund Policy"}</span></nav><h1>${a?"Shipping &amp; pickup":"Refund policy"}</h1></div></div>
    <div class="wrap section" style="padding-top:28px"><div class="prose">${a?`
      <p>Every product page shows its exact shipping price. Shipping is charged once per item line, and local pickup is always free.</p>
      <h2>Shipping</h2><ul><li>Orders ship within 1\u20132 business days to the contiguous United States.</li><li>Tracking is sent by text or email as soon as your order ships.</li><li>Large items (furniture, appliances) ship by freight; we\u2019ll call to schedule delivery.</li></ul>
      <h2>Local pickup</h2><ul><li>Location: ${l(t.address1)}, ${l(t.city)}, ${l(t.state)} ${l(t.zip)}.</li><li>Hours: ${l(t.pickupHours)}.</li><li>We\u2019ll text you when your order is ready \u2014 usually within one business day. ${l(t.pickupNote)}</li><li>Orders are held for 7 days.</li></ul>`:`
      <p>We want you to be happy with your deal. If something isn\u2019t right, contact us within <b>14 days</b> of delivery or pickup.</p>
      <h2>Returns</h2><ul><li>New and Open Box items can be returned within 14 days if unused and complete.</li><li>Refurbished items include a 90-day warranty against defects.</li><li>Used and Scratch &amp; Dent items are sold as described and are final sale unless not working on arrival.</li><li>Accepted offers and wholesale lots are final sale.</li></ul>
      <h2>Refunds</h2><ul><li>Refunds go back to your original payment method within 5 business days of receiving the return.</li><li>Original shipping is non-refundable unless we made an error.</li><li>Items not as described or damaged in shipping are refunded in full, including shipping.</li></ul>
      <h2>Start a return</h2><p>Call or text ${l(t.phone)} or email ${l(t.email)} with your order number.</p>`}</div></div>`}}function Fe(){let e=g.settings();return{title:"Checkout",noindex:!0,description:"Secure checkout \u2014 guest checkout, shipping or free local pickup.",html:'<div class="page-head"><div class="wrap"><h1>Checkout</h1><p>No account needed. Choose shipping or free local pickup.</p></div></div><div class="wrap" data-co></div>',mount(t,{navigate:a}){let n=w("[data-co]",t),s={fulfillment:"shipping",payment:"link",...T.get("ml-co",{})},i=()=>{let o=B.items();if(!o.length){n.innerHTML=`<div class="empty" style="margin-block:32px 64px"><h2>Your cart is empty</h2><p class="muted">Add something from today\u2019s deals to check out.</p><a class="btn btn-primary" href="${f("/products?deals=1")}">Browse Deals</a></div>`;return}let r=o.filter(m=>m.product.noShipping);r.length&&(s.fulfillment="pickup");let c=s.fulfillment==="pickup",d=O(o.reduce((m,y)=>m+y.product.shipping,0)),p=B.subtotal();!c&&s.payment==="pickup"&&(s.payment="link"),n.innerHTML=`<form class="checkout" novalidate data-co-form>
          <div>
            <section class="co-section"><h2><span class="n">1</span> Contact</h2><div class="co-body">
              <div class="field"><label for="co-name">Full name</label><input id="co-name" name="name" autocomplete="name" required value="${l(s.name||"")}"></div>
              <div class="form-row two"><div class="field"><label for="co-email">Email</label><input id="co-email" name="email" type="email" autocomplete="email" required value="${l(s.email||"")}"><span class="hint">For your receipt and order updates.</span></div>
              <div class="field"><label for="co-phone">Phone</label><input id="co-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required value="${l(s.phone||"")}"><span class="hint">We text when your order ships or is ready.</span></div></div>
            </div></section>
            <section class="co-section"><h2><span class="n">2</span> Delivery</h2><div class="co-body">
              <div class="radio-cards" role="radiogroup" aria-label="Delivery method">
                ${r.length?`<p class="pickup-box"><b>${h("store","icon-sm")} Pick up only</b><span>${r.map(m=>l(m.product.title)).join(", ")} ${r.length>1?"are":"is"} not available for shipping, so this order is for local pickup.</span></p>`:`<label class="radio-card"><input type="radio" name="fulfillment" value="shipping" ${c?"":"checked"}><div><b>Ship to me</b><span>Ships in 1\u20132 business days</span></div><span class="rc-price tabnum">${$(d)}</span></label>`}
                <label class="radio-card"><input type="radio" name="fulfillment" value="pickup" ${c?"checked":""}><div><b>Local pickup</b><span>${l(e.city)}, ${l(e.state)} \xB7 ready in about 1 business day</span></div><span class="rc-price">Free</span></label>
              </div>
              ${c?`<div class="pickup-box"><b>${h("store","icon-sm")} Pickup location</b><span>${l(e.address1)}, ${l(e.city)}, ${l(e.state)} ${l(e.zip)}</span><span>${l(e.pickupHours)}</span><span class="muted">${l(e.pickupNote)}</span></div>`:`
              <div class="field"><label for="co-a1">Street address</label><input id="co-a1" name="line1" autocomplete="address-line1" required value="${l(s.line1||"")}"></div>
              <div class="field"><label for="co-a2">Apt, suite, unit <span class="opt">(optional)</span></label><input id="co-a2" name="line2" autocomplete="address-line2" value="${l(s.line2||"")}"></div>
              <div class="form-row three"><div class="field"><label for="co-city">City</label><input id="co-city" name="city" autocomplete="address-level2" required value="${l(s.city||"")}"></div>
              <div class="field"><label for="co-state">State</label><input id="co-state" name="state" autocomplete="address-level1" required maxlength="2" value="${l(s.state||"")}" style="text-transform:uppercase"></div>
              <div class="field"><label for="co-zip">ZIP</label><input id="co-zip" name="zip" autocomplete="postal-code" inputmode="numeric" required value="${l(s.zip||"")}"></div></div>`}
            </div></section>
            <section class="co-section"><h2><span class="n">3</span> Payment</h2><div class="co-body">
              <div class="radio-cards" role="radiogroup" aria-label="Payment method">
                <label class="radio-card"><input type="radio" name="payment" value="link" ${s.payment!=="pickup"?"checked":""}><div><b>Pay by secure card link</b><span>After we confirm your items, we text and email a secure payment link. Nothing is charged until you pay.</span></div>${h("link")}</label>
                ${c?`<label class="radio-card"><input type="radio" name="payment" value="pickup" ${s.payment==="pickup"?"checked":""}><div><b>Pay at pickup</b><span>Cash or card when you collect your order.</span></div>${h("cash")}</label>`:""}
              </div>
              <div class="field"><label for="co-notes">Order notes <span class="opt">(optional)</span></label><textarea id="co-notes" name="notes" style="min-height:80px">${l(s.notes||"")}</textarea></div>
            </div></section>
            <section class="co-section"><h2><span class="n">4</span> Account <span class="muted" style="font:600 12px var(--font-body);letter-spacing:.08em">(OPTIONAL)</span></h2><div class="co-body">
              <label class="check-row"><input type="checkbox" name="create" ${s.create?"checked":""} data-create> <span>Create an account to track orders and check out faster next time.</span></label>
              <div class="field" data-pw ${s.create?"":"hidden"}><label for="co-pw">Choose a password</label><input id="co-pw" name="password" type="password" autocomplete="new-password" minlength="8"><span class="hint">At least 8 characters.</span></div>
            </div></section>
          </div>
          <aside class="summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <ul class="sum-items">${o.map(({product:m,qty:y})=>`<li class="sum-item"><span class="th">${A(m.images[0],{alt:"",sizes:"56px"})}<span class="q">${y}</span></span><span class="t">${l(m.title)}<small>${l(m.condition)} \xB7 ${y} \xD7 ${$(m.price)}${c?"":` \xB7 ship ${$(m.shipping)}`}${m.noShipping?" \xB7 pick up only":""}</small></span><span class="p tabnum">${$(m.price*y)}</span></li>`).join("")}</ul>
            <div class="sum-totals">
              <div class="row"><span>Subtotal</span><span class="tabnum">${$(p)}</span></div>
              <div class="row"><span>${c?"Local pickup":"Shipping"}</span><span class="tabnum">${c?"Free":$(d)}</span></div>
              <div class="row total"><span>Total</span><span class="tabnum">${$(p+(c?0:d))}</span></div>
              <p class="form-error" data-err hidden></p>
              <button class="btn btn-primary btn-lg btn-block" type="submit" style="margin-top:8px">${h("lock","icon-sm")} Place order</button>
              <p class="form-note">By placing your order you agree to our <a href="${f("/refund-policy")}">refund policy</a>.</p>
            </div>
          </aside>
        </form>`};i(),n.addEventListener("input",o=>{let r=o.target.closest("form");if(!r)return;let c=Object.fromEntries(new FormData(r));Object.assign(s,c,{create:!!c.create}),delete s.password,T.set("ml-co",s)}),n.addEventListener("change",o=>{if(o.target.name==="fulfillment"||o.target.name==="payment"){let r=o.target.closest("form");Object.assign(s,Object.fromEntries(new FormData(r))),delete s.password,T.set("ml-co",s),i()}o.target.matches("[data-create]")&&(w("[data-pw]",n).hidden=!o.target.checked,s.create=o.target.checked)}),n.addEventListener("submit",async o=>{o.preventDefault();let r=o.target,c=Object.fromEntries(new FormData(r)),d=w("[data-err]",r),p=c.fulfillment==="pickup",m=[["co-name",!String(c.name).trim()],["co-email",!/^\S+@\S+\.\S+$/.test(c.email)],["co-phone",String(c.phone).replace(/\D/g,"").length<10]];p||m.push(["co-a1",!String(c.line1).trim()],["co-city",!String(c.city).trim()],["co-state",!/^[A-Za-z]{2}$/.test(String(c.state).trim())],["co-zip",!/^\d{5}(-\d{4})?$/.test(String(c.zip).trim())]),c.create&&m.push(["co-pw",String(c.password||"").length<8]),m.forEach(([S,u])=>{let b=w("#"+S,r);b&&b.setAttribute("aria-invalid",u?"true":"false")});let y=m.find(([,S])=>S);if(y){d.textContent="Please complete the highlighted fields.",d.hidden=!1,w("#"+y[0],r).focus();return}let L=w('button[type="submit"]',r);L.disabled=!0,L.textContent="Placing order\u2026";try{let S=await g.placeOrder({items:B.items().map(u=>({id:u.product.id,qty:u.qty})),customer:{name:c.name.trim(),email:c.email.trim(),phone:c.phone.trim()},fulfillment:c.fulfillment,payment:c.payment,address:p?null:{line1:c.line1.trim(),line2:(c.line2||"").trim(),city:c.city.trim(),state:c.state.trim().toUpperCase(),zip:c.zip.trim()},notes:(c.notes||"").trim(),createAccount:c.create?{password:c.password}:null});B.clear(),T.set("ml-last-order",S.id),a("/order/"+S.id)}catch(S){d.textContent=S.message||"We could not place your order. Please try again.",d.hidden=!1,L.disabled=!1,L.innerHTML=`${h("lock","icon-sm")} Place order`}})}}}function Ue({params:e}){return{title:"Order confirmed",noindex:!0,html:'<div class="wrap" data-order><p style="padding:48px 0" class="muted">Loading your order\u2026</p></div>',async mount(t){let a=w("[data-order]",t),n=await g.getOrder(e.id),s=g.settings();if(!n){a.innerHTML=`<div class="empty" style="margin-block:40px"><h2>Order not found</h2><p class="muted">If you just placed an order, check your email or call ${l(s.phone)}.</p><a class="btn btn-primary" href="${f("/")}">Back to home</a></div>`;return}let i=n.fulfillment==="pickup";a.innerHTML=`<div class="confirm">
        <div class="confirm-head"><span class="check">${h("check")}</span><p class="eyebrow">Order #${n.number}</p><h1>Thank you, ${l(n.customer.name.split(" ")[0])}!</h1>
        <p class="muted" style="max-width:60ch">We received your order and emailed a receipt to <b>${l(n.customer.email)}</b>. ${n.payment==="pickup"?"You\u2019ll pay when you pick up.":"We\u2019ll text a secure payment link to "+l(n.customer.phone)+" once your items are confirmed."}</p></div>
        <dl class="kv">
          <div><dt>Order number</dt><dd class="mono">#${n.number}</dd></div>
          <div><dt>Delivery</dt><dd>${i?"Local pickup (free)":"Shipping"}</dd></div>
          <div><dt>Payment</dt><dd>${n.payment==="pickup"?"Pay at pickup":"Secure payment link"}</dd></div>
          <div><dt>Total</dt><dd class="tabnum">${$(n.total)}</dd></div>
        </dl>
        ${i?`<div class="pickup-box"><b>${h("store","icon-sm")} Pick up at</b><span>${l(s.address1)}, ${l(s.city)}, ${l(s.state)} ${l(s.zip)}</span><span>${l(s.pickupHours)} \u2014 we\u2019ll text you when it\u2019s ready.</span></div>`:`<div class="pickup-box"><b>${h("truck","icon-sm")} Shipping to</b><span>${l(n.address.line1)}${n.address.line2?", "+l(n.address.line2):""}, ${l(n.address.city)}, ${l(n.address.state)} ${l(n.address.zip)}</span></div>`}
        <div class="summary" style="position:static"><h2>Items</h2><ul class="sum-items" style="max-height:none">${n.items.map(o=>`<li class="sum-item"><span class="th">${A(o.image,{alt:"",sizes:"56px"})}<span class="q">${o.qty}</span></span><span class="t">${l(o.title)}<small>${o.qty} \xD7 ${$(o.price)}</small></span><span class="p tabnum">${$(o.price*o.qty)}</span></li>`).join("")}</ul>
        <div class="sum-totals"><div class="row"><span>Subtotal</span><span class="tabnum">${$(n.subtotal)}</span></div><div class="row"><span>${i?"Local pickup":"Shipping"}</span><span class="tabnum">${i?"Free":$(n.shippingTotal)}</span></div><div class="row total"><span>Total</span><span class="tabnum">${$(n.total)}</span></div></div></div>
        <div class="hero-cta"><a class="btn btn-primary" href="${f("/products?deals=1")}">Keep shopping</a><a class="btn" href="${H(s.phone)}">${h("phone","icon-sm")} Questions? ${l(s.phone)}</a></div>
      </div>`}}}function Ge(){return{title:"My account",noindex:!0,html:'<div class="page-head"><div class="wrap"><h1>My account</h1><p>Accounts are optional \u2014 you can always check out as a guest.</p></div></div><div class="wrap" data-acct style="padding-block:28px 64px;max-width:760px"></div>',async mount(e){let t=w("[data-acct]",e),a=async(n="login")=>{let s=await g.account.me();if(s){t.innerHTML=`<div style="display:grid;gap:20px"><div class="info-card"><h2>${l(s.name||"Welcome back")}</h2><p class="muted">${l(s.email)}${s.phone?" \xB7 "+l(s.phone):""}</p><div><button class="btn btn-sm" type="button" data-logout>${h("logout","icon-sm")} Sign out</button></div></div>
          <h2 class="display" style="font-size:26px">Order history</h2>
          ${s.orders.length?`<div class="table-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Delivery</th><th>Total</th></tr></thead><tbody>${s.orders.map(i=>`<tr><td><a href="${f("/order/"+i.id)}" class="mono"><b>#${i.number}</b></a></td><td>${new Date(i.createdAt).toLocaleDateString()}</td><td><span class="status s-${i.status}">${l(i.status)}</span></td><td>${i.fulfillment==="pickup"?"Pickup":"Shipping"}</td><td class="tabnum">${$(i.total)}</td></tr>`).join("")}</tbody></table></div>`:'<p class="muted">No orders yet.</p>'}</div>`;return}t.innerHTML=`<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="${n==="login"}" data-tab="login">Sign in</button><button type="button" role="tab" aria-selected="${n==="register"}" data-tab="register">Create account</button></div>
          <form class="form" novalidate data-acct-form="${n}" style="padding-top:20px;max-width:440px">
            ${n==="register"?'<div class="field"><label for="ac-name">Name</label><input id="ac-name" name="name" autocomplete="name" required></div><div class="field"><label for="ac-phone">Phone <span class="opt">(optional)</span></label><input id="ac-phone" name="phone" type="tel" autocomplete="tel"></div>':""}
            <div class="field"><label for="ac-email">Email</label><input id="ac-email" name="email" type="email" autocomplete="email" required></div>
            <div class="field"><label for="ac-pw">Password</label><input id="ac-pw" name="password" type="password" autocomplete="${n==="register"?"new-password":"current-password"}" required minlength="8"></div>
            <p class="form-error" data-err hidden></p>
            <button class="btn btn-primary btn-lg" type="submit">${n==="register"?"Create account":"Sign in"}</button>
          </form>`};t.addEventListener("click",async n=>{let s=n.target.closest("[data-tab]");s&&a(s.dataset.tab),n.target.closest("[data-logout]")&&(await g.account.logout(),ee("Signed out"),a())}),t.addEventListener("submit",async n=>{n.preventDefault();let s=n.target,i=Object.fromEntries(new FormData(s)),o=w("[data-err]",s);if(!/^\S+@\S+\.\S+$/.test(i.email)||String(i.password).length<8||s.dataset.acctForm==="register"&&!String(i.name).trim()){o.textContent="Enter your name, a valid email and a password of at least 8 characters.",o.hidden=!1;return}try{s.dataset.acctForm==="register"?await g.account.register(i):await g.account.login(i),ee("Signed in"),a()}catch(r){o.textContent=r.message,o.hidden=!1}}),a()}}}function te(e){let t=de().slice(0,4);return{title:"Not found",noindex:!0,status:404,html:`<div class="wrap section"><div class="empty" style="margin-bottom:40px"><h2>${l(e||"Page not found")}</h2><p class="muted">Try searching, or check out these deals.</p><a class="btn btn-primary" href="${f("/products")}">Browse all products</a></div><div class="grid cols-4">${t.map(a=>F(a)).join("")}</div></div>`,mount:a=>U(a)}}var mt=[[/^\/$/,()=>He()],[/^\/products\/?$/,(e,t)=>pe(t)],[/^\/products\/([^/?#]+)\/?$/,(e,t)=>De({...t,params:{slug:decodeURIComponent(e[1])}})],[/^\/categories\/?$/,()=>Oe()],[/^\/categories\/([^/?#]+)\/?$/,(e,t)=>{let a=g.category(decodeURIComponent(e[1]));return a?pe({...t,params:{cat:a.slug}}):te("Category not found")}],[/^\/wholesale\/?$/,()=>Re()],[/^\/about\/?$/,()=>We()],[/^\/contact\/?$/,()=>ze()],[/^\/checkout\/?$/,()=>Fe()],[/^\/order\/([^/?#]+)\/?$/,e=>Ue({params:{id:decodeURIComponent(e[1])}})],[/^\/account\/?$/,()=>Ge()],[/^\/shipping-policy\/?$/,()=>ue({kind:"shipping"})],[/^\/refund-policy\/?$/,()=>ue({kind:"refund"})],[/^\/admin(?:\/.*)?$/,"admin"]],he=M.cfg.startPath||"/",G=null,je={};function Ve(){if(M.routing==="path"){let e=location.pathname;return e.startsWith(M.rootPath)&&(e="/"+e.slice(M.rootPath.length)),e=e.replace(/index\.html$/,"").replace(/404\.html$/,""),(e||"/")+location.search}return M.routing==="hash"?(location.hash.startsWith("#/")?location.hash.slice(1):"/")||"/":he}function ft(e){if(!e||e.startsWith("mailto:")||e.startsWith("tel:"))return null;if(M.routing!=="path")return e.startsWith("#/")?e.slice(1):null;let t;try{t=new URL(e,location.href)}catch{return null}return t.origin!==location.origin||!t.pathname.startsWith(M.rootPath)||/\.[a-z0-9]{2,5}$/i.test(t.pathname)&&!/index\.html$/.test(t.pathname)||t.hash&&t.pathname===location.pathname&&t.search===location.search?null:"/"+t.pathname.slice(M.rootPath.length).replace(/index\.html$/,"")+t.search}function j(e,{replace:t=!1}={}){let a=Ve();if(je[a]=window.scrollY,M.routing==="path")history[t?"replaceState":"pushState"]({},"",f(e));else if(M.routing==="hash")if(t)history.replaceState(null,"","#"+e);else{location.hash=e;return}else he=e;se({scroll:t?null:0})}var gt=e=>{M.routing==="path"?history.replaceState({},"",f(e)):M.routing==="hash"?history.replaceState(null,"","#"+e):he=e},ae=null;async function bt(){return ae||(window.MLAdmin||await new Promise((e,t)=>{let a=document.createElement("script");a.src=M.root+"assets/admin.js",a.onload=e,a.onerror=t,document.head.appendChild(a)}),ae=window.MLAdmin)}async function se({scroll:e=0}={}){let t=Ve(),[a,n]=t.split("?"),s=new URLSearchParams(n||"");if(G){try{G()}catch{}G=null}z(!0);let i=w("#main"),o=document.body,r=null,c=null;for(let[m,y]of mt)if(c=a.match(m),c){r=y;break}if(r==="admin"){o.classList.add("is-admin");let m=await bt();re({title:"Admin",path:"/admin",noindex:!0}),i.innerHTML="",G=await m.mount(i,{store:g,navigate:j,query:s}),window.scrollTo(0,0);return}o.classList.remove("is-admin");let d=r?r(c,{query:s,navigate:j,path:a}):te();if(re({title:d.title,description:d.description,path:d.path||a,image:d.image,jsonld:d.jsonld,noindex:d.noindex}),i.innerHTML=d.html,i.classList.remove("enter"),i.offsetWidth,i.classList.add("enter"),Ae(a),d.mount){let m=d.mount(i,{navigate:j,navigateReplace:gt,query:s});typeof m=="function"&&(G=m)}if(e===null)return;let p=je[t];window.scrollTo({top:e==="restore"&&p!=null?p:0,behavior:"instant"})}async function vt(){let e=document.getElementById("app");await g.init(),e.innerHTML=`${Ce()}<main id="main" tabindex="-1"></main>${Te()}${Pe()}${qe()}`,Ee(j),document.addEventListener("click",t=>{if(t.defaultPrevented||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;let a=t.target.closest("a[href]");if(!a||a.target==="_blank"||a.hasAttribute("download"))return;let n=ft(a.getAttribute("href"));n!=null&&(t.preventDefault(),j(n))}),M.routing==="path"&&window.addEventListener("popstate",()=>se({scroll:"restore"})),M.routing==="hash"&&window.addEventListener("hashchange",()=>se({scroll:0})),window.addEventListener("store:changed",()=>{g.refresh()}),await se({scroll:null}),document.documentElement.classList.add("ready")}vt().catch(e=>{console.error(e);let t=document.getElementById("app");t&&(t.innerHTML='<div style="padding:40px;font:16px system-ui">The store could not load. Please refresh the page.</div>')});})();
