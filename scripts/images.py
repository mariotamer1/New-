"""Builds the optimized product/hero images used by the site.

Sources (all free to use; see CREDITS.md):
  * Unsplash photos bundled in the @vendure/create npm package (Unsplash License)
  * Magento 2 sample data product photos (AFL-3.0)
  * Studio renders of Khronos glTF sample models (CC0 / CC-BY 4.0) and of
    simple procedural models, made with Blender (scratch render step)

Output: src/img/p/<slug>-<n>-sm.webp (480px) and -lg.webp (960px) plus
src/img/manifest.json mapping product slug -> image list.

Usage: python3 scripts/images.py <vendure_dir> <magento_dir> <render_dir>
"""
import json, os, sys
from PIL import Image, ImageOps, ImageStat

VENDURE, MAGENTO, RENDERS = sys.argv[1:4]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'img', 'p')
os.makedirs(OUT, exist_ok=True)
SIZES = {'sm': 480, 'lg': 960}

# kind: v = vendure photo, m = magento photo, r = render
# crop spec for photos: (cx, cy, zoom) ; zoom 1 = largest centred square; 'pad' = letterbox
IMAGES = {
    # Electronics
    'ultrabook-laptop-16gb-512gb': [('v', 'derick-david-409858', (.5, .5, 1)), ('v', 'derick-david-409858', (.5, .56, 1.9))],
    'tablet-with-stylus-64gb': [('v', 'kelly-sikkema-685291', (.52, .5, 1)), ('v', 'kelly-sikkema-685291', (.56, .5, 1.7))],
    'curved-ultrawide-monitor-34-inch': [('v', 'alexandru-acea-686569', (.5, .34, 1)), ('v', 'alexandru-acea-686569', (.5, .3, 1.6))],
    '4k-ips-monitor-27-inch': [('v', 'daniel-korpai-1302051', (.5, .42, 1)), ('v', 'daniel-korpai-1302051', (.47, .36, 1.6))],
    'mechanical-keyboard-hot-swap': [('v', 'juan-gomez-674574', (.5, .5, 1)), ('v', 'juan-gomez-674574', (.58, .45, 1.9))],
    'wireless-optical-mouse': [('v', 'oscar-ivan-esquivel-arteaga-687447', (.5, .5, 1)), ('v', 'oscar-ivan-esquivel-arteaga-687447', (.52, .5, 1.6))],
    'gaming-desktop-pc-32gb': [('v', 'florian-olivo-1166419', (.5, .5, 1)), ('v', 'florian-olivo-1166419', (.5, .45, 1.6))],
    'portable-bluetooth-cd-boombox': [('r', 'boombox-1'), ('r', 'boombox-2'), ('r', 'boombox-3')],
    'ddr4-desktop-memory-32gb': [('v', 'liam-briese-1128307', (.5, .5, 1)), ('v', 'liam-briese-1128307', (.45, .5, 1.7))],
    'instant-film-camera-white': [('v', 'eniko-kis-663725', (.5, .55, 1)), ('v', 'eniko-kis-663725', (.5, .55, 1.6))],
    'aluminum-travel-tripod-60-inch': [('v', 'zoltan-tasi-423051', (.5, .5, 1)), ('v', 'zoltan-tasi-423051', (.5, .32, 1.8))],
    'usb-c-charging-cable-3-pack': [('v', 'adam-birkett-239153', (.5, .42, 1)), ('v', 'adam-birkett-239153', (.5, .33, 1.7))],
    '2tb-internal-hard-drive': [('v', 'vincent-botta-736919', (.5, .5, 1)), ('v', 'vincent-botta-736919', (.5, .45, 1.7))],
    # Home & Kitchen
    'mid-century-leather-sofa-cognac': [('v', 'paul-weaver-1120584', (.5, .6, 1)), ('v', 'paul-weaver-1120584', (.42, .62, 1.9))],
    'velvet-accent-chair-mango': [('r', 'velvet-chair-1'), ('r', 'velvet-chair-2'), ('r', 'velvet-chair-3')],
    'velvet-loveseat-navy': [('r', 'velvet-sofa-1'), ('r', 'velvet-sofa-2')],
    'upholstered-armchair-slate-blue': [('v', 'kari-shea-398668', (.5, .62, 1)), ('v', 'kari-shea-398668', (.5, .6, 1.5))],
    'porcelain-teacup-saucer-set': [('r', 'teacup-1'), ('r', 'teacup-2')],
    'glass-serving-dish-with-dome': [('r', 'serving-dish-1'), ('r', 'serving-dish-2')],
    'insulated-water-bottle-24-oz': [('r', 'water-bottle-1'), ('r', 'water-bottle-2')],
    'white-oak-side-table': [('v', 'benjamin-voros-310026', (.55, .62, 1)), ('v', 'benjamin-voros-310026', (.58, .58, 1.6))],
    'matte-white-pendant-light': [('v', 'pierre-chatel-innocenti-483198', (.5, .5, 1)), ('v', 'pierre-chatel-innocenti-483198', (.5, .55, 1.7))],
    'glass-bud-vase-faux-stems': [('r', 'glass-vase-1'), ('r', 'glass-vase-2')],
    # Tools
    'portable-steel-toolbox-20-inch': [('r', 'toolbox-1'), ('r', 'toolbox-2')],
    'screwdriver-set-6-piece': [('r', 'screwdriver-set-1'), ('r', 'screwdriver-set-2')],
    'tape-measure-25-ft': [('r', 'tape-measure-1'), ('r', 'tape-measure-2')],
    'garden-hand-trowel': [('v', 'neslihan-gunaydin-3493', (.45, .5, 1)), ('v', 'neslihan-gunaydin-3493', (.45, .45, 1.6))],
    # Appliances
    'robot-vacuum-cleaner': [('r', 'robot-vacuum-1'), ('r', 'robot-vacuum-2')],
    'countertop-microwave-1-1-cu-ft': [('r', 'microwave-1'), ('r', 'microwave-2')],
    'stainless-electric-kettle-1-7l': [('r', 'kettle-1'), ('r', 'kettle-2')],
    'stainless-2-slice-toaster': [('r', 'toaster-1'), ('r', 'toaster-2')],
    'glass-door-beverage-cooler': [('r', 'beverage-cooler-1'), ('r', 'beverage-cooler-2')],
    # Toys
    'vintage-tin-toy-car': [('r', 'toy-car-1'), ('r', 'toy-car-2'), ('r', 'toy-car-3')],
    'weighted-wooden-chess-set': [('r', 'chess-set-1'), ('r', 'chess-set-2'), ('r', 'chess-set-3')],
    'building-bricks-set-500-piece': [('r', 'building-bricks-1'), ('r', 'building-bricks-2')],
    'cruiser-skateboard-22-inch': [('v', 'max-tarkhov-737999', (.5, .5, 1)), ('v', 'max-tarkhov-737999', (.5, .5, 1.6))],
    # Other
    'aluminum-road-bike-54cm': [('v', 'mikkel-bech-748940', 'pad'), ('v', 'mikkel-bech-748940', (.3, .6, 1.8))],
    '4-person-dome-tent': [('v', 'michael-guite-571169', (.56, .6, 1)), ('v', 'michael-guite-571169', (.56, .62, 1.7))],
    'commuter-backpack-blue': [('m', 'm/b/mb02-blue-0.jpg'), ('m', 'm/b/mb02-gray-0.jpg')],
    'messenger-bag-black': [('m', 'm/b/mb05-black-0.jpg')],
    'rolling-duffle-bag': [('m', 'u/b/ub02-black-0.jpg')],
    'dual-time-analog-watch': [('m', 'm/g/mg05-br-0.jpg')],
    'resistance-band-kit': [('m', 'u/g/ug03-bk-0.jpg')],
    'indoor-outdoor-basketball': [('v', 'tommy-bebo-600358', (.5, .56, 1)), ('v', 'tommy-bebo-600358', (.52, .55, 1.8))],
    'live-bonsai-tree': [('v', 'mark-tegethoff-667351', (.5, .5, 1)), ('v', 'mark-tegethoff-667351', (.5, .45, 1.5))],
}


def square_crop(im, cx, cy, zoom):
    w, h = im.size
    side = min(w, h) / zoom
    x0 = min(max(cx * w - side / 2, 0), w - side)
    y0 = min(max(cy * h - side / 2, 0), h - side)
    return im.crop((round(x0), round(y0), round(x0 + side), round(y0 + side)))


def pad_square(im, margin=0.04, bg=None):
    w, h = im.size
    if bg is None:
        # average colour of the border pixels
        edge = Image.new('RGB', (w, 2))
        edge.paste(im.crop((0, 0, w, 1)), (0, 0))
        edge.paste(im.crop((0, h - 1, w, h)), (0, 1))
        bg = tuple(int(c) for c in ImageStat.Stat(edge).mean[:3])
    side = round(max(w, h) * (1 + margin * 2))
    canvas = Image.new('RGB', (side, side), bg)
    canvas.paste(im, ((side - w) // 2, (side - h) // 2))
    return canvas


def trim_render(path):
    im = Image.open(path).convert('RGBA')
    alpha = im.split()[-1]
    # bbox of anything visible (object + soft shadow above a small threshold)
    bbox = alpha.point(lambda a: 255 if a > 10 else 0).getbbox()
    white = Image.new('RGBA', im.size, (255, 255, 255, 255))
    white.alpha_composite(im)
    im = white.convert('RGB')
    if bbox:
        im = im.crop(bbox)
    return pad_square(im, margin=0.08, bg=(255, 255, 255))


def load(kind, ref, spec=None):
    if kind == 'v':
        im = Image.open(os.path.join(VENDURE, ref + '-unsplash.jpg')).convert('RGB')
        return pad_square(im, 0.02) if spec == 'pad' else square_crop(im, *spec)
    if kind == 'm':
        im = Image.open(os.path.join(MAGENTO, ref)).convert('RGB')
        return pad_square(im, 0.06, bg=(255, 255, 255))
    if kind == 'r':
        p = os.path.join(RENDERS, ref + '.png')
        return trim_render(p) if os.path.exists(p) else None
    raise ValueError(kind)


manifest = {}
for slug, specs in IMAGES.items():
    out = []
    for n, spec in enumerate(specs, 1):
        im = load(*spec)
        if im is None:
            continue
        for key, px in SIZES.items():
            dst = os.path.join(OUT, f'{slug}-{n}-{key}.webp')
            im.resize((px, px), Image.LANCZOS).save(dst, 'WEBP', quality=80 if key == 'lg' else 76, method=6)
        out.append(n)
    manifest[slug] = out
    print(slug, out)

with open(os.path.join(ROOT, 'src', 'img', 'manifest.json'), 'w') as f:
    json.dump(manifest, f, indent=1)
missing = [s for s, v in manifest.items() if not v]
print('missing:', missing)
