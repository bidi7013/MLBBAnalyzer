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
    heroes = [h for h in data['data'] if h.get('hero_name') and h.get('hero_name') != 'None']
    print(f"Valid heroes count: {len(heroes)}")
    for h in heroes[:5]:
        print(f"Name: {h.get('hero_name')}, Class: {h.get('class')}, Laning: {h.get('laning')}, Portrait: {h.get('portrait')}, Icon: {h.get('hero_icon')}")
