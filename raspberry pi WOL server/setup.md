# Raspberry Pi WOL Server Setup

This folder contains two Raspberry Pi services for sending Wake-on-LAN packets:

- a physical button service
- a small Flask web server

## File Summary

`wol_button.py`

- Watches a physical button connected to Raspberry Pi GPIO pin `17` using BCM numbering.
- When the button is pressed, it sends Wake-on-LAN magic packets to the hardcoded MAC addresses in `MAC_ADDRESSES`.
- Runs continuously until stopped.

`wol_button.service`

- A `systemd` unit file for running `wol_button.py` automatically on boot.
- Runs the script as user `rich` from `/home/rich`.
- Restarts automatically if the process exits.
- Sends stdout and stderr to `journalctl`.

`wol_server.py`

- A Flask web app that serves a simple Wake-on-LAN page on port `5000`.
- Provides large mobile-friendly buttons for the predefined devices on the network.
- Also provides a manual MAC address form for waking other devices.

`wol_server.service`

- A `systemd` unit file for running `wol_server.py` automatically on boot.
- Runs the script as user `rich` from `/home/rich`.
- Restarts automatically if the process exits.

`setup.md`

- This document.

## What The Services Do

The Pi can wake devices in two different ways:

1. Press the physical button connected to GPIO pin `17`.
2. Open the Flask web page and press one of the wake buttons or submit a MAC address manually.

Both paths send a standard Wake-on-LAN magic packet by UDP broadcast to port `9`.

## Raspberry Pi Setup

These steps assume:

- Raspberry Pi OS is already installed
- the Pi is on the same local network as the machines you want to wake
- your Linux username is `rich`
- password is my last name

If your username or home directory is different, update the `.service` files accordingly.

## 1. Copy Files To The Pi

Place these files in `/home/rich/`:

- `/home/rich/wol_button.py`
- `/home/rich/wol_server.py`

Place these files in `/etc/systemd/system/`:

- `/etc/systemd/system/wol_button.service`
- `/etc/systemd/system/wol_server.service`

- i also placed these filed in my /home/rich directory (i'm not sure which is correct)

## 2. Install Python Dependencies

Install Flask and Raspberry Pi GPIO support:

```bash
sudo apt update
sudo apt install -y python3-flask python3-rpi.gpio
```

If needed, make sure Python 3 is installed:

```bash
sudo apt install -y python3
```

## 3. Wire The Physical Button

`wol_button.py` expects:

- one side of the push button connected to GPIO `17`
- the other side connected to `GND`

The script uses the Pi's internal pull-up resistor:

```python
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
```

That means the input is normally high and reads as pressed when the button pulls the pin low.

## 4. Review Device MAC Addresses

Update the hardcoded MAC addresses before enabling the services if needed.

In `wol_button.py`, edit:

```python
MAC_ADDRESSES = [
    '241c0408b847',
    'dc4a3e7335c2',
    'a85e45d02ee3'
]
```

In `wol_server.py`, update the hidden `mac` values and button labels in the HTML forms if your device list changes.

## 5. Enable And Start The Services

Reload `systemd`, then enable and start both services:

```bash
sudo systemctl daemon-reload
sudo systemctl enable wol_button.service
sudo systemctl enable wol_server.service
sudo systemctl start wol_button.service
sudo systemctl start wol_server.service
```

## 6. Check Service Status

Verify both services are running:

```bash
sudo systemctl status wol_button.service
sudo systemctl status wol_server.service
```

View logs with:

```bash
journalctl -u wol_button.service -f
journalctl -u wol_server.service -f
```

## 7. Access The Web Interface

From another device on the same network, open:

```text
http://<raspberry-pi-ip>:5000
```

Example:

```text
http://192.168.68.20:5000
```

## Notes

- The target machines must support Wake-on-LAN in BIOS/UEFI and in their operating system network settings.
- The target machines usually need to be connected by Ethernet for Wake-on-LAN to work reliably.
- If the broadcast packet does not wake a machine, verify the MAC address, subnet, switch behavior, and WOL settings on the target machine.
