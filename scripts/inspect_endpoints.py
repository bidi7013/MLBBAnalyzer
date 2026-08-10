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
    
# Search for url paths and api endpoints
matches = re.findall(r'[\'"`](/api/[^\'"`]+|/web/[^\'"`]+|/v\d/[^\'"`]+)[\'"`]', content)
print("API Paths found:", set(matches))

hero_matches = re.findall(r'[\'"`]([^\'"`]*hero[^\'"`]*)[\'"`]', content, re.IGNORECASE)
print("Hero occurrences:", set([m for m in hero_matches if len(m) < 80 and '/' in m]))
