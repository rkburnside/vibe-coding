import RPi.GPIO as GPIO
import socket
import time

# List of MAC addresses for the devices
MAC_ADDRESSES = [
    '241c0408b847',
    'dc4a3e7335c2',
    'a85e45d02ee3'
]

# GPIO pin for the button (BCM numbering)
BUTTON_PIN = 17

def send_magic_packet(mac_address):
    # Convert MAC address to bytes
    mac_bytes = bytes.fromhex(mac_address.replace(':', '').replace('-', ''))
    
    # Construct the magic packet
    magic_packet = b'\xff' * 6 + mac_bytes * 16
    
    # Create UDP socket with broadcast enabled
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    
    # Send to broadcast address on port 9
    sock.sendto(magic_packet, ('<broadcast>', 9))
    sock.close()

def button_callback(channel):
    print("Button pressed! Sending WOL packets to all devices.")
    for mac in MAC_ADDRESSES:
        send_magic_packet(mac)
        print(f"Magic packet sent to {mac}")

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Add event detection for falling edge (button press) with debounce
GPIO.add_event_detect(BUTTON_PIN, GPIO.FALLING, callback=button_callback, bouncetime=200)

print("WOL Button Service running. Press the button to wake devices.")

# Keep the script running indefinitely
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Service stopped.")
finally:
    GPIO.cleanup()