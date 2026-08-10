import urllib.request
import json
import ssl
import re
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request('https://www.mobilelegends.com/hero', headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx) as res:
        html = res.read().decode('utf-8')
        js_files = re.findall(r'/assets/[a-zA-Z0-9_\-\.]+\.js', html)
        print("Found JS files:", set(js_files))
        
        # Check potential API endpoints mentioned in html/js
        for js in set(js_files):
            js_url = f"https://www.mobilelegends.com{js}"
            try:
                with urllib.request.urlopen(urllib.request.Request(js_url, headers=headers), context=ctx) as js_res:
                    js_content = js_res.read().decode('utf-8')
                    api_endpoints = re.findall(r'https?://[^\s"\'\`]+', js_content)
                    print(f"Endpoints in {js}:", [ep for ep in set(api_endpoints) if 'api' in ep or 'hero' in ep or 'gms' in ep][:10])
            except Exception as ex:
                print(f"Error fetching {js_url}:", ex)
except Exception as e:
    print("Error:", e)
