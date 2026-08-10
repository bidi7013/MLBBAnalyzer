import urllib.request
import json
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

urls = [
    'https://raw.githubusercontent.com/p3hndrx/MLBB-API/main/data/heroes.json',
    'https://raw.githubusercontent.com/ridwaanhall/api-mobilelegends/master/src/data/hero.json',
    'https://raw.githubusercontent.com/ervin-sungkono/MLBB-API/master/data/hero.json'
]

for url in urls:
    print(f"Testing {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"Success! Found {len(data)} heroes.")
            if isinstance(data, list) and len(data) > 0:
                print("Sample hero:", data[0])
            elif isinstance(data, dict):
                print("Keys:", list(data.keys())[:5])
    except Exception as e:
        print(f"Failed {url}:", e)
