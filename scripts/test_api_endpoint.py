import urllib.request
import json

url = 'http://localhost:8080/api/player?userId=98765432&zoneId=2105'
try:
    with urllib.request.urlopen(url, timeout=5) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("API Response success:", data['ign'], data['currentRank'], f"{data['overallWinRate']}% WR", f"Top hero: {data['topHeroes'][0]['name']}")
except Exception as e:
    print("Error:", e)
