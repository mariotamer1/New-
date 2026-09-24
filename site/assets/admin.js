(()=>{var be=typeof window<"u"&&window.ML_CONFIG||{};function Ce(){let n=document.querySelector('meta[name="ml-root"]');try{return new URL(n?n.content:"./",location.href).href}catch{return location.href}}var D={cfg:be,routing:be.routing||(location.protocol==="file:"?"hash":"path"),root:Ce(),embed:typeof window<"u"&&window.ML_EMBED||null};D.rootPath=new URL(D.root).pathname;var g=(n,m=document)=>m.querySelector(n),_=(n,m=document)=>Array.from(m.querySelectorAll(n)),i=n=>String(n??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[m]),P=n=>"$"+Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),ee=n=>n.originalPrice&&Number(n.originalPrice)>Number(n.price)?Math.round((1-n.price/n.originalPrice)*100):0,Y=n=>String(n||"").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/["']/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);var R=(n,m)=>{try{return new Date(n).toLocaleString("en-US",m?{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}:{month:"short",day:"numeric",year:"numeric"})}catch{return""}},W=n=>"tel:"+String(n||"").replace(/[^\d+]/g,""),U=n=>Math.round(Number(n)*100)/100;function j(n){return n=n||"/",D.routing==="path"?D.rootPath+n.replace(/^\//,""):"#"+n}function G(n){return n?/^(https?:|data:|blob:)/.test(n)?n:D.embed&&D.embed[n]?D.embed[n]:D.root+n:""}function ie(n,{alt:m="",sizes:x="(min-width:1024px) 25vw, 50vw",eager:S=!1,cls:u="",w:M=480}={}){if(!n)return`<img class="${u}" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" width="${M}" height="${M}">`;let y=G(n.sm||n.lg),h=G(n.lg||n.sm),q=y!==h&&!D.embed?` srcset="${i(y)} 480w, ${i(h)} 960w" sizes="${x}"`:"";return`<img class="${u}" src="${i(y)}"${q} alt="${i(m||n.alt||"")}" width="${M}" height="${M}" ${S?'fetchpriority="high"':'loading="lazy"'} decoding="async">`}var Le={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',bag:'<path d="M5.5 8h13l-1 13h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',menu:'<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',down:'<path d="m6 9 6 6 6-6"/>',left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>',grid4:'<path d="M3 5h3.5v5.5H3zM8.5 5H12v5.5H8.5zM14 5h3.5v5.5H14zM19.5 5H21v5.5h-1.5zM3 13.5h3.5V19H3zM8.5 13.5H12V19H8.5zM14 13.5h3.5V19H14zM19.5 13.5H21V19h-1.5z"/>',grid2:'<rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/>',list:'<rect x="3.5" y="4.5" width="5" height="5"/><rect x="3.5" y="14.5" width="5" height="5"/><path d="M11.5 6h9M11.5 8.5h6M11.5 16h9M11.5 18.5h6"/>',rows:'<rect x="2.5" y="6" width="6" height="12"/><rect x="10" y="6" width="6" height="12"/><path d="M17.5 6h4v12h-4"/>',truck:'<path d="M2.5 6.5h11.5v10H2.5z"/><path d="M14 9.5h4.2l3.3 3.4v3.6H14"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',store:'<path d="M4 10.5V20h16v-9.5"/><path d="M3 10.5 5 4h14l2 6.5z"/><path d="M9.5 20v-5.5h5V20"/>',tag:'<path d="M3 12.5V4h8.5l9.5 9.5-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',box:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',check:'<path d="m4.5 12.5 5 5 10-11"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13.5h10L18 7"/>',phone:'<path d="M5 3.5h3.5l2 5-2.5 1.6a11 11 0 0 0 5.9 5.9l1.6-2.5 5 2v3.5a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2"/>',mail:'<rect x="3" y="5" width="18" height="14"/><path d="m3.5 6 8.5 7 8.5-7"/>',pin:'<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',calendar:'<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',filter:'<path d="M3.5 6h17M7 12h10M10.5 18h3"/>',refund:'<path d="M4 12a8 8 0 1 0 2.8-6.1"/><path d="M4 4.5v4.5h4.5"/>',percent:'<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',lock:'<rect x="4.5" y="10.5" width="15" height="10"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',eye:'<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',logout:'<path d="M14 4h6v16h-6"/><path d="M10 8l-4 4 4 4M6 12h10"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/>',inbox:'<path d="M3 13.5 5.5 5h13l2.5 8.5V19H3z"/><path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',cash:'<rect x="2.5" y="6" width="19" height="12"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9v6M18 9v6"/>',link:'<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',grip:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z"/>',home:'<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/>',msg:'<path d="M4 5h16v11H9l-5 4z"/>',download:'<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>'},p=(n,m="")=>`<svg class="icon ${m}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${Le[n]||""}</svg>`,Pe="M0 0H35L48 13V48H0Z M36.4 9a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0Z M6 41V20H11.6L15 30.4L18.4 20H24V41H19.3V29.6L16.9 36.6H13.1L10.7 29.6V41Z M27 20H32.2V36H41V41H27Z",Ee=n=>`<svg viewBox="0 0 48 48" ${n?`role="img" aria-label="${n}"`:'aria-hidden="true"'}><path fill="currentColor" fill-rule="evenodd" d="${Pe}"/></svg>`,te=(n=!0)=>`${Ee()}${n?'<span class="logo-word">GROUP</span>':""}`;var ge={"ultrabook-laptop-16gb-512gb":[1,2],"tablet-with-stylus-64gb":[1,2],"curved-ultrawide-monitor-34-inch":[1,2],"4k-ips-monitor-27-inch":[1,2],"mechanical-keyboard-hot-swap":[1,2],"wireless-optical-mouse":[1,2],"gaming-desktop-pc-32gb":[1,2],"portable-bluetooth-cd-boombox":[1,2,3],"ddr4-desktop-memory-32gb":[1,2],"instant-film-camera-white":[1,2],"aluminum-travel-tripod-60-inch":[1,2],"usb-c-charging-cable-3-pack":[1,2],"2tb-internal-hard-drive":[1,2],"mid-century-leather-sofa-cognac":[1,2],"velvet-accent-chair-mango":[1,2,3],"velvet-loveseat-navy":[1,2],"upholstered-armchair-slate-blue":[1,2],"porcelain-teacup-saucer-set":[1,2],"glass-serving-dish-with-dome":[1,2],"insulated-water-bottle-24-oz":[1,2],"white-oak-side-table":[1,2],"matte-white-pendant-light":[1,2],"glass-bud-vase-faux-stems":[1,2],"portable-steel-toolbox-20-inch":[1,2],"screwdriver-set-6-piece":[1,2],"tape-measure-25-ft":[1,2],"garden-hand-trowel":[1,2],"robot-vacuum-cleaner":[1,2],"countertop-microwave-1-1-cu-ft":[1,2],"stainless-electric-kettle-1-7l":[1,2],"stainless-2-slice-toaster":[1,2],"glass-door-beverage-cooler":[1,2],"vintage-tin-toy-car":[1,2,3],"weighted-wooden-chess-set":[1,2,3],"building-bricks-set-500-piece":[1,2],"cruiser-skateboard-22-inch":[1,2],"aluminum-road-bike-54cm":[1,2],"4-person-dome-tent":[1,2],"commuter-backpack-blue":[1,2],"messenger-bag-black":[1],"rolling-duffle-bag":[1],"dual-time-analog-watch":[1],"resistance-band-kit":[1],"indoor-outdoor-basketball":[1,2],"live-bonsai-tree":[1,2]};var ve={storeName:"ML Group",phone:"(425) 757-2554",email:"Hi@mariotamer.com",address1:"",city:"Auburn",state:"WA",zip:"",pickupHours:"Mon\u2013Fri 11am\u201310pm \xB7 Sat\u2013Sun 9am\u20139pm",pickupNote:"Bring your order number. We load large items for you.",announcement:"Local pickup always available \xB7 Ships nationwide \xB7 New deals every week"};function Ae(n){let m=("850316"+String(n*7919%1e5).padStart(5,"0")).slice(0,11),x=0;for(let S=0;S<11;S++)x+=Number(m[S])*(S%2===0?3:1);return m+(10-x%10)%10}var De=n=>"cat-"+n,Ie=[["ultrabook-laptop-16gb-512gb",'15.6" Ultrabook Laptop \u2013 16GB RAM, 512GB SSD',"Nexa","electronics","Refurbished",629,1099,19.99,4,!0,`Thin aluminum laptop with a 15.6" Full HD display, 12th-gen quad-core processor, 16GB RAM and a fast 512GB SSD. Professionally refurbished, tested and wiped.

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
\u2022 10" tall`]],Oe=Date.UTC(2026,8,20),ye=Ie.map((n,m)=>{let[x,S,u,M,y,h,q,L,c,se,Z]=n,T=(ge[x]||[]).map((I,V)=>({sm:`img/p/${x}-${I}-sm.webp`,lg:`img/p/${x}-${I}-lg.webp`,alt:V===0?S:`${S} \u2013 view ${V+1}`}));return{id:"p-"+String(m+1).padStart(3,"0"),slug:x,title:S,brand:u,categoryId:De(M),condition:y,price:h,originalPrice:q,shipping:L,inventory:c,bestDeal:se,published:!0,noShipping:x==="live-bonsai-tree",upc:Ae(m+11),description:Z,images:T,createdAt:new Date(Oe-m*36e5*7).toISOString()}});var nt={products:[],categories:[],settings:{...ve}};function k(n,m=""){let x=g(".toasts");x||(x=document.createElement("div"),x.className="toasts",x.setAttribute("role","status"),x.setAttribute("aria-live","polite"),document.body.appendChild(x));let S=document.createElement("div");S.className="toast "+m,S.innerHTML=`${p(m==="err"?"close":"check","icon-sm")}<span>${i(n)}</span>`,x.appendChild(S),setTimeout(()=>{S.style.opacity="0",S.style.transition="opacity .3s",setTimeout(()=>S.remove(),320)},2600)}var _e=[["overview","Overview","chart"],["products","Products","tag"],["orders","Orders","box"],["offers","Offers","cash"],["requests","Requests","calendar"],["messages","Messages","msg"],["categories","Categories","layers"],["settings","Settings","gear"]],Re=["New","Open Box","Like New","Refurbished","Used \u2013 Good","Used \u2013 Fair","Scratch & Dent"],ae=[["new","New"],["processing","Processing"],["ready","Ready for pickup"],["shipped","Shipped"],["completed","Completed"],["cancelled","Cancelled"]],we=[["new","New"],["contacted","Contacted"],["accepted","Accepted"],["declined","Declined"]],Ue=[["new","New"],["read","Read"],["archived","Archived"]];function je(n,{store:m,navigate:x,query:S}){let u=m.admin,M=S.get("tab")||"overview",y=S.get("edit")||null,h={products:[],orders:[],offers:[],inquiries:[]},q={q:"",f:"all"},L=new Set,c=null,se=()=>{let s=new URLSearchParams;M!=="overview"&&s.set("tab",M),y&&s.set("edit",y);let e="/admin"+(s.toString()?"?"+s:"");D.routing==="path"?history.replaceState({},"",j(e)):D.routing==="hash"&&history.replaceState(null,"","#"+e)},Z=s=>(m.category(s)||{}).name||"\u2014",T=()=>{m.refresh(),window.dispatchEvent(new CustomEvent("cart:change"))};async function I(){let[s,e,t,a]=await Promise.all([u.products(),u.orders(),u.offers(),u.inquiries()]);h={products:s,orders:e,offers:t,inquiries:a}}async function V(s){n.innerHTML=`<div class="adm-login"><form class="adm-login-card" novalidate data-login>
      <a class="logo adm-logo" href="${j("/")}" aria-label="Back to store">${te()}</a>
      <div><h1>Admin sign in</h1><p class="muted">Enter the store password to manage listings, orders and offers.</p></div>
      <div class="field"><label for="adm-pw">Password</label><input id="adm-pw" name="pw" type="password" autocomplete="current-password" required autofocus></div>
      <p class="form-error" data-err ${s?"":"hidden"}>${i(s||"")}</p>
      <button class="btn btn-primary btn-lg btn-block" type="submit">${p("lock","icon-sm")} Sign in</button>
      ${m.kind==="local"?`<p class="form-note">${m.offline?"Store database unreachable \u2014 using this browser\u2019s copy.":"Preview mode: changes are saved in this browser."}</p>`:""}
      <a class="link" href="${j("/")}" style="justify-self:center;font-size:14px">\u2190 Back to store</a>
    </form></div>`,setTimeout(()=>{let e=g("#adm-pw");e&&e.focus()},30)}function H(s,e,t=""){let a=(w,O="new")=>h[w].filter(r=>r.status===O).length,o={orders:a("orders"),offers:a("offers"),requests:h.inquiries.filter(w=>w.type==="pickup"&&w.status==="new").length,messages:h.inquiries.filter(w=>w.type!=="pickup"&&w.status==="new").length};return`<div class="admin">
      <aside class="adm-side on-ink">
        <a class="logo" href="${j("/")}" aria-label="View store">${te()}</a>
        <span class="adm-tag">Admin</span>
        <nav aria-label="Admin"><ul>${_e.map(([w,O,r])=>`<li><button type="button" data-tab="${w}" ${M===w?'aria-current="page"':""}>${p(r)}<span>${O}</span>${o[w]?`<b class="adm-badge">${o[w]}</b>`:""}</button></li>`).join("")}</ul></nav>
        <div class="adm-side-foot"><a href="${j("/")}">${p("eye","icon-sm")} View store</a><button type="button" data-logout>${p("logout","icon-sm")} Sign out</button></div>
      </aside>
      <section class="adm-main">
        <header class="adm-top"><h1>${e}</h1><div class="adm-actions">${t}</div></header>
        ${m.kind==="local"?`<p class="adm-note">${p("lock","icon-sm")} ${m.offline?"The store database could not be reached, so changes are saved only in this browser.":"Preview mode \u2014 changes are saved in this browser. Connect the store database to publish changes to every customer."}</p>`:""}
        <div class="adm-body">${s}</div>
      </section>
    </div>`}async function N(){if(!await u.session()){V();return}if(await I(),se(),M==="products"&&y)return $e();({overview:oe,products:K,orders:X,offers:ce,requests:ne,messages:de,categories:J,settings:xe}[M]||oe)()}function oe(){let s=h.products,e=s.filter(r=>r.published&&r.inventory>0),t=s.filter(r=>r.inventory<=0),a=s.filter(r=>r.inventory>0&&r.inventory<=2).slice(0,6),o=Date.now()-30*864e5,w=h.orders.filter(r=>r.status!=="cancelled"&&new Date(r.createdAt)>o).reduce((r,C)=>r+C.total,0),O=[["Live listings",e.length,"Published and in stock"],["Units in stock",s.reduce((r,C)=>r+Math.max(0,C.inventory),0),`${t.length} sold out (hidden)`],["New orders",h.orders.filter(r=>r.status==="new").length,`${h.orders.length} total`],["New offers",h.offers.filter(r=>r.status==="new").length,`${h.offers.length} total`],["Sales \xB7 30 days",P(w),"Excludes cancelled"],["Messages",h.inquiries.filter(r=>r.status==="new").length,"Contact + wholesale"]];n.innerHTML=H(`
      <div class="adm-tiles">${O.map(([r,C,l])=>`<div class="adm-tile"><span class="eyebrow">${r}</span><b class="tabnum">${C}</b><span class="muted">${l}</span></div>`).join("")}</div>
      <div class="adm-cols">
        <section class="adm-card"><div class="adm-card-head"><h2>Recent orders</h2><button class="link" type="button" data-tab="orders">All orders</button></div>
          ${h.orders.length?`<ul class="adm-list">${h.orders.slice(0,6).map(r=>`<li><button type="button" data-open-order="${r.id}"><span><b class="mono">#${r.number}</b> ${i(r.customer.name)}<small>${R(r.createdAt,!0)} \xB7 ${r.items.length} item${r.items.length>1?"s":""} \xB7 ${r.fulfillment==="pickup"?"Pickup":"Ship"}</small></span><span class="tabnum">${P(r.total)}</span><span class="status s-${r.status}">${re(ae,r.status)}</span></button></li>`).join("")}</ul>`:'<p class="muted adm-empty">No orders yet. They appear here as soon as a customer checks out.</p>'}
        </section>
        <section class="adm-card"><div class="adm-card-head"><h2>Latest offers</h2><button class="link" type="button" data-tab="offers">All offers</button></div>
          ${h.offers.length?`<ul class="adm-list">${h.offers.slice(0,6).map(r=>`<li><button type="button" data-tab="offers"><span><b>${P(r.amount)}</b> for ${i(r.productTitle)}<small>${i(r.name)} \xB7 ${i(r.phone)} \xB7 ${R(r.createdAt,!0)}</small></span><span class="status s-${r.status}">${re(we,r.status)}</span></button></li>`).join("")}</ul>`:'<p class="muted adm-empty">No offers yet. Offers from the \u201CMake Offer\u201D button land here.</p>'}
        </section>
        <section class="adm-card"><div class="adm-card-head"><h2>Low stock</h2><button class="link" type="button" data-tab="products">Inventory</button></div>
          ${a.length?`<ul class="adm-list">${a.map(r=>`<li><button type="button" data-edit="${r.id}"><span>${i(r.title)}<small>${Z(r.categoryId)}</small></span><b class="tabnum">${r.inventory} left</b></button></li>`).join("")}</ul>`:'<p class="muted adm-empty">Nothing is running low.</p>'}
        </section>
      </div>`,"Overview",`<button class="btn btn-primary" type="button" data-new>${p("plus","icon-sm")} Add product</button>`)}let re=(s,e)=>(s.find(([t])=>t===e)||[e,e])[1];function K(){let s=q.q.toLowerCase(),e=h.products.filter(a=>!s||`${a.title} ${a.brand||""} ${a.upc||""} ${a.slug}`.toLowerCase().includes(s)),t=q.f;t==="live"&&(e=e.filter(a=>a.published&&a.inventory>0)),t==="hidden"&&(e=e.filter(a=>!a.published)),t==="out"&&(e=e.filter(a=>a.inventory<=0)),L=new Set([...L].filter(a=>h.products.some(o=>o.id===a))),n.innerHTML=H(`
      <div class="adm-toolbar">
        <div class="search-field adm-search">${p("search")}<label class="sr-only" for="pf-q">Search products</label><input id="pf-q" type="search" placeholder="Search title, brand, UPC" value="${i(q.q)}" data-pf-q></div>
        <div class="select"><label class="sr-only" for="pf-f">Show</label><select id="pf-f" data-pf-f>${[["all","All products"],["live","Live"],["hidden","Unpublished"],["out","Sold out"]].map(([a,o])=>`<option value="${a}" ${t===a?"selected":""}>${o}</option>`).join("")}</select>${p("down")}</div>
        <span class="muted" style="font-size:14px">${e.length} of ${h.products.length}</span>
      </div>
      <div class="adm-bulk" data-bulk ${L.size?"":"hidden"}>
        <b data-bulk-n>${L.size} selected</b>
        <label class="adm-inline">Discount <input type="number" min="1" max="95" value="20" data-bulk-pct aria-label="Discount percent"> %</label>
        <button class="btn btn-sm" type="button" data-bulk="discount">Apply discount</button>
        <button class="btn btn-sm" type="button" data-bulk="publish">Publish</button>
        <button class="btn btn-sm" type="button" data-bulk="unpublish">Unpublish</button>
        <button class="btn btn-sm" type="button" data-bulk="delete">Delete</button>
      </div>
      <div class="table-wrap"><table class="tbl adm-table"><thead><tr>
        <th><input type="checkbox" aria-label="Select all" data-sel-all ${e.length&&e.every(a=>L.has(a.id))?"checked":""}></th>
        <th>Product</th><th>Price</th><th>Inventory</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
        ${e.map(a=>`<tr data-row="${a.id}" class="${a.inventory<=0||!a.published?"dim":""}">
          <td><input type="checkbox" aria-label="Select ${i(a.title)}" data-sel="${a.id}" ${L.has(a.id)?"checked":""}></td>
          <td><div class="adm-prod">${a.images[0]?`<img src="${i(G(a.images[0].sm))}" alt="" width="48" height="48" loading="lazy">`:'<span class="adm-noimg"></span>'}<div><button class="adm-title" type="button" data-edit="${a.id}">${i(a.title)}</button><small>${i(Z(a.categoryId))} \xB7 ${i(a.condition)}${a.noShipping?" \xB7 Pick up only":""}${a.upc?" \xB7 "+i(a.upc):""}</small></div></div></td>
          <td class="tabnum"><b>${P(a.price)}</b>${ee(a)?`<small><s>${P(a.originalPrice)}</s> \xB7 -${ee(a)}%</small>`:""}</td>
          <td><div class="adm-stock"><button type="button" aria-label="Decrease inventory" data-inv="-1" data-id="${a.id}">${p("minus","icon-sm")}</button><b class="tabnum">${a.inventory}</b><button type="button" aria-label="Increase inventory" data-inv="1" data-id="${a.id}">${p("plus","icon-sm")}</button></div>${a.inventory<=0?"<small>Sold out \xB7 hidden</small>":""}</td>
          <td><label class="switch"><input type="checkbox" data-pub="${a.id}" ${a.published?"checked":""}><span>${a.published?"Published":"Hidden"}</span></label></td>
          <td class="adm-row-actions"><button class="btn btn-sm" type="button" data-edit="${a.id}">${p("edit","icon-sm")} Edit</button>${a.published&&a.inventory>0?`<a class="btn btn-sm" href="${j("/products/"+a.slug)}" target="_blank" rel="noopener" aria-label="View ${i(a.title)} on the store">${p("eye","icon-sm")}</a>`:""}</td>
        </tr>`).join("")||'<tr><td colspan="6" class="muted">No products match.</td></tr>'}
      </tbody></table></div>`,"Products",`<button class="btn btn-primary" type="button" data-new>${p("plus","icon-sm")} Add product</button>`)}function $e(){let s=y==="new",e=s?null:h.products.find(o=>o.id===y);if(!s&&!e)return y=null,K();(!c||c._for!==y)&&(c=e?JSON.parse(JSON.stringify(e)):{title:"",slug:"",brand:"",upc:"",condition:"New",categoryId:(m.categories()[0]||{}).id||null,description:"",price:"",originalPrice:"",shipping:9.99,inventory:1,published:!0,bestDeal:!1,images:[]},c._for=y);let t=c,a=t.originalPrice&&t.price&&Number(t.originalPrice)>Number(t.price)?Math.round((1-t.price/t.originalPrice)*100):"";n.innerHTML=H(`
      <form class="adm-editor" novalidate data-editor>
        <div class="adm-ed-main">
          <section class="adm-card"><div class="adm-card-head"><h2>Details</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-title">Title</label><input id="ed-title" name="title" required maxlength="140" value="${i(t.title)}" placeholder="e.g. 55&quot; 4K Smart TV \u2013 Open Box"></div>
            <div class="field"><label for="ed-desc">Description</label><textarea id="ed-desc" name="description" rows="8" placeholder="What it is, condition notes, what\u2019s included. Start lines with \u2022 for bullet points.">${i(t.description)}</textarea></div>
            <div class="form-row two">
              <div class="field"><label for="ed-brand">Brand <span class="opt">(optional)</span></label><input id="ed-brand" name="brand" value="${i(t.brand||"")}"></div>
              <div class="field"><label for="ed-upc">UPC <span class="opt">(optional)</span></label><input id="ed-upc" name="upc" inputmode="numeric" maxlength="14" value="${i(t.upc||"")}"><span class="hint">8\u201314 digits from the barcode.</span></div>
            </div>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Photos</h2><span class="muted" style="font-size:13px">First photo is the cover. Drag to reorder.</span></div><div class="adm-card-body">
            <div class="adm-photos" data-photos>${le(t)}</div>
            <label class="adm-drop" data-drop><input type="file" accept="image/*" multiple data-files class="sr-only">${p("upload")}<span><b>Add photos</b> \u2014 click or drop images here</span><small>JPG, PNG, WebP or HEIC-converted. Resized automatically.</small></label>
            <p class="muted" data-upload-status aria-live="polite" style="font-size:13px"></p>
          </div></section>
        </div>
        <div class="adm-ed-side">
          <section class="adm-card"><div class="adm-card-head"><h2>Visibility</h2></div><div class="adm-card-body form">
            <label class="switch big"><input type="checkbox" name="published" ${t.published?"checked":""}><span>Published on the store</span></label>
            <p class="hint">Items with 0 in stock are hidden automatically.</p>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Pricing</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-orig">Original / retail price</label><div class="money-input"><span>$</span><input id="ed-orig" name="originalPrice" type="number" inputmode="decimal" min="0" step="0.01" value="${i(t.originalPrice??"")}"></div></div>
            <div class="form-row two">
              <div class="field"><label for="ed-pct">Discount %</label><input id="ed-pct" name="pct" type="number" inputmode="numeric" min="0" max="95" step="1" value="${a}"></div>
              <div class="field"><label for="ed-price">Sale price</label><div class="money-input"><span>$</span><input id="ed-price" name="price" type="number" inputmode="decimal" min="0" step="0.01" required value="${i(t.price??"")}"></div></div>
            </div>
            <p class="hint" data-price-hint>Enter a discount % to calculate the sale price automatically.</p>
            <div class="field"><label for="ed-ship">Shipping price</label><div class="money-input"><span>$</span><input id="ed-ship" name="shipping" type="number" inputmode="decimal" min="0" step="0.01" value="${i(t.shipping??0)}"></div><span class="hint">Local pickup is always free.</span></div>
            <label class="check-row"><input type="checkbox" name="noShipping" ${t.noShipping?"checked":""}> <span><b>Not available for shipping</b><br><span class="hint">The store will only show \u201CAvailable for pick up\u201D.</span></span></label>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Inventory</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-inv">Quantity in stock</label><div class="qty" style="height:46px"><button type="button" aria-label="Decrease" data-ed-inv="-1">${p("minus","icon-sm")}</button><input id="ed-inv" name="inventory" type="number" inputmode="numeric" min="0" step="1" value="${i(t.inventory)}" style="width:80px"><button type="button" aria-label="Increase" data-ed-inv="1">${p("plus","icon-sm")}</button></div></div>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Organize</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-cat">Category</label><select id="ed-cat" name="categoryId">${m.categories().map(o=>`<option value="${o.id}" ${t.categoryId===o.id?"selected":""}>${i(o.name)}</option>`).join("")}<option value="" ${t.categoryId?"":"selected"}>Uncategorized</option></select></div>
            <div class="field"><label for="ed-cond">Condition</label><select id="ed-cond" name="condition">${Re.map(o=>`<option ${t.condition===o?"selected":""}>${o}</option>`).join("")}</select></div>
            <div class="field"><label for="ed-slug">Web address</label><input id="ed-slug" name="slug" value="${i(t.slug)}" placeholder="auto from title"><span class="hint">/products/<b data-slug-preview>${i(t.slug||Y(t.title)||"product-name")}</b></span></div>
          </div></section>
          <p class="form-error" data-err hidden></p>
          <div class="adm-ed-actions">
            <button class="btn btn-primary btn-lg" type="submit">${s?"Create product":"Save changes"}</button>
            <button class="btn btn-lg" type="button" data-cancel-edit>Cancel</button>
            ${s?"":`<button class="btn btn-lg adm-danger" type="button" data-delete-product>${p("trash","icon-sm")} Delete</button>`}
          </div>
          <div class="adm-confirm" data-confirm hidden><p><b>Delete this product?</b> This can\u2019t be undone.</p><div><button class="btn btn-sm adm-danger" type="button" data-confirm-delete>Delete</button><button class="btn btn-sm" type="button" data-confirm-cancel>Keep it</button></div></div>
        </div>
      </form>`,s?"New product":"Edit product",`<button class="btn" type="button" data-cancel-edit>${p("left","icon-sm")} All products</button>`),ke()}function le(s){return s.images.length?s.images.map((e,t)=>`<figure class="adm-photo" draggable="true" data-ph="${t}">
      <img src="${i(G(e.sm||e.lg))}" alt="Photo ${t+1}">
      ${t===0?'<span class="adm-cover">Cover</span>':""}
      <figcaption>
        <button type="button" aria-label="Move photo ${t+1} left" data-ph-move="-1" ${t===0?"disabled":""}>${p("left","icon-sm")}</button>
        <span class="mono">${t+1}</span>
        <button type="button" aria-label="Move photo ${t+1} right" data-ph-move="1" ${t===s.images.length-1?"disabled":""}>${p("right","icon-sm")}</button>
        <button type="button" aria-label="Delete photo ${t+1}" data-ph-del>${p("trash","icon-sm")}</button>
      </figcaption></figure>`).join(""):'<p class="muted" style="font-size:14px">No photos yet.</p>'}function ke(){let s=g("[data-editor]"),e=l=>s.elements[l],t=()=>{g("[data-photos]").innerHTML=le(c)},a=()=>{["title","description","brand","upc","slug","condition","categoryId"].forEach(l=>{c[l]=e(l).value}),c.price=e("price").value,c.originalPrice=e("originalPrice").value,c.shipping=e("shipping").value,c.inventory=e("inventory").value,c.published=e("published").checked,c.noShipping=e("noShipping").checked};s.addEventListener("input",l=>{let b=l.target.name,v=parseFloat(e("originalPrice").value),A=parseFloat(e("pct").value),d=parseFloat(e("price").value);b==="pct"&&v>0&&A>=0&&(e("price").value=U(v*(1-A/100)).toFixed(2)),b==="price"&&v>0&&d>=0&&(e("pct").value=d<v?Math.round((1-d/v)*100):""),b==="originalPrice"&&v>0&&A>0&&(e("price").value=U(v*(1-A/100)).toFixed(2)),(b==="title"||b==="slug")&&(g("[data-slug-preview]").textContent=Y(e("slug").value||e("title").value)||"product-name"),a()}),s.addEventListener("change",a),s.addEventListener("click",async l=>{let b=l.target.closest("[data-ed-inv]");b&&(e("inventory").value=Math.max(0,(parseInt(e("inventory").value,10)||0)+Number(b.dataset.edInv)),a());let v=l.target.closest("[data-ph-move]");if(v){let d=Number(v.closest("[data-ph]").dataset.ph),f=d+Number(v.dataset.phMove);[c.images[d],c.images[f]]=[c.images[f],c.images[d]],t()}let A=l.target.closest("[data-ph-del]");if(A){let d=Number(A.closest("[data-ph]").dataset.ph),[f]=c.images.splice(d,1);u.removeImage&&u.removeImage(f).catch(()=>{}),t()}l.target.closest("[data-delete-product]")&&(g("[data-confirm]").hidden=!1),l.target.closest("[data-confirm-cancel]")&&(g("[data-confirm]").hidden=!0),l.target.closest("[data-confirm-delete]")&&(await u.deleteProduct(y),T(),k("Product deleted"),y=null,c=null,N())});let o=null,w=g("[data-photos]");w.addEventListener("dragstart",l=>{let b=l.target.closest("[data-ph]");b&&(o=Number(b.dataset.ph),l.dataTransfer.effectAllowed="move",b.classList.add("dragging"))}),w.addEventListener("dragover",l=>{o!==null&&l.preventDefault()}),w.addEventListener("drop",l=>{let b=l.target.closest("[data-ph]");if(o===null||!b)return;l.preventDefault();let v=Number(b.dataset.ph),[A]=c.images.splice(o,1);c.images.splice(v,0,A),o=null,t()}),w.addEventListener("dragend",()=>{o=null,_(".dragging").forEach(l=>l.classList.remove("dragging"))});let O=g("[data-upload-status]"),r=async l=>{if(l=Array.from(l).filter(b=>b.type.startsWith("image/")),!!l.length){for(let b=0;b<l.length;b++){O.textContent=`Uploading ${b+1} of ${l.length}\u2026`;try{let v=await u.uploadImage(l[b]);c.images.push({...v,alt:""}),t()}catch(v){k(`Couldn\u2019t upload ${l[b].name}: ${v.message}`,"err")}}O.textContent=`${l.length} photo${l.length>1?"s":""} added \u2014 remember to save.`}};g("[data-files]").addEventListener("change",l=>{r(l.target.files),l.target.value=""});let C=g("[data-drop]");C.addEventListener("dragover",l=>{l.dataTransfer.types.includes("Files")&&(l.preventDefault(),C.classList.add("over"))}),C.addEventListener("dragleave",()=>C.classList.remove("over")),C.addEventListener("drop",l=>{l.dataTransfer.files.length&&(l.preventDefault(),C.classList.remove("over"),r(l.dataTransfer.files))}),s.addEventListener("submit",async l=>{l.preventDefault(),a();let b=g("[data-err]"),v=parseFloat(c.price),A=parseFloat(c.originalPrice),d=parseFloat(c.shipping||0),f=parseInt(c.inventory,10),$=String(c.upc||"").replace(/\D/g,""),E=[];if(c.title.trim()||E.push(["ed-title","Add a title."]),v>0||E.push(["ed-price","Enter a sale price greater than $0."]),f>=0||E.push(["ed-inv","Inventory must be 0 or more."]),d>=0||E.push(["ed-ship","Shipping must be 0 or more."]),$&&($.length<8||$.length>14)&&E.push(["ed-upc","UPC should be 8\u201314 digits."]),_("[aria-invalid]",s).forEach(B=>B.removeAttribute("aria-invalid")),E.length){E.forEach(([B])=>g("#"+B).setAttribute("aria-invalid","true")),b.textContent=E.map(B=>B[1]).join(" "),b.hidden=!1,g("#"+E[0][0]).focus();return}let z={id:y==="new"?void 0:y,title:c.title.trim(),slug:c.slug.trim(),brand:c.brand.trim(),upc:$,condition:c.condition,categoryId:c.categoryId||null,description:c.description.trim(),price:U(v),originalPrice:A>v?U(A):null,shipping:U(d),inventory:f,published:c.published,bestDeal:!1,noShipping:!!c.noShipping,images:c.images},F=g('button[type="submit"]',s);F.disabled=!0,F.textContent="Saving\u2026";try{let B=await u.saveProduct(z);return T(),k(y==="new"?"Product created":"Changes saved"),y=null,c=null,M="products",N(),B}catch(B){b.textContent=B.message,b.hidden=!1,F.disabled=!1,F.textContent="Save changes"}})}let Q="all";function X(){let s=h.orders.filter(e=>Q==="all"||e.status===Q);n.innerHTML=H(`
      <div class="adm-toolbar"><div class="select"><label class="sr-only" for="of-f">Status</label><select id="of-f" data-of>${[["all","All orders"],...ae].map(([e,t])=>`<option value="${e}" ${Q===e?"selected":""}>${t}</option>`).join("")}</select>${p("down")}</div><span class="muted" style="font-size:14px">${s.length} order${s.length===1?"":"s"}</span></div>
      ${s.length?`<div class="table-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Delivery</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>
      ${s.map(e=>`<tr><td class="mono"><b>#${e.number}</b></td><td>${R(e.createdAt,!0)}</td><td>${i(e.customer.name)}<small>${i(e.customer.phone)}</small></td><td>${e.items.reduce((t,a)=>t+a.qty,0)}</td><td>${e.fulfillment==="pickup"?"Pickup":"Ship"}</td><td class="tabnum"><b>${P(e.total)}</b></td>
        <td><label class="sr-only" for="os-${e.id}">Status</label><select id="os-${e.id}" class="adm-status" data-order-status="${e.id}">${ae.map(([t,a])=>`<option value="${t}" ${e.status===t?"selected":""}>${a}</option>`).join("")}</select></td>
        <td><button class="btn btn-sm" type="button" data-open-order="${e.id}">View</button></td></tr>`).join("")}
      </tbody></table></div>`:'<div class="empty"><h2>No orders</h2><p class="muted">New orders from checkout appear here instantly.</p></div>'}
      <dialog class="modal adm-order-dlg" id="order-dlg" aria-labelledby="od-title"></dialog>`,"Orders")}function Se(s){let e=h.orders.find(o=>o.id===s);if(!e)return;g("#order-dlg")||(M="orders",X());let t=g("#order-dlg"),a=e.address?`${i(e.address.line1)}${e.address.line2?", "+i(e.address.line2):""}<br>${i(e.address.city)}, ${i(e.address.state)} ${i(e.address.zip)}`:"Local pickup";t.innerHTML=`<div class="modal-head"><h2 id="od-title">Order #${e.number}</h2><button class="icon-btn" type="button" aria-label="Close" data-close-dlg>${p("close")}</button></div>
      <div class="modal-body">
        <dl class="kv"><div><dt>Placed</dt><dd>${R(e.createdAt,!0)}</dd></div><div><dt>Delivery</dt><dd>${e.fulfillment==="pickup"?"Local pickup":"Shipping"}</dd></div><div><dt>Payment</dt><dd>${e.payment==="pickup"?"Pay at pickup":"Send payment link"}</dd></div><div><dt>Total</dt><dd class="tabnum">${P(e.total)}</dd></div></dl>
        <div class="info-card"><h2>Customer</h2><p><b>${i(e.customer.name)}</b></p><p><a href="${W(e.customer.phone)}">${i(e.customer.phone)}</a> \xB7 <a href="mailto:${i(e.customer.email)}">${i(e.customer.email)}</a></p><p class="muted">${a}</p>${e.notes?`<p><b>Notes:</b> ${i(e.notes)}</p>`:""}</div>
        <ul class="sum-items" style="max-height:none;border:1px solid var(--line)">${e.items.map(o=>`<li class="sum-item"><span class="th">${ie(o.image,{alt:"",sizes:"56px"})}<span class="q">${o.qty}</span></span><span class="t">${i(o.title)}<small>${o.qty} \xD7 ${P(o.price)}${o.shipping?" \xB7 ship "+P(o.shipping):""}</small></span><span class="p tabnum">${P(o.price*o.qty)}</span></li>`).join("")}</ul>
        <div class="sum-totals" style="padding:0"><div class="row"><span>Subtotal</span><span class="tabnum">${P(e.subtotal)}</span></div><div class="row"><span>Shipping</span><span class="tabnum">${P(e.shippingTotal)}</span></div><div class="row total"><span>Total</span><span class="tabnum">${P(e.total)}</span></div></div>
        <div class="field"><label for="od-status">Status</label><select id="od-status" data-order-status="${e.id}">${ae.map(([o,w])=>`<option value="${o}" ${e.status===o?"selected":""}>${w}</option>`).join("")}</select></div>
        ${e.status!=="cancelled"?`<div><button class="btn adm-danger" type="button" data-cancel-order="${e.id}">Cancel order &amp; return items to stock</button></div>`:""}
      </div>`,t.showModal()}function ce(){n.innerHTML=H(h.offers.length?`<div class="table-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Product</th><th>List price</th><th>Offer</th><th>Customer</th><th>Status</th><th></th></tr></thead><tbody>
      ${h.offers.map(s=>{let e=h.products.find(a=>a.id===s.productId),t=s.listPrice?Math.round(s.amount/s.listPrice*100):0;return`<tr>
        <td>${R(s.createdAt,!0)}</td>
        <td><div class="adm-prod">${s.productImage?`<img src="${i(G(s.productImage.sm))}" alt="" width="48" height="48">`:""}<div>${e?`<button class="adm-title" type="button" data-edit="${e.id}">${i(s.productTitle)}</button>`:i(s.productTitle)}<small>${e?`${e.inventory} in stock`:"Deleted"}</small></div></div></td>
        <td class="tabnum">${P(s.listPrice)}</td>
        <td class="tabnum"><b>${P(s.amount)}</b><small>${t}% of list</small></td>
        <td>${i(s.name)}<small><a href="${W(s.phone)}">${i(s.phone)}</a> \xB7 <a href="sms:${i(s.phone.replace(/[^\d+]/g,""))}">Text</a></small></td>
        <td><label class="sr-only" for="ofs-${s.id}">Status</label><select id="ofs-${s.id}" class="adm-status" data-offer-status="${s.id}">${we.map(([a,o])=>`<option value="${a}" ${s.status===a?"selected":""}>${o}</option>`).join("")}</select></td>
        <td>${e&&s.status!=="accepted"?`<button class="btn btn-sm" type="button" data-accept-price="${s.id}" title="Set the product price to this offer">Use as price</button>`:""}</td></tr>`}).join("")}
      </tbody></table></div>`:'<div class="empty"><h2>No offers yet</h2><p class="muted">When a customer taps \u201CMake Offer\u201D, their name, phone and amount appear here.</p></div>',"Offers")}function ne(){let s=h.inquiries.filter(t=>t.type==="pickup"),e=t=>{let a=((t.message||"").match(/Pickup request:\s*(.+)/)||[])[1]||"Pickup request",o=((t.message||"").match(/When:\s*(.+)/)||[])[1]||"";return{item:a.trim(),when:o.trim()}};n.innerHTML=H(s.length?`<div class="adm-reqs">${s.map(t=>{let a=e(t),o=String(t.phone||"").replace(/[^\d+]/g,"");return`<details class="adm-req ${t.status==="new"?"unread":""}">
      <summary><span class="adm-req-title"><b>${i(a.item)}</b><small>${p("calendar","icon-sm")} ${i(a.when||R(t.createdAt,!0))}</small></span>${t.status==="new"?'<span class="status s-new">New</span>':`<span class="status s-${t.status}">${t.status==="read"?"Confirmed":"Done"}</span>`}${p("down")}</summary>
      <div class="adm-req-body">
        <dl class="kv"><div><dt>Name</dt><dd>${i(t.name)}</dd></div><div><dt>Phone</dt><dd><a href="${W(t.phone)}">${i(t.phone)}</a></dd></div><div><dt>Pickup time</dt><dd>${i(a.when||"\u2014")}</dd></div><div><dt>Requested</dt><dd>${R(t.createdAt,!0)}</dd></div></dl>
        <div class="adm-req-actions">
          <a class="btn btn-primary" href="sms:${i(o)}">${p("msg","icon-sm")} Text</a>
          <a class="btn" href="${W(t.phone)}">${p("phone","icon-sm")} Call</a>
          <label class="sr-only" for="rq-${t.id}">Status</label><select id="rq-${t.id}" class="adm-status" data-msg-status="${t.id}"><option value="new" ${t.status==="new"?"selected":""}>New</option><option value="read" ${t.status==="read"?"selected":""}>Confirmed</option><option value="archived" ${t.status==="archived"?"selected":""}>Done</option></select>
          <button class="btn btn-sm" type="button" data-msg-del="${t.id}" data-back="requests">${p("trash","icon-sm")} Delete</button>
        </div>
      </div></details>`}).join("")}</div>`:'<div class="empty"><h2>No pickup requests yet</h2><p class="muted">When a customer taps \u201CChoose a date &amp; time\u201D on a product, their request shows up here.</p></div>',"Requests")}function de(){let s=h.inquiries.filter(e=>e.type!=="pickup");n.innerHTML=H(s.length?`<div class="adm-msgs">${s.map(e=>`<article class="adm-card adm-msg ${e.status==="new"?"unread":""}">
      <div class="adm-card-head"><h2>${i(e.name)} <span class="status">${e.type==="wholesale"?"Wholesale":e.type==="pickup"?"Pickup request":"Contact"}</span></h2><span class="muted" style="font-size:13px">${R(e.createdAt,!0)}</span></div>
      <div class="adm-card-body"><p class="adm-msg-meta"><a href="${W(e.phone)}">${i(e.phone)}</a> \xB7 <a href="sms:${i(String(e.phone).replace(/[^\d+]/g,""))}">Text</a>${e.email?` \xB7 <a href="mailto:${i(e.email)}">${i(e.email)}</a>`:""}${e.company?" \xB7 "+i(e.company):""}</p><p class="adm-msg-text">${i(e.message)}</p>
      <div class="adm-msg-actions"><label class="sr-only" for="ms-${e.id}">Status</label><select id="ms-${e.id}" class="adm-status" data-msg-status="${e.id}">${Ue.map(([t,a])=>`<option value="${t}" ${e.status===t?"selected":""}>${a}</option>`).join("")}</select><button class="btn btn-sm" type="button" data-msg-del="${e.id}">${p("trash","icon-sm")} Delete</button></div></div>
    </article>`).join("")}</div>`:'<div class="empty"><h2>No messages</h2><p class="muted">Contact form and wholesale requests appear here.</p></div>',"Messages")}function J(){let s=m.categories(),e={};h.products.forEach(t=>{e[t.categoryId]=(e[t.categoryId]||0)+1}),n.innerHTML=H(`<div class="adm-card"><div class="adm-card-body">
      <ul class="adm-cats">${s.map((t,a)=>`<li data-cat="${t.id}">
        <label class="sr-only" for="cn-${t.id}">Category name</label><input id="cn-${t.id}" value="${i(t.name)}" data-cat-name>
        <span class="muted mono" style="font-size:12px">${e[t.id]||0} items</span>
        <button class="icon-btn" type="button" aria-label="Move up" data-cat-move="-1" ${a===0?"disabled":""}>${p("left","icon-sm")}</button>
        <button class="icon-btn" type="button" aria-label="Move down" data-cat-move="1" ${a===s.length-1?"disabled":""}>${p("right","icon-sm")}</button>
        <button class="btn btn-sm" type="button" data-cat-save>Save</button>
        <button class="btn btn-sm adm-danger" type="button" data-cat-del>${p("trash","icon-sm")}</button>
      </li>`).join("")}</ul>
      <form class="adm-cat-add" data-cat-add><label class="sr-only" for="cat-new">New category name</label><input id="cat-new" name="name" placeholder="New category name" required><button class="btn btn-primary" type="submit">${p("plus","icon-sm")} Add category</button></form>
      <p class="hint" style="margin-top:12px">Deleting a category keeps its products \u2014 they become \u201CUncategorized\u201D. Categories appear in the header dropdown in this order.</p>
    </div></div>`,"Categories")}function xe(){let s=m.settings(),e=(t,a,o="")=>`<div class="field"><label for="st-${t}">${a}</label><input id="st-${t}" name="${t}" value="${i(s[t]||"")}" ${o}></div>`;n.innerHTML=H(`<div class="adm-cols two">
      <form class="adm-card" data-settings><div class="adm-card-head"><h2>Store details</h2></div><div class="adm-card-body form">
        <div class="form-row two">${e("phone","Phone",'type="tel"')}${e("email","Email",'type="email"')}</div>
        ${e("address1","Pickup address")}
        <div class="form-row three">${e("city","City")}${e("state","State",'maxlength="2"')}${e("zip","ZIP")}</div>
        ${e("pickupHours","Pickup hours")}
        ${e("pickupNote","Pickup note")}
        ${e("announcement","Announcement bar",'maxlength="140"')}<p class="hint">Separate messages with \u201C\xB7\u201D.</p>
        <button class="btn btn-primary" type="submit">Save details</button>
      </div></form>
      <div style="display:grid;gap:16px;align-content:start">
        <form class="adm-card" data-password><div class="adm-card-head"><h2>Admin password</h2></div><div class="adm-card-body form">
          <div class="field"><label for="pw1">New password</label><input id="pw1" name="pw1" type="password" autocomplete="new-password" minlength="6" required></div>
          <div class="field"><label for="pw2">Confirm new password</label><input id="pw2" name="pw2" type="password" autocomplete="new-password" minlength="6" required></div>
          <p class="form-error" data-err hidden></p>
          <button class="btn" type="submit">Change password</button>
        </div></form>
        ${m.kind==="local"?`<div class="adm-card"><div class="adm-card-head"><h2>Data</h2></div><div class="adm-card-body form">
          <p class="hint">Preview data lives in this browser. Export a backup file to keep a copy.</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn btn-sm" type="button" data-export>${p("download","icon-sm")} Export backup</button><label class="btn btn-sm">${p("upload","icon-sm")} Import backup<input type="file" accept="application/json" class="sr-only" data-import></label><button class="btn btn-sm adm-danger" type="button" data-reset>Reset demo data</button></div>
          <div class="adm-confirm" data-reset-confirm hidden><p><b>Reset everything?</b> Products, orders and offers return to the demo catalog.</p><div><button class="btn btn-sm adm-danger" type="button" data-reset-yes>Reset</button><button class="btn btn-sm" type="button" data-reset-no>Cancel</button></div></div>
          <textarea class="sr-only" data-export-box aria-label="Backup data" readonly></textarea>
        </div></div>`:""}
      </div>
    </div>`,"Settings")}let ue=async s=>{let e=s.target,t=e.closest("[data-tab]");if(t){M=t.dataset.tab,y=null,c=null,N();return}if(e.closest("[data-logout]")){await u.logout(),V();return}if(e.closest("[data-new]")){M="products",y="new",c=null,N();return}let a=e.closest("[data-edit]");if(a){M="products",y=a.dataset.edit,c=null,N();return}if(e.closest("[data-cancel-edit]")){y=null,c=null,M="products",N();return}let o=e.closest("[data-inv]");if(o){let d=await u.adjustInventory(o.dataset.id,Number(o.dataset.inv));if(T(),d){let f=o.closest("tr");g("b",o.parentElement).textContent=d.inventory,f.classList.toggle("dim",d.inventory<=0||!d.published)}return}let w=e.closest("[data-open-order]");if(w){Se(w.dataset.openOrder);return}if(e.closest("[data-close-dlg]")||e.matches("dialog.modal")){let d=e.closest("dialog");d&&d.close();return}let O=e.closest("[data-cancel-order]");if(O){await u.updateOrder(O.dataset.cancelOrder,{status:"cancelled",restock:!0}),T(),k("Order cancelled and items restocked");let d=e.closest("dialog");d&&d.close(),await I(),X();return}let r=e.closest("[data-accept-price]");if(r){let d=h.offers.find($=>$.id===r.dataset.acceptPrice),f=h.products.find($=>$.id===d.productId);f&&(await u.saveProduct({...f,originalPrice:f.originalPrice||f.price,price:d.amount}),await u.updateOffer(d.id,{status:"accepted"}),T(),k(`Price set to ${P(d.amount)} and offer accepted`),await I(),ce());return}let C=e.closest("[data-bulk]");if(C){let d=[...L],f=C.dataset.bulk;if(f==="delete"&&!C.dataset.sure){C.dataset.sure="1",C.textContent=`Confirm delete ${d.length}`,C.classList.add("adm-danger");return}for(let $ of d){let E=h.products.find(z=>z.id===$);if(E){if(f==="discount"){let z=Math.min(95,Math.max(1,parseInt(g("[data-bulk-pct]").value,10)||0)),F=E.originalPrice||E.price;await u.saveProduct({...E,originalPrice:F,price:U(F*(1-z/100))})}f==="publish"&&await u.patchProduct($,{published:!0}),f==="unpublish"&&await u.patchProduct($,{published:!1}),f==="delete"&&await u.deleteProduct($)}}L.clear(),T(),k("Updated "+d.length+" product"+(d.length>1?"s":"")),await I(),K();return}let l=e.closest("[data-cat-move]");if(l){let d=l.closest("[data-cat]"),f=m.categories().map(z=>z.id),$=f.indexOf(d.dataset.cat),E=$+Number(l.dataset.catMove);[f[$],f[E]]=[f[E],f[$]],await u.reorderCategories(f),T(),J();return}let b=e.closest("[data-cat-save]");if(b){let d=b.closest("[data-cat]"),f=g("[data-cat-name]",d).value.trim();if(!f)return;await u.saveCategory({id:d.dataset.cat,name:f}),T(),k("Category saved"),J();return}let v=e.closest("[data-cat-del]");if(v){if(!v.dataset.sure){v.dataset.sure="1",v.textContent="Confirm";return}await u.deleteCategory(v.closest("[data-cat]").dataset.cat),T(),k("Category deleted"),await I(),J();return}let A=e.closest("[data-msg-del]");if(A){await u.deleteInquiry(A.dataset.msgDel),await I(),(A.dataset.back==="requests"?ne:de)(),k("Deleted");return}if(e.closest("[data-export]")){let d=await u.exportData(),f=new Blob([d],{type:"application/json"}),$=document.createElement("a");$.href=URL.createObjectURL(f),$.download=`mlgroup-backup-${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild($),$.click(),$.remove(),k("Backup downloaded");return}if(e.closest("[data-reset]")){g("[data-reset-confirm]").hidden=!1;return}if(e.closest("[data-reset-no]")){g("[data-reset-confirm]").hidden=!0;return}e.closest("[data-reset-yes]")&&(await u.reset(),T(),k("Demo data restored"),N())},pe=async s=>{let e=s.target;if(e.matches("[data-pf-f]")&&(q.f=e.value,K()),e.matches("[data-sel]")){e.checked?L.add(e.dataset.sel):L.delete(e.dataset.sel);let t=g("[data-bulk]");t.hidden=!L.size,g("[data-bulk-n]").textContent=`${L.size} selected`}if(e.matches("[data-sel-all]")){_("[data-sel]").forEach(a=>{a.checked=e.checked,e.checked?L.add(a.dataset.sel):L.delete(a.dataset.sel)});let t=g("[data-bulk]");t.hidden=!L.size,g("[data-bulk-n]").textContent=`${L.size} selected`}if(e.matches("[data-pub]")&&(await u.patchProduct(e.dataset.pub,{published:e.checked}),T(),e.nextElementSibling.textContent=e.checked?"Published":"Hidden",k(e.checked?"Published":"Hidden from store")),e.matches("[data-of]")&&(Q=e.value,X()),e.matches("[data-order-status]")&&(await u.updateOrder(e.dataset.orderStatus,{status:e.value}),k("Order status updated"),await I()),e.matches("[data-offer-status]")&&(await u.updateOffer(e.dataset.offerStatus,{status:e.value}),k("Offer updated"),await I()),e.matches("[data-msg-status]")&&(await u.updateInquiry(e.dataset.msgStatus,{status:e.value}),await I(),k("Updated"),M==="requests"&&ne()),e.matches("[data-import]")&&e.files[0])try{await u.importData(await e.files[0].text()),T(),k("Backup imported"),N()}catch(t){k(t.message,"err")}},me=s=>{if(s.target.matches("[data-pf-q]")){q.q=s.target.value;let e=s.target.selectionStart;K();let t=g("[data-pf-q]");t.focus(),t.setSelectionRange(e,e)}},he=async s=>{let e=s.target;if(e.matches("[data-login]")){s.preventDefault();let t=g('button[type="submit"]',e);t.disabled=!0;try{await u.login(e.elements.pw.value),N()}catch(a){V(a.message||"Sign in failed.")}}if(e.matches("[data-settings]")){s.preventDefault();let t=Object.fromEntries(new FormData(e));t.state=(t.state||"").toUpperCase(),await u.saveSettings(t),T(),k("Store details saved")}if(e.matches("[data-password]")){s.preventDefault();let t=Object.fromEntries(new FormData(e)),a=g("[data-err]",e);if(t.pw1.length<6){a.textContent="Use at least 6 characters.",a.hidden=!1;return}if(t.pw1!==t.pw2){a.textContent="The passwords don\u2019t match.",a.hidden=!1;return}try{await u.changePassword(t.pw1),e.reset(),a.hidden=!0,k("Password changed")}catch(o){a.textContent=o.message,a.hidden=!1}}if(e.matches("[data-cat-add]")){s.preventDefault();let t=e.elements.name.value.trim();if(!t)return;await u.saveCategory({name:t}),T(),k("Category added"),J()}},Me=()=>_("table.tbl",n).forEach(s=>{let e=_("thead th",s).map(t=>t.textContent.trim());_("tbody tr",s).forEach(t=>_("td",t).forEach((a,o)=>{a.hasAttribute("data-label")||a.setAttribute("data-label",e[o]||"")}))}),fe=new MutationObserver(Me);return fe.observe(n,{childList:!0,subtree:!0}),n.addEventListener("click",ue),n.addEventListener("change",pe),n.addEventListener("input",me),n.addEventListener("submit",he),N(),()=>{fe.disconnect(),n.removeEventListener("click",ue),n.removeEventListener("change",pe),n.removeEventListener("input",me),n.removeEventListener("submit",he)}}window.MLAdmin={mount:je};})();
