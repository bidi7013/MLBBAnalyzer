import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

urls = [
    'https://api.github.com/repos/p3hndrx/MLBB-API/contents/v1',
    'https://api.github.com/repos/ridwaanhall/api-mobilelegends/contents/OpenMLBB'
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"Contents of {url}:", [item['path'] for item in data])
    except Exception as e:
        print(f"Error {url}:", e)
