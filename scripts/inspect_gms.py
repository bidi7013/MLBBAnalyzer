import urllib.request
import json
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request('https://www.mobilelegends.com/assets/index-06f6d0af.js', headers=headers)
with urllib.request.urlopen(req, context=ctx) as res:
    content = res.read().decode('utf-8')

# Search for /api/gms/source or /api/gms/data
source_calls = re.findall(r'(\w+)\s*=\s*[\'"`]/api/gms/[^\'"`]+[\'"`]', content)
print("GMS calls:", source_calls)

# Look for snippets around /api/gms/
for m in re.finditer(r'/api/gms/[^\'"`]+', content):
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 150)
    print("Context around API:", content[start:end])
    print("-" * 50)
