import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def test_live_lookup(user_id, zone_id):
    url = "https://order-sg.codashop.com/initPayment.action"
    
    payload = {
        "voucherPricePoint.id": "4150",
        "voucherPricePoint.price": "1000.0",
        "voucherPricePoint.variablePrice": "0",
        "email": "",
        "n": "8/10/2026-1116",
        "userVariablePrice": "0",
        "order.payMethod": "ONLINE",
        "userId": str(user_id),
        "zoneId": str(zone_id),
        "voucherTypeName": "MOBILE_LEGENDS"
    }
    
    data = urllib.parse.urlencode(payload).encode('utf-8')
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    
    try:
        req = urllib.request.Request(url, data=data, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=6) as response:
            res = json.loads(response.read().decode('utf-8'))
            print("Response:", res)
            if res.get("RESULT_CODE") == 0:
                username = res.get("confirmationFields", {}).get("username", "Unknown")
                print(f"SUCCESS! Real In-Game Name (IGN) found: {username}")
                return username
            else:
                print("Account lookup returned:", res.get("errorMsg", "Not found"))
    except Exception as e:
        print("Error during lookup:", e)
    return None

# Test with a sample ID
test_live_lookup("12345678", "2024")
