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
    <body>
    <h2>Wake-on-LAN Server</h2>
    
    <!-- Buttons for predefined devices -->
    <form action="/wake" method="post">
        <input type="hidden" name="mac" value="241c0408b847">
        <button type="submit">OMV6 192.168.68.250</button>
    </form>
    <form action="/wake" method="post">
        <input type="hidden" name="mac" value="dc4a3e7335c2">
        <button type="submit">OMV7 192.168.68.251</button>
    </form>
    <form action="/wake" method="post">
        <input type="hidden" name="mac" value="a85e45d02ee3">
        <button type="submit">Rico's Desktop 192.168.68.252</button>
    </form>
    
    <!-- Manual input form -->
    <h3>Manual Wake</h3>
    <form action="/wake" method="post">
        MAC Address: <input type="text" name="mac" placeholder="e.g., AA:BB:CC:DD:EE:FF">
        <button type="submit">Wake Device</button>
    </form>
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