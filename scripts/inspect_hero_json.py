import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

url = 'https://raw.githubusercontent.com/p3hndrx/MLBB-API/main/v1/hero-meta-final.json'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx) as res:
    data = json.loads(res.read().decode('utf-8'))
    print("Total heroes loaded:", len(data))
    first_hero = data[0] if isinstance(data, list) else list(data.values())[0]
    print("First hero keys:", list(first_hero.keys()) if isinstance(first_hero, dict) else first_hero)
    print("Sample:", json.dumps(first_hero, indent=2)[:500])
