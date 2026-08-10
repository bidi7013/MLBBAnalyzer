import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

repos = ['p3hndrx/MLBB-API', 'ridwaanhall/api-mobilelegends', 'akashrchandran/mobile-legends-api', 'Arukenofu/mlbb-api-sdk']

for repo in repos:
    url = f"https://api.github.com/repos/{repo}/contents"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"Repo {repo}:", [item['path'] for item in data])
    except Exception as e:
        print(f"Error {repo}:", e)
