from flask import Flask, request
import socket

app = Flask(__name__)

def send_magic_packet(mac_address):
    # Convert MAC address to bytes (e.g., '241c0408b847' -> b'\x24\x1c\x04\x08\xb8\x47')
    mac_bytes = bytes.fromhex(mac_address.replace(':', '').replace('-', ''))
    
    # Construct the magic packet: 6 bytes of 0xFF + MAC repeated 16 times
    magic_packet = b'\xff' * 6 + mac_bytes * 16
    
    # Create a UDP socket and enable broadcasting
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    
    # Send the packet to the broadcast address on port 9
    sock.sendto(magic_packet, ('<broadcast>', 9))
    sock.close()

@app.route('/')
def home():
    return '''
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 720px;
            margin: 0 auto;
            padding: 20px 16px 32px;
            background: #f6f7fb;
            color: #172033;
        }

        h2, h3 {
            margin-bottom: 12px;
        }

        form {
            margin-bottom: 14px;
        }

        button {
            width: 100%;
            min-height: 64px;
            padding: 16px 18px;
            border: 0;
            border-radius: 16px;
            background: #1f6feb;
            color: white;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
        }

        input[type="text"] {
            width: 100%;
            min-height: 56px;
            padding: 14px 16px;
            margin-bottom: 12px;
            border: 1px solid #c7d2e3;
            border-radius: 14px;
            font-size: 1rem;
            box-sizing: border-box;
        }

        .card {
            background: white;
            border-radius: 20px;
            padding: 18px;
            box-shadow: 0 10px 30px rgba(23, 32, 51, 0.08);
            margin-bottom: 18px;
        }
    </style>
    </head>
    <body>
    <h2>Wake-on-LAN Server</h2>

    <div class="card">
        <form action="/wake" method="post">
            <input type="hidden" name="mac" value="dc4a3e7335c2">
            <button type="submit">Wake OMV7 192.168.68.251</button>
        </form>
        <form action="/wake" method="post">
            <input type="hidden" name="mac" value="a85e45d02ee3">
            <button type="submit">Wake Rico's Desktop 192.168.68.252</button>
        </form>
    </div>

    <div class="card">
        <h3>Manual Wake</h3>
        <form action="/wake" method="post">
            <input type="text" name="mac" placeholder="e.g., AA:BB:CC:DD:EE:FF">
            <button type="submit">Wake Device</button>
        </form>
    </div>
    </body>
    </html>
    '''

@app.route('/wake', methods=['POST'])
def wake():
    mac = request.form['mac']
    send_magic_packet(mac)
    return f'Magic packet sent to wake the device with MAC {mac}. <a href="/">Back</a>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
