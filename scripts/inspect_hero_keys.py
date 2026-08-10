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
    print("Data keys:", list(data.keys()))
    if 'data' in data:
        print("Number of heroes in 'data':", len(data['data']))
        print("Sample hero:", json.dumps(data['data'][0], indent=2)[:600])
