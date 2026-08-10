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

# Look for calls to sC or Ts
for m in re.finditer(r'(?:sC|Ts)\s*\(\s*["\'](\w+)["\']\s*,\s*["\'](\w+)["\']', content):
    print("Found API params:", m.groups())

# Also search for hero related strings or IDs in all js files
for m in re.finditer(r'\{[^{}]*(?:hero|herolist|hero_list|hero_id)[^{}]*\}', content, re.IGNORECASE):
    print("Found hero object:", m.group(0)[:150])
