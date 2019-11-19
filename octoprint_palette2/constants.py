
# API HTTP STATUS CODES
HTTP = {
    "SUCCESS": 200,
    "FAILURE": 500,
}

# CONNECT OMEGA ERROR MESSAGES
P2_ALREADY_CONNECTED = "P2 Plugin already connected to P2"
NO_SERIAL_PORTS_FOUND = "P2 Plugin unable to find any available devices connected to serial ports"
PRINTER_ON_CURRENT_PORT = "Current port is the printer port: P2 Plugin cannot connect"
HEARTBEAT_CONNECT_FAILURE = "Palette 2 is not turned on OR this is not the serial port for Palette 2 OR this is the wrong baudrate."

# P2 CONNECTION STATUS
STATUS = {
    "INITIALIZING": "Initializing ...",
    "LOADING_DRIVES": "Loading ingoing drives",
    "LOADING_TUBE": "Loading filament through outgoing tube",
    "LOADING_EXTRUDER": "Loading filament into extruder",
    "PRINT_STARTED": "Print started: preparing splices",
    "SPLICES_DONE": "Palette work completed: all splices prepared",
    "CANCELLING": "Cancelling print",
    "CANCELLED": "Print cancelled"
}

# COMMANDS TO SEND TO P2
COMMANDS = {
    "CUT": "O10 D5",
    "CLEAR": [
        "O10 D5",
        "O10 D0 D0 D0 DFFE1",
        "O10 D1 D0 D0 DFFE1",
        "O10 D2 D0 D0 DFFE1",
        "O10 D3 D0 D0 DFFE1",
        "O10 D4 D0 D0 D0069"
    ],
    "CANCEL": "O0",
    "PING": "O31",
    "SMART_LOAD_START": "O102 D0",
    "SMART_LOAD_STOP": "O102 D1",
    "HEARTBEAT": "O99",
    "GET_FIRMWARE_VERSION": "O50",
    "FILENAME": "O51",
    "FILENAMES_DONE": "O52",
    "SPLICE": "O30",
    "START_PRINT_HUB": "O39 D1",
}
