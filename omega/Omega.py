import serial
import glob
from threading import Thread

class Omega():
    def __init__(self, plugin):
        self._plugin = plugin
        self._logger = plugin._logger
        self._logger.info("Hello from Omega") 

        self.activeDrive = "1"
        self.currentFilepath = "/home/s1/mcor.msf"

        #self.omegaSerial = serial.Serial("/dev/ttyACM1", 9600)
        self.sentCounter = 0

        self.msfCU = ""
        self.msfNS = "0"
        self.currentSplice = "0"
        self.inPong = False
        self.splices = []

        self.connected = False

        omegaPort = glob.glob('/dev/serial/by-id/*STMicro*')
        if len(omegaPort) > 0:
            self.connectOmega(omegaPort[0])
            self._logger.info("Connected to Omega")
        else:
            self._logger.info("Could not connect to Omega")

        self.stop = False

        #thread.start()

    def connectOmega(self, port):
        port = glob.glob('/dev/serial/by-id/*STMicro*')
        self.omegaSerial = serial.Serial(port[0], 9600)
        #self.connected = True
        self.omegaSerial.write("O99\n")
        thread = Thread(target=self.omegaReadThread, args=(self.omegaSerial,))
        thread.daemon = True
        thread.start()

    def setActiveDrive(self, drive):
        self.activeDrive = drive
        self._logger.info("Omega: active drive set to: %s" % self.activeDrive)

    def setFilepath(self, filepath):
        self.currentFilepath = filepath
        self._logger.info("Omega: current file set to: %s" % self.currentFilepath)

    def sendUIUpdate(self):
        self._plugin._plugin_manager.send_plugin_message(self._plugin._identifier, "UI:nSplices=%s" % int(self.msfNS, 16))
        self._plugin._plugin_manager.send_plugin_message(self._plugin._identifier, "UI:S=%s" % self.currentSplice)
        self._plugin._plugin_manager.send_plugin_message(self._plugin._identifier, "UI:Con=%s" % self.connected)
        if self.inPong:
            self._plugin._plugin_manager.send_plugin_message(self._plugin._identifier, "UI:Ponging")
        else:
            self._plugin._plugin_manager.send_plugin_message(self._plugin._identifier, "UI:Finished Pong")       
        
    def startSingleColor(self):
        self._logger.info("Omega: start Single Color Mode with drive %s" % self.activeDrive)
        cmdStr = "O4 D%s\n" % self.activeDrive
        self._logger.info("Omega: Sending %s" % cmdStr)
        self.omegaSerial.write(cmdStr)

    def startSpliceDemo(self, withPrinter):
        f = open(self.currentFilepath)
        for line in f:
            if "cu" in line:
                self.msfCU = line[3:7]
                self._logger.info("Omega: setting CU to %s" % self.msfCU)
            elif "ns" in line:
                self.msfNS = line[3:7]
                self._logger.info("Omega: setting NS to %s" % self.msfNS)
            elif "(" in line:
                splice = (line[2:3], line[4:12])
                self._logger.info("Omega: Adding Splice D: %s, Dist: %s" % (splice[0], splice[1]))
                self.splices.append(splice)
        f.close()

        if withPrinter is True:
            self._logger.info("Omega: start Splice Demo w/ Printer")
            if self.connected:
                self.omegaSerial.write("O2\n")
        else:
            self._logger.info("Omega: start Splice Demo w/o printer")
            if self.connected:
                self.omegaSerial.write("O3\n")

    def sendPrintStart(self):
        #self._logger.info("Omega: Sending 'O31'")
        #self.omegaSerial.write("O31\n")
        self._logger.info("Omega toggle pause")
        self._plugin._printer.toggle_pause_print()

    def gotOmegaCmd(self, cmd):
        if "O25" in cmd:
            self.msfCU = cmd[5:]
            self._logger.info("Omega: Got CU: %s" % self.msfCU) 
        elif "O26" in cmd:
            self.msfNS = cmd[5:]
            self._logger.info("Omega: Got NS: %s" % self.msfNS)
        elif "O21" in cmd or "O22" in cmd or "O23" in cmd or "O24" in cmd:
            splice = (int(cmd[2:3]) - 1, cmd[5:13])
            self.splices.append(splice)
            self._logger.info("Omega: Got splice D: %s, dist: %s" % (splice[0], splice[1]))
        else:
            if self.connected:
                self.sendCmd(cmd)

    def sendCmd(self, cmd):
        self._logger.info("Omega: Sending '%s'" % cmd)
        self.omegaSerial.write(cmd.strip() + "\n")

    def printerTest(self):
        self._plugin._logger.info("Sending commands from Omega")
        #self._plugin._printer.commands(["G28", "G1 X150 Y150 Z10 F6000"])
        #self._plugin._printer.commands(["M109 S220", "M83", "G1 E50.00"])
        self._plugin._printer.commands(["M83", "G1 E50.00 F200"])

    def sendNextData(self):
        if self.sentCounter == 0:
            cmdStr = "O25 D%s\n" % self.msfCU
            self.omegaSerial.write(cmdStr)
            self.sentCounter = self.sentCounter + 1
        elif self.sentCounter == 1:
            cmdStr = "O26 D%s\n" % self.msfNS
            self.omegaSerial.write(cmdStr)
            self.sentCounter = self.sentCounter + 1
        elif self.sentCounter > 1:
            splice = self.splices[self.sentCounter - 2]
            cmdStr = "O2%d D%s\n" % ((int(splice[0]) + 1), splice[1])
            self.omegaSerial.write(cmdStr)
            self.sentCounter = self.sentCounter + 1

    def omegaReadThread(self, ser):
        self._logger.info("Omega Read Thread: Starting thread")
        while self.stop is not True:
            line = ser.readline()
            self._logger.info("Omega: %s" % line.strip())
            if "O20" in line:
                self.sendNextData()
            elif "O30" in line:
                #send gcode command
                dist = line.strip()[5:]
                extrudeCmd = "G1 E%s F200" % dist
                self._plugin._printer.commands(["G91", extrudeCmd, "G90", "G92 E0"])
                #self._plugin._printer.commands(["M109 S220", "M83", "G1 E50.00 F2000"])
            elif "O32" in line:
                #resume print
                self._logger.info("Omega: resuming print")
                self._plugin._printer.toggle_pause_print()
            elif "UI:" in line:
                #send a message to the front end
                self._logger.info(line)
                if "Ponging" in line:
                    self.inPong = True
                elif "Finished Pong" in line:
                    self.inPong = False
                elif "S=" in line:
                    self.currentSplice = line[5:]
                self._plugin._plugin_manager.send_plugin_message(self._plugin._identifier, line)
            elif "Connection Okay" in line:
                self.connected = True
		self._plugin._plugin_manager.send_plugin_message(self._plugin._identifier, "UI:Con=%s" % self.connected)

        ser.close()

    def shutdown(self):
        self.stop = True
        self.omegaSerial.close()
