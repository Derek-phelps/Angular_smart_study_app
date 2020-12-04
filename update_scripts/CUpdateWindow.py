# import sys
# import configparser
# import os

from PyQt5 import QtCore, QtGui, QtWidgets
# from functools import partial

# import update_app_functions as uaf
from CSftp import CSftp

import time


class CUpdateWindow(QtWidgets.QWidget):
    updateWindowCloses = QtCore.pyqtSignal()
    parentProgressIncrement = QtCore.pyqtSignal()

    def __init__(self, parent):
        # QtWidgets.QWidget.__init__(self, None, QtCore.Qt.WindowStaysOnTopHint)
        QtWidgets.QWidget.__init__(self)
        self.setWindowTitle('Update Applications')
        self.parent = parent

    def init(self, config, selectedConfigs, appDir, apiDir):
        self.config = config
        self.selectedConfigs = selectedConfigs

        self.appDir = appDir
        self.apiDir = apiDir

        self.initUI()

    def initUI(self):
        self.checkSelected = True
        label = QtWidgets.QLabel()
        label.setText('Folders that can be updated:')

        self.toggleCheckAllCheckBox = QtWidgets.QCheckBox('Select all', self)
        self.toggleCheckAllCheckBox.clicked.connect(self.toggleCheckAll)

        self.tableView = QtWidgets.QTableView(self)
        self.tableView.setMinimumWidth(500)
        self.tableView.verticalHeader().hide()
        self.tableView.horizontalHeader().hide()
        # self.tableView.setShowGrid(False)
        self.tableView.setSelectionMode(
            QtWidgets.QAbstractItemView.NoSelection)
        self.tableView.setEditTriggers(
            QtWidgets.QAbstractItemView.NoEditTriggers)
        self.tableView.horizontalHeader().setStretchLastSection(True)
        self.tableView.horizontalHeader().setSectionResizeMode(
            QtWidgets.QHeaderView.Stretch)
        model = QtGui.QStandardItemModel(self.tableView)
        # model.setColumnCount(2)
        model.itemChanged.connect(self.checkAllSelected)
        model.itemChanged.connect(self.colorItemsCheckUpdateButton)

        self.sftpClients = {}
        for host in self.config:
            if host in self.selectedConfigs:
                sftp_client = CSftp(self)
                if sftp_client.init(self.config[host]['sshhost'], self.config[host]['sshuser'], self.config[host]['sshpass']):
                    if sftp_client.changeAndCheckBaseDir(self.config[host]['basepath']):
                        isMultiClient = self.config.has_option(
                            host, 'multiclient') and self.config[host]['multiClient'] == "True"
                        childDirs = sftp_client.getValidAppChildDirs(
                            isMultiClient)
                        if isMultiClient and len(childDirs) == 2:
                            childDir = childDirs[0]
                            rowItem = []
                            hostItem = QtGui.QStandardItem(host)
                            hostItem.setCheckable(True)
                            hostItem.setCheckState(QtCore.Qt.Unchecked)
                            childItem = QtGui.QStandardItem(childDir)
                            rowItem.append(hostItem)
                            rowItem.append(childItem)
                            if len(childDirs[1]) > 0:
                                symlinkDirs = ""
                                first = True
                                for symLinkDir in childDirs[1]:
                                    if first:
                                        symlinkDirs += symLinkDir
                                        first = False
                                    else:
                                        symlinkDirs += "\n" + symLinkDir
                                symLinkDirItem = QtGui.QStandardItem(
                                    symlinkDirs)
                                rowItem.append(symLinkDirItem)
                            model.appendRow(rowItem)
                        elif not isMultiClient:
                            childDirs.sort()
                            for childDir in childDirs:
                                rowItem = []
                                hostItem = QtGui.QStandardItem(host)
                                hostItem.setCheckable(True)
                                hostItem.setCheckState(QtCore.Qt.Unchecked)
                                childItem = QtGui.QStandardItem(childDir)
                                rowItem.append(hostItem)
                                rowItem.append(childItem)
                                model.appendRow(rowItem)

                        self.sftpClients[host] = sftp_client
                self.parentProgressIncrement.emit()

        self.tableView.setModel(model)
        self.tableView.resizeRowsToContents()
        # self.tableView.resizeColumnsToContents()

        self.startUpdateButton = QtWidgets.QPushButton(
            '==> START UPDATE <==', self)
        self.startUpdateButton.clicked.connect(self.on_start_update)
        self.startUpdateButton.setDisabled(True)

        self.updateLabel = QtWidgets.QLabel()
        self.updateLabel.setText('Currently updating:')
        self.updateLabel.hide()

        self.updateInfoLabel = QtWidgets.QLabel()
        # self.updateInfoLabel.setText('[INFO]')
        self.updateInfoLabel.hide()

        self.progressBar = QtWidgets.QProgressBar(self)
        self.progressBar.hide()

        # self.tableView.adjustSize()

        # closeButton = QtWidgets.QPushButton('Close', self)
        # closeButton.clicked.connect(self.on_close_click)

        self.layout = QtWidgets.QGridLayout(self)
        currentRow = 0
        self.layout.addWidget(label, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.toggleCheckAllCheckBox, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.tableView, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.startUpdateButton, currentRow, 0, 1, 2)
        self.layout.addWidget(self.updateLabel, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.updateInfoLabel, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.progressBar, currentRow, 0, 1, 2)

        self.parent.hide()

        # self.layout.addWidget(closeButton, currentRow, 2)

    def toggleCheckAll(self):
        self.checkSelected = False
        if self.toggleCheckAllCheckBox.checkState() == QtCore.Qt.PartiallyChecked:
            self.toggleCheckAllCheckBox.setChecked(QtCore.Qt.Checked)
        for index in range(self.tableView.model().rowCount()):
            if self.tableView.model().item(index).isCheckable():
                self.tableView.model().item(index).setCheckState(
                    self.toggleCheckAllCheckBox.checkState())
        self.checkSelected = True

    def checkAllSelected(self):
        if self.checkSelected:
            selectionCount = 0
            for index in range(self.tableView.model().rowCount()):
                if self.tableView.model().item(index).checkState() == QtCore.Qt.Checked:
                    selectionCount += 1
            selection = QtCore.Qt.Unchecked
            if selectionCount == self.tableView.model().rowCount():
                selection = QtCore.Qt.Checked
            elif selectionCount > 0:
                selection = QtCore.Qt.PartiallyChecked
            self.toggleCheckAllCheckBox.setCheckState(selection)

    @ QtCore.pyqtSlot()
    def colorItemsCheckUpdateButton(self):
        numSelected = 0
        defColor = QtGui.QStandardItem().background()
        for index in range(self.tableView.model().rowCount()):
            if self.tableView.model().item(index).checkState() == QtCore.Qt.Checked:
                self.tableView.model().item(index, 0).setBackground(QtCore.Qt.green)
                self.tableView.model().item(index, 1).setBackground(QtCore.Qt.green)
                if self.tableView.model().item(index, 2):
                    self.tableView.model().item(index, 2).setBackground(QtCore.Qt.green)
                numSelected += 1
            else:
                self.tableView.model().item(index, 0).setBackground(defColor)
                self.tableView.model().item(index, 1).setBackground(defColor)
                if self.tableView.model().item(index, 2):
                    self.tableView.model().item(index, 2).setBackground(defColor)
        self.startUpdateButton.setDisabled(numSelected == 0)

    @ QtCore.pyqtSlot()
    def on_close_click(self):
        self.close()

    @ QtCore.pyqtSlot()
    def on_start_update(self):
        selectedConfigs = []
        for index in range(self.tableView.model().rowCount()):
            if self.tableView.model().item(index).isCheckable() and self.tableView.model().item(index).checkState() == QtCore.Qt.Checked:
                selectedConfigs.append((self.tableView.model().item(index, 0).text(), self.tableView.model().item(
                    index, 1).text(), self.tableView.model().item(index, 2).text() if self.tableView.model().item(index, 2) else None))

        msg = QtWidgets.QMessageBox()
        msg.setIcon(QtWidgets.QMessageBox.Warning)

        msg.setWindowTitle("UPDATE WARNING")
        msg.setText("Are you sure that you want to update " +
                    str(len(selectedConfigs)) + " apps?")
        msg.setInformativeText("Warning: This cannot be undone!")

        detailText = "You are about to update following apps:\n===========================\n\n"
        for selectedConfig in selectedConfigs:
            detailText += selectedConfig[0] + ' - ' + selectedConfig[1] + '\n'
        msg.setDetailedText(detailText)
        msg.setStandardButtons(QtWidgets.QMessageBox.Ok |
                               QtWidgets.QMessageBox.Cancel)
        # msg.buttonClicked.connect(msgbtn)

        retval = msg.exec_()
        if retval == QtWidgets.QMessageBox.Ok:
            self.startUpdate(selectedConfigs)
        #     = > START UPDATE <=

    def startUpdate(self, selectedConfigs):
        self.setDisabled(True)
        self.progressBar.setRange(0, len(selectedConfigs) * 4)
        self.progressBar.setValue(0)
        # self.progressBar.setStatusTip('Test')
        self.startUpdateButton.hide()
        self.updateLabel.show()
        self.progressBar.show()
        self.updateInfoLabel.show()
        self.repaint()
        for currentConfig in selectedConfigs:
            self.updateLabel.setText(
                'Currently updating: ' + currentConfig[0] + ' - ' + currentConfig[1])
            self.updateLabel.repaint()
            # Update App
            currentSftp = self.sftpClients[currentConfig[0]]
            currentSftp.updateProgressStatus.connect(self.on_update_info_label)

            try:
                symlinkDirs = None
                if currentConfig[2]:
                    symlinkDirs = currentConfig[2].splitlines()

                currentSftp.setMaintenancePage(currentConfig[1], symlinkDirs)
                self.progressBar.setValue(self.progressBar.value() + 1)
                currentSftp.deleteOldApp(currentConfig[1], symlinkDirs)
                self.progressBar.setValue(self.progressBar.value() + 1)
                currentSftp.uploadNewApp(
                    currentConfig[1], self.appDir, self.apiDir, symlinkDirs)
                self.progressBar.setValue(self.progressBar.value() + 1)
                currentSftp.resetMainTenancePage(currentConfig[1], symlinkDirs)
            except Exception as e:
                print(e)

            currentSftp.updateProgressStatus.disconnect(
                self.on_update_info_label)
            self.progressBar.setValue(self.progressBar.value() + 1)
        self.updateInfoLabel.hide()
        self.progressBar.hide()
        self.updateLabel.hide()
        self.updateLabel.setText('Currently updating:')
        self.updateInfoLabel.setText('')
        self.startUpdateButton.show()
        self.setDisabled(False)

    @ QtCore.pyqtSlot(str)
    def on_update_info_label(self, infoText):
        self.updateInfoLabel.setText(infoText)
        self.updateInfoLabel.repaint()

    def closeEvent(self, event):
        self.parent.show()
        self.updateWindowCloses.emit()
        event.accept()
