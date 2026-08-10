import urllib.request
import json
import ssl
import os
import re
import concurrent.futures

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

OUTPUT_IMG_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'heroes')
OUTPUT_JS_FILE = os.path.join(os.path.dirname(__file__), '..', 'js', 'data', 'allHeroes.js')
os.makedirs(OUTPUT_IMG_DIR, exist_ok=True)

url = 'https://raw.githubusercontent.com/p3hndrx/MLBB-API/main/v1/hero-meta-final.json'
print("Fetching hero metadata from official source...")
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx) as res:
    raw_data = json.loads(res.read().decode('utf-8'))

heroes_raw = [h for h in raw_data.get('data', []) if h.get('hero_name') and h.get('hero_name') != 'None']
print(f"Found {len(heroes_raw)} official heroes.")

def slugify(name):
    return re.sub(r'[^a-zA-Z0-9]+', '_', name.lower()).strip('_')

def download_image(hero):
    name = hero.get('hero_name', '')
    slug = slugify(name)
    portrait_url = hero.get('portrait', '')
    local_filename = f"{slug}.png"
    local_path = os.path.join(OUTPUT_IMG_DIR, local_filename)
    relative_img_path = f"assets/heroes/{local_filename}"

    if portrait_url:
        try:
            img_req = urllib.request.Request(portrait_url, headers=headers)
            with urllib.request.urlopen(img_req, context=ctx, timeout=8) as img_res:
                with open(local_path, 'wb') as f:
                    f.write(img_res.read())
            return hero, relative_img_path
        except Exception as e:
            # Fallback to CDN URL if download fails
            return hero, portrait_url
    return hero, portrait_url

print("Downloading hero portraits concurrently...")
processed_heroes = []

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(download_image, h) for h in heroes_raw]
    for future in concurrent.futures.as_completed(futures):
        hero, img_src = future.result()
        name = hero.get('hero_name', '')
        slug = slugify(name)
        roles = [r.strip() for r in hero.get('class', '').split(',') if r.strip()]
        primary_role = roles[0] if roles else 'Fighter'
        lanes = hero.get('laning', ['Mid / Exp Lane'])
        lane_str = lanes[0] if isinstance(lanes, list) and lanes else str(lanes)

        processed_heroes.append({
            'id': slug,
            'name': name,
            'role': primary_role,
            'roles': roles,
            'lane': lane_str.title() if lane_str else 'Roaming / Lane',
            'avatar': img_src,
            'cdnAvatar': hero.get('portrait', ''),
            'releaseYear': hero.get('release_year', '2016'),
            'skills': hero.get('skills', [])
        })

# Sort heroes alphabetically by name
processed_heroes.sort(key=lambda x: x['name'])

print(f"Successfully processed {len(processed_heroes)} heroes.")

# Write to js/data/allHeroes.js
js_content = f"""/**
 * Complete Official Mobile Legends: Bang Bang Hero Database
 * Total Heroes: {len(processed_heroes)}
 */

export const ALL_HEROES = {json.dumps(processed_heroes, indent=2)};
"""

with open(OUTPUT_JS_FILE, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Hero database written to {OUTPUT_JS_FILE}")
