if (!document.getElementById("sweetalert2-styling")) {
  let link = document.createElement("link");
  link.id = "sweetalert2-styling";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.29.0/sweetalert2.min.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}
if (!document.getElementById("sweetalert2-script")) {
  let script = document.createElement("script");
  script.id = "sweetalert2-script";
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.29.0/sweetalert2.min.js";
  document.head.appendChild(script);
}

/* ======================
HELPER FUNCTIONS
======================= */
const omegaApp = {};

/* 1. LOADER */
omegaApp.loadingOverlay = (condition, status) => {
  if (condition) {
    if (status === "connect") {
      message = `<h1 class="loading-overlay-message">Trying to connect to Palette 2...</h1>`;
    } else if (status === "disconnect") {
      message = `<h1 class="loading-overlay-message">Disconnecting Palette 2...</h1>`;
    } else if (status === "heartbeat") {
      message = `<h1 class="loading-overlay-message">Verifying Palette 2 connection before starting print...</h1>`;
    }
    $("body").append(`<div class="loading-overlay-container">
    <div class="loader"></div>
    ${message}
    </div>`);
  } else {
    $("body")
      .find(".loading-overlay-container")
      .remove();
  }
};

/* 2. DISABLE PRINT ICON SMALL */
omegaApp.disableSmallPrintIcon = condition => {
  if (condition) {
    $(".palette-tag")
      .siblings(".action-buttons")
      .find(".btn:last-child")
      .css("pointer-events", "none")
      .attr("disabled", true);
  } else {
    $(".palette-tag")
      .siblings(".action-buttons")
      .find(".btn:last-child")
      .css("pointer-events", "auto")
      .attr("disabled", false);
  }
};

/* 2.1 DISABLE PRINT ICON LARGE */
omegaApp.disableLargePrintIcon = condition => {
  $("#job_print").attr("disabled", condition);
};

/* 2.2 DISABLE PAUSE ICON LARGE */
omegaApp.disablePause = condition => {
  $("body")
    .find("#job_pause")
    .attr("disabled", condition);
};

/* 3. HIGHLIGHT TO HELP USER USE TEMP CONTROLS */
omegaApp.temperatureHighlight = () => {
  $("body")
    .find(`#temperature-table .input-mini.input-nospin:first`)
    .addClass("highlight-glow")
    .on("focus", event => {
      $(event.target).removeClass("highlight-glow");
    });
};

/* 3.1 HIGHLIGHT TO HELP USER USE EXTRUSION CONTROLS */
omegaApp.extrusionHighlight = () => {
  $("body")
    .find("#control-jog-extrusion .input-mini.text-right")
    .addClass("highlight-glow")
    .on("focus", event => {
      $(event.target).removeClass("highlight-glow");
    });
  $("body")
    .find("#control-jog-extrusion > div :nth-child(3)")
    .addClass("highlight-glow-border")
    .on("focus", event => {
      $(event.target).removeClass("highlight-glow-border");
    });
};

/* 4. ALERT TEXTS */
omegaApp.cannotConnectAlert = () => {
  return swal({
    title: "Could not connect to Palette 2",
    text: `Please make sure Palette 2 is turned on and that the selected port corresponds to it. Please wait 5 seconds before trying again.`,
    type: "error"
  });
};

omegaApp.palette2PrintStartAlert = () => {
  return swal({
    title: "You are about to print with Palette 2",
    text:
      "Your print will temporarily be paused. This is normal - please follow the instructions on Palette 2's screen. The print will resume automatically once everything is ready.",
    type: "info"
  });
};

omegaApp.preheatAlert = () => {
  return swal({
    title: "Pre-heat your printer",
    text:
      "Palette 2 is now making filament. In the meantime, please pre-heat your printer using the controls in the Temperature Tab.",
    type: "info"
  });
};

omegaApp.extrusionAlert = firstTime => {
  if (firstTime) {
    return swal({
      title: "Follow instructions on Palette 2 ",
      text: `Use the "Extrude" button in the Controls tab to drive filament into the extruder until you see the desired color. To accurately load, we recommend setting the extrusion amount to a low number.`,
      type: "info"
    });
  } else {
    return swal({
      title: "Follow instructions on Palette 2 ",
      text: `Use the "Extrude" button in the Controls tab to drive filament into the extruder. To accurately load, we recommend setting the extrusion amount to a low number.`,
      type: "info"
    });
  }
};

omegaApp.printCancelAlert = () => {
  return swal({
    title: "Print cancelling ",
    text: `Please remove filament from the extruder and from Palette 2.`,
    type: "info"
  });
};

omegaApp.palette2NotConnectedAlert = () => {
  return swal({
    title: "Palette 2 not connected",
    text: "You have selected an .mcf file. Please enable the connection to Palette 2 before printing.",
    type: "info"
  });
};

omegaApp.noSerialPortsAlert = () => {
  return swal({
    title: "No serial ports detected",
    text: `Please make sure all cables are inserted properly into your Hub.`,
    type: "error"
  });
};

omegaApp.errorAlert = errorNumber => {
  return swal({
    title: `Error ${errorNumber} detected`,
    text: `An error occured on Palette 2. Your print has been paused. Would you like to send a crash report to Mosaic for investigation?`,
    confirmButtonText: "Yes",
    showCancelButton: true,
    cancelButtonText: "No",
    reverseButtons: true,
    type: "error"
  });
};

omegaApp.errorTextAlert = () => {
  return swal({
    title: "Please provide additional details (OPTIONAL)",
    text:
      "(E.g: what part of the print you were at, what is displayed on your Palette 2 screen, is this the first time this has occured, etc)",
    customClass: "error-container",
    input: "textarea",
    inputClass: "error-textarea",
    width: "40rem",
    confirmButtonText: "Send"
  });
};

omegaApp.displayHeartbeatAlert = status => {
  if (status === "P2NotConnected") {
    omegaApp.loadingOverlay(false);
    return swal({
      title: "No response from Palette 2",
      text: `Please make sure Palette 2 is turned on and try reconnecting to it in the Palette 2 tab before starting another print.`,
      type: "error"
    });
  } else if (status === "P2Responded") {
    omegaApp.loadingOverlay(false);
    omegaApp.palette2PrintStartAlert();
  }
};

/* 4.1 CLOSE ALERT */
omegaApp.closeAlert = () => {
  if (Swal.isVisible()) {
    Swal.close();
  }
};

/* ======================
OMEGA VIEWMODEL FOR OCTOPRINT
======================= */

function OmegaViewModel(parameters) {
  var self = this;

  /* GLOBAL VARIABLES */
  self.omegaCommand = ko.observable();
  self.wifiSSID = ko.observable();
  self.wifiPASS = ko.observable();
  self.omegaPort = ko.observable();
  self.currentSplice = ko.observable();
  self.nSplices = ko.observable();
  self.totalSplicesDisplay = ko.computed(function() {
    return " / " + self.nSplices() + " Splices";
  });
  self.connected = ko.observable(false);
  self.connectPaletteText = ko.computed(function() {
    return self.connected() ? "Connected" : "Connect to Palette 2";
  });
  self.disconnectPaletteText = ko.computed(function() {
    return self.connected() ? "Disconnect" : "Disconnected";
  });
  self.demoWithPrinter = ko.observable(false);

  self.currentStatus = ko.observable();
  self.amountLeftToExtrude = "";
  self.jogId = "";
  self.displayAlerts = true;
  self.tryingToConnect = false;
  self.currentFile = "";
  self.printerConnected = false;
  self.firstTime = false;
  self.actualPrintStarted = false;
  self.autoconnect = false;
  self.connectionStateMsg = ko.computed(function() {
    if (self.connected()) {
      return "Connected";
    } else {
      return self.autoconnect ? "Not Connected - Trying To Connect..." : "Not Connected";
    }
  });
  self.filaLength = ko.observable();
  self.filaLengthDisplay = ko.computed(function() {
    return (Number(self.filaLength()) / 1000.0).toFixed(2) + "m";
  });

  // self.files = ko.observableArray([]);

  self.selectedDemoFile = ko.observable();

  self.ports = ko.observableArray([]);
  self.selectedPort = ko.observable();

  self.latestPing = ko.observable(0);
  self.latestPingPercent = ko.observable();
  self.latestPong = ko.observable(0);
  self.latestPongPercent = ko.observable();
  self.pings = ko.observableArray([]);
  self.pongs = ko.observableArray([]);

  /* COMMUNICATION TO BACK-END FUNCTIONS */

  self.togglePingHistory = () => {
    if (self.pings().length) {
      $(".ping-history").slideToggle();
    }
  };

  self.togglePongHistory = () => {
    if (self.pongs().length) {
      $(".pong-history").slideToggle();
    }
  };

  // window.onload = () => {
  //   self.refreshDemoList();
  // };

  // self.filterDemoFiles = ko.computed(function() {
  //   var filteredFiles = self.files().filter(f => {
  //     return f.match(/.msf$/i);
  //   });
  //   return filteredFiles;
  // });

  self.displayPorts = () => {
    let condition = "";
    // determine if user is opening or closing list of ports
    if ($(".serial-ports-list").is(":visible")) {
      condition = "closing";
    } else {
      condition = "opening";
    }

    var payload = {
      command: "displayPorts",
      condition: condition
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8"
    }).then(() => {
      self.settings.saveData();
    });
  };

  // self.refreshDemoList = () => {
  //   var payload = {};
  //   $.ajax({
  //     headers: {
  //       "X-Api-Key": UI_API_KEY
  //     },
  //     url: API_BASEURL + "files?recursive=true",
  //     type: "GET",
  //     dataType: "json",
  //     data: JSON.stringify(payload),
  //     contentType: "application/json; charset=UTF-8",
  //     success: function(d) {
  //       self.files(
  //         d.files.map(function(file, index) {
  //           return file.name;
  //         })
  //       );
  //     }
  //   });
  // };

  self.startSpliceDemo = () => {
    if (self.selectedDemoFile()) {
      var payload = {
        command: "startSpliceDemo",
        file: self.selectedDemoFile(),
        withPrinter: self.demoWithPrinter()
      };

      $.ajax({
        url: API_BASEURL + "plugin/palette2",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(payload),
        contentType: "application/json; charset=UTF-8"
      });
    }
  };

  self.connectOmega = () => {
    self.tryingToConnect = true;
    omegaApp.loadingOverlay(true, "connect");

    if (self.selectedPort()) {
      var payload = {
        command: "connectOmega",
        port: self.selectedPort()
      };
    } else {
      var payload = { command: "connectOmega", port: "" };
    }

    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8"
    }).then(res => {
      self.applyPaletteDisabling();
    });
  };

  self.disconnectPalette2 = () => {
    omegaApp.loadingOverlay(true, "disconnect");
    self.connected(false);
    self.removeNotification();
    var payload = {
      command: "disconnectPalette2"
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8"
    }).then(res => {
      self.applyPaletteDisabling();
    });
  };

  self.changeAlertSettings = condition => {
    self.displayAlerts = !condition;
    var payload = { command: "changeAlertSettings", condition: self.displayAlerts };

    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8"
    }).then(() => {
      self.settings.saveData();
    });
  };

  self.sendOmegaCmd = (command, payload) => {
    var payload = {
      command: "sendOmegaCmd",
      cmd: self.omegaCommand()
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8",
      success: self.fromResponse
    });
  };

  self.connectWifi = () => {
    var payload = {
      command: "connectWifi",
      wifiSSID: self.wifiSSID(),
      wifiPASS: self.wifiPASS()
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8",
      success: self.fromResponse
    });
  };

  self.sendCutCmd = () => {
    var payload = {
      command: "sendCutCmd"
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8",
      success: self.fromResponse
    });
  };

  self.sendClearOutCmd = () => {
    var payload = {
      command: "clearPalette2"
    };

    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8",
      success: self.fromResponse
    });
  };

  self.sendCancelCmd = () => {
    var payload = {
      command: "cancelPalette2"
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8"
    });
  };

  self.sendPrintStart = () => {
    var payload = {
      command: "printStart"
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8",
      success: self.fromResponse
    });
  };

  self.fromResponse = () => {};

  /* UI FUNCTIONS */

  self.findCurrentFilename = () => {
    self.currentFile = $("#state_wrapper")
      .find(`strong[title]`)
      .text();
  };

  self.applyPaletteDisabling = () => {
    if (self.printerConnected) {
      if (!self.connected()) {
        let count = 0;
        let applyDisabling = setInterval(function() {
          if (count > 30) {
            clearInterval(applyDisabling);
          }
          count++;
          if (self.currentFile.includes(".mcf.gcode")) {
            omegaApp.disableLargePrintIcon(true);
            omegaApp.disableSmallPrintIcon(true);
          } else if (self.currentFile && !self.currentFile.includes(".mcf.gcode")) {
            omegaApp.disableLargePrintIcon(false);
          }
        }, 100);
      } else {
        let count = 0;
        let applyDisabling2 = setInterval(function() {
          if (count > 30) {
            clearInterval(applyDisabling2);
          }
          count++;
          if (!self.currentFile || self.actualPrintStarted) {
            if (self.printPaused) {
              omegaApp.disableLargePrintIcon(false);
            } else {
              omegaApp.disableLargePrintIcon(true);
            }
          } else {
            omegaApp.disableSmallPrintIcon(false);
            omegaApp.disableLargePrintIcon(false);
            if (self.printPaused && !self.actualPrintStarted) {
              omegaApp.disablePause(true);
            }
          }
        }, 100);
      }
    } else {
      let count = 0;
      let applyDisabling3 = setInterval(function() {
        if (count > 20) {
          clearInterval(applyDisabling3);
        }
        omegaApp.disableLargePrintIcon(true);
        count++;
      }, 100);
    }
  };

  self.handleGCODEFolders = payload => {
    self.removeFolderBinding();
    $("#files .gcode_files .entry.back.clickable").on("click", () => {
      self.applyPaletteDisabling();
    });
  };

  self.removeFolderBinding = payload => {
    $("#files .gcode_files")
      .find(".folder .title")
      .removeAttr("data-bind")
      .on("click", event => {
        self.applyPaletteDisabling();
      });
  };

  self.showAlert = command => {
    if (command === "temperature") {
      if (self.displayAlerts) {
        let base_url = window.location.origin;
        window.location.href = `${base_url}/#temp`;
        omegaApp.temperatureHighlight();
        omegaApp.preheatAlert();
      }
    } else if (command === "extruder") {
      self.displayFilamentCountdown();
      if (self.displayAlerts) {
        let base_url = window.location.origin;
        window.location.href = `${base_url}/#control`;
        omegaApp.extrusionHighlight();
        if (self.firstTime) {
          omegaApp.extrusionAlert(true);
        } else {
          omegaApp.extrusionAlert(false);
        }
      }
    } else if (command === "cancelling") {
      omegaApp.printCancelAlert();
      self.removeNotification();
    } else if (command === "printStarted") {
      // if user presses start from P2
      omegaApp.closeAlert();
    } else if (command === "cancelled") {
      self.findCurrentFilename();
      self.removeNotification();
      omegaApp.closeAlert();
    } else if (command === "startPrint") {
      self.removeNotification();
      if (self.displayAlerts) {
        $("body").on("click", ".setup-checkbox input", event => {
          self.changeAlertSettings(event.target.checked);
        });
      }
      self.readyToStartAlert(self.displayAlerts).then(result => {
        if (result.hasOwnProperty("value")) {
          var payload = {
            command: "startPrint"
          };
          $.ajax({
            url: API_BASEURL + "plugin/palette2",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(payload),
            contentType: "application/json; charset=UTF-8"
          });
        }
      });
    }
  };

  self.displayFilamentCountdown = () => {
    let notification = $(`<li id="jog-filament-notification" class="popup-notification">
              <i class="material-icons remove-popup">clear</i>
              <h6>Remaining Length To Extrude:</h6>
              <p class="jog-filament-value">${self.amountLeftToExtrude}mm</p>
              </li>`).hide();
    self.jogId = "#jog-filament-notification";
    $(".side-notifications-list").append(notification);
  };

  self.updateFilamentCountdown = firstValue => {
    if (firstValue) {
      $(self.jogId)
        .fadeIn(200)
        .find(".jog-filament-value")
        .text(`${self.amountLeftToExtrude}mm`);
    } else {
      $(self.jogId)
        .find(".jog-filament-value")
        .text(`${self.amountLeftToExtrude}mm`);
    }
  };

  self.removeNotification = () => {
    $(self.jogId).fadeOut(500, function() {
      this.remove();
    });
  };

  /* OCTOPRINT-SPECIFIC EVENT HANDLERS */

  self.onBeforeBinding = () => {
    self.settings = parameters[0];
    self.control = parameters[1];
    self.currentSplice(0);
    self.nSplices(0);
    self.filaLength(0);
    self.connected(false);
    self.uiUpdate();
  };

  self.onAfterBinding = () => {
    // self.refreshDemoList();
    if (self.palette2SetupStarted) {
      let count = 0;
      let applyDisablingResume = setInterval(function() {
        if (count > 50) {
          clearInterval(applyDisablingResume);
        }
        omegaApp.disablePause(true);
        count++;
      }, 100);
    }
    // self.settings = parameters[0];
    self.uiUpdate();
  };

  self.uiUpdate = () => {
    console.log("Requesting BE to update UI");
    var payload = { command: "uiUpdate" };

    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8"
    });
  };

  self.onStartupComplete = () => {
    self.findCurrentFilename();
    self.removeFolderBinding();
    self.handleGCODEFolders();
    self.applyPaletteDisabling();
  };

  self.onEventConnected = payload => {
    self.printerConnected = true;
    self.findCurrentFilename();
    self.applyPaletteDisabling();
  };

  self.onEventDisconnected = payload => {
    self.printerConnected = false;
    self.applyPaletteDisabling();
  };

  self.onEventFileRemoved = payload => {
    self.applyPaletteDisabling();
  };

  self.onEventUpdatedFiles = payload => {
    self.applyPaletteDisabling();
  };

  self.onEventFileSelected = payload => {
    self.currentFile = payload.name;

    if (self.currentFile.includes(".mcf.gcode")) {
      self.applyPaletteDisabling();
      if (!self.connected()) {
        omegaApp.palette2NotConnectedAlert();
      }
    }
  };

  self.onEventFileDeselected = payload => {
    self.applyPaletteDisabling();
  };

  self.onEventPrintStarted = payload => {
    if (payload.name.includes(".mcf.gcode")) {
      if (self.connected()) {
        omegaApp.loadingOverlay(true, "heartbeat");
      }
    }
  };

  self.onEventPrintPaused = payload => {
    if (self.connected() && payload.name.includes(".mcf.gcode")) {
      if (!self.actualPrintStarted) {
        let count = 0;
        let applyDisablingResume = setInterval(function() {
          if (count > 50) {
            clearInterval(applyDisablingResume);
          }
          omegaApp.disablePause(true);
          count++;
        }, 100);
      } else {
        let count = 0;
        let applyDisablingResume = setInterval(function() {
          if (count > 50) {
            clearInterval(applyDisablingResume);
          }
          omegaApp.disableLargePrintIcon(false);
          count++;
        }, 100);
      }
    }
  };

  self.onEventPrintResumed = payload => {
    if (self.connected() && payload.name.includes(".mcf.gcode") && self.actualPrintStarted) {
      let count = 0;
      let applyDisablingResume2 = setInterval(function() {
        if (count > 50) {
          clearInterval(applyDisablingResume2);
        }
        omegaApp.disablePause(false);
        omegaApp.disableLargePrintIcon(true);
        count++;
      }, 100);
    }
  };

  self.onEventPrintCancelling = payload => {
    self.removeNotification();
  };

  self.onEventPrintCancelled = payload => {
    self.removeNotification();
  };

  self.sendErrorReport = (errorNumber, description) => {
    var payload = {
      command: "sendErrorReport",
      errorNumber: errorNumber,
      description: description
    };
    $.ajax({
      url: API_BASEURL + "plugin/palette2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(payload),
      contentType: "application/json; charset=UTF-8"
    });
  };

  self.readyToStartAlert = setupAlertSetting => {
    if (setupAlertSetting) {
      return swal({
        title: "Filament in place and ready to go",
        text: `Please press "Start Print" below or directly on your Palette 2 screen to begin your print.`,
        type: "info",
        inputClass: "setup-checkbox",
        input: "checkbox",
        inputPlaceholder: "Don't show me these setup alerts anymore",
        confirmButtonText: "Start Print"
      });
    } else {
      return swal({
        title: "Filament in place and ready to go",
        text: `Please press "Start Print" below or directly on your Palette 2 screen to begin your print.`,
        type: "info",
        confirmButtonText: "Start Print"
      });
    }
  };

  self.onDataUpdaterPluginMessage = (pluginIdent, message) => {
    if (pluginIdent === "palette2") {
      if (message.command === "error") {
        omegaApp.errorAlert(message.data).then(result => {
          // if user clicks yes
          if (result.value) {
            omegaApp.errorTextAlert().then(result => {
              if (result.dismiss === Swal.DismissReason.cancel) {
              } else {
                description = "";
                if (result.value) {
                  description = result.value;
                }

                self.sendErrorReport(message.data, description);
              }
            });
          }
          // if user clicks no
          else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
      } else if (message.command === "printHeartbeatCheck") {
        if (message.data === "P2NotConnected") {
          let base_url = window.location.origin;
          window.location.href = `${base_url}/#tab_plugin_palette2`;
        }
        self.findCurrentFilename();
        self.applyPaletteDisabling();
        omegaApp.displayHeartbeatAlert(message.data);
      } else if (message.command === "pings") {
        if (message.data.length) {
          self.pings(message.data.reverse());
          self.latestPing(self.pings()[0].number);
          self.latestPingPercent(self.pings()[0].percent);
        } else {
          self.latestPing(0);
          self.latestPingPercent("");
          self.pings([]);
          $(".ping-history").hide();
        }
      } else if (message.command === "pongs") {
        if (message.data.length) {
          self.pongs(message.data.reverse());
          self.latestPong(self.pongs()[0].number);
          self.latestPongPercent(self.pongs()[0].percent);
        } else {
          self.latestPong(0);
          self.latestPongPercent("");
          self.pongs([]);
          $(".pong-history").hide();
        }
      } else if (message.command === "selectedPort") {
        selectedPort = message.data;
        if (selectedPort) {
          self.selectedPort(selectedPort);
        }
      } else if (message.command === "ports") {
        allPorts = message.data;
        if (allPorts.length === 0) {
          omegaApp.noSerialPortsAlert();
          $(".serial-ports-list").hide(125);
        } else {
          self.ports(allPorts);
          $(".serial-ports-list").toggle(125);
        }
      } else if (message.command === "currentSplice") {
        self.currentSplice(message.data);
      } else if (message.command === "displayAlert") {
        self.displayAlerts = message.data;
      } else if (message.command === "totalSplices") {
        self.nSplices(message.data);
      } else if (message.command === "P2Connection") {
        if (self.tryingToConnect) {
          omegaApp.loadingOverlay(false);
        }
        self.connected(message.data);
        if (self.connected()) {
          self.tryingToConnect = false;
          self.applyPaletteDisabling();
        } else {
          self.applyPaletteDisabling();
          omegaApp.loadingOverlay(false);
          if (self.tryingToConnect) {
            self.tryingToConnect = false;
            omegaApp.cannotConnectAlert();
          }
        }
      }
      // else if (message.includes("UI:Refresh Demo List")) {
      //   self.refreshDemoList();
      // }
      else if (message.command === "filamentLength") {
        self.filaLength(message.data);
      } else if (message.command === "currentStatus") {
        if (message.data && message.data !== self.currentStatus()) {
          self.currentStatus(message.data);
        } else if (!message.data) {
          self.currentStatus("No ongoing Palette 2 print");
        }
      } else if (message.command === "amountLeftToExtrude") {
        self.amountLeftToExtrude = message.data;
        if (!self.actualPrintStarted && self.amountLeftToExtrude) {
          if (!$("#jog-filament-notification").is(":visible")) {
            self.updateFilamentCountdown(true);
            self.control.extrusionAmount(self.amountLeftToExtrude);
          } else if ($("#jog-filament-notification").is(":visible")) {
            self.updateFilamentCountdown(false);
          }
        }
      } else if (message.command === "printPaused") {
        self.printPaused = message.data;
      } else if (message.command === "printerConnection") {
        if (message.data === "Operational" || message.data === "Printing" || message.data === "Paused") {
          self.printerConnected = true;
        } else if (
          message.data === "Closed" ||
          message.data === "Offline" ||
          message.data === "None" ||
          message.data === "Unknown"
        ) {
          self.printerConnected = false;
        }
      } else if (message.command === "firstTime") {
        self.firstTime = message.data;
      } else if (message.command === "autoConnect") {
        self.autoconnect = message.data;
      } else if (message.command === "Palette2SetupStarted") {
        self.palette2SetupStarted = message.data;
      } else if (message.command === "actualPrintStarted") {
        self.actualPrintStarted = message.data;
      } else if (message.command === "alert") {
        self.showAlert(message.data);
      }
    }
  };
}

/* ======================
  RUN
  ======================= */

$(function() {
  OmegaViewModel();
  OCTOPRINT_VIEWMODELS.push({
    // This is the constructor to call for instantiating the plugin
    construct: OmegaViewModel,
    dependencies: ["settingsViewModel", "controlViewModel"],
    elements: ["#tab_plugin_palette2"]
  }); // This is a list of dependencies to inject into the plugin. The order will correspond to the "parameters" arguments above // Finally, this is the list of selectors for all elements we want this view model to be bound to.
});
