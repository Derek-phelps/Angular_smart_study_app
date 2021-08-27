import sys
import configparser
import os

from PyQt5 import QtCore, QtGui, QtWidgets
from functools import partial

import update_app_functions as uaf
# from CSftp import CSftp
from CUpdateWindow import CUpdateWindow


class App(QtWidgets.QWidget):

    def __init__(self):
        super().__init__()
        self.title = 'Smart-Study - Update Application'
        self.initUI()

    def showHostList(self):
        self.line.show()
        self.listView.show()
        self.foundLabel.show()

    def hideHostList(self):
        self.line.hide()
        self.listView.hide()
        self.foundLabel.hide()

    def setDefaultHostModel(self):
        self.listView.model().clear()
        defaultText = QtGui.QStandardItem('No host definition found...')
        defaultText.setCheckable(False)
        self.listView.model().appendRow(defaultText)

    def showErrorMessage(self, message):
        msg = QtWidgets.QMessageBox()
        msg.setIcon(QtWidgets.QMessageBox.Critical)
        msg.setText("Error")
        msg.setInformativeText(message)
        msg.setWindowTitle("Error")
        msg.exec_()

    def initUI(self):
        self.setWindowTitle(self.title)
        self.setMinimumWidth(600)

        self.checkUploadButton = True

        self.localAppDir = None
        self.localApiDir = None

        localBaseDir = os.path.dirname(os.path.abspath(
            os.path.join(__file__, os.pardir, os.pardir))).replace("\\", "/")

        self.appDirLabel = QtWidgets.QLabel(self)
        self.appDirLabel.setWordWrap(True)
        localAppDir = localBaseDir + '/smart_study_pro_web_app/dist/Smart-Study'
        self.appDirLabel.setText('Local app directory not set...')
        if uaf.checkIsAppBaseDir(localAppDir, False):
            self.localAppDir = localAppDir
            self.appDirLabel.setText(self.localAppDir)

        changeAppDirButton = QtWidgets.QPushButton(
            'Change local app directory...', self)
        changeAppDirButton.clicked.connect(
            partial(self.on_load_local_dir_click, 'app'))

        self.apiDirLabel = QtWidgets.QLabel(self)
        self.apiDirLabel.setWordWrap(True)
        localApiDir = localBaseDir + '/smart_study_pro_api'
        self.apiDirLabel.setText('Local API directory not set...')
        if uaf.checkIsApiBaseDir(localApiDir, False):
            self.localApiDir = localApiDir
            self.apiDirLabel.setText(self.localApiDir)

        changeApiDirButton = QtWidgets.QPushButton(
            'Change local API directory...', self)
        changeApiDirButton.clicked.connect(
            partial(self.on_load_local_dir_click, 'api'))

        self.hostFileLabel = QtWidgets.QLabel(self)
        self.hostFileLabel.setWordWrap(True)
        self.hostFileLabel.setText('No file selected...')

        selectHostFileButton = QtWidgets.QPushButton('Load host file...', self)
        selectHostFileButton.clicked.connect(self.on_open_host_click)

        self.line = QtWidgets.QFrame(self)
        self.line.setFrameShape(QtWidgets.QFrame.HLine)
        self.line.setFrameShadow(QtWidgets.QFrame.Sunken)

        self.foundLabel = QtWidgets.QLabel()
        self.foundLabel.setText('Found following host configurations:')

        self.toggleCheckAllCheckBox = QtWidgets.QCheckBox('Select all', self)
        self.toggleCheckAllCheckBox.clicked.connect(self.toggleCheckAll)

        self.listView = QtWidgets.QListView(self)
        self.listView.setSelectionMode(
            QtWidgets.QAbstractItemView.NoSelection)
        self.listView.setEditTriggers(
            QtWidgets.QAbstractItemView.NoEditTriggers)
        model = QtGui.QStandardItemModel(self.listView)
        model.itemChanged.connect(self.checkLoadUploadDirButtonEnabled)
        model.itemChanged.connect(self.checkAllSelected)
        self.listView.setModel(model)
        self.setDefaultHostModel()

        self.loadUpdateDirButton = QtWidgets.QPushButton(
            'Load directories on server(s) that can be updated.', self)
        self.loadUpdateDirButton.setDisabled(True)
        self.loadUpdateDirButton.clicked.connect(self.on_load_update_dir_click)

        self.progressBar = QtWidgets.QProgressBar(self)
        self.progressBar.hide()

        self.layout = QtWidgets.QGridLayout(self)
        currentRow = 0
        # Change app directory
        self.layout.addWidget(self.appDirLabel, currentRow, 0)
        self.layout.addWidget(changeAppDirButton, currentRow, 1)
        currentRow += 1
        # Change API directory
        self.layout.addWidget(self.apiDirLabel, currentRow, 0)
        self.layout.addWidget(changeApiDirButton, currentRow, 1)
        currentRow += 1
        # Select host file
        self.layout.addWidget(self.hostFileLabel, currentRow, 0)
        self.layout.addWidget(selectHostFileButton, currentRow, 1)
        currentRow += 1
        # Separator and found directories list view
        self.layout.addWidget(self.line, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.foundLabel, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.toggleCheckAllCheckBox, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.listView, currentRow, 0, 1, 2)
        currentRow += 1
        self.layout.addWidget(self.loadUpdateDirButton, currentRow, 0, 1, 2)
        self.layout.addWidget(self.progressBar, currentRow, 0, 1, 2)
        currentRow += 1

        self.setLayout(self.layout)

        hostFilePath = './hosts.ini'
        if os.path.isfile(hostFilePath):
            self.on_open_host_click(hostFilePath)

        self.show()

    def setLocalAppDir(self, path):
        self.appDirLabel.setText('Local app directory not set...')
        self.localAppDir = None
        try:
            uaf.checkIsAppBaseDir(path)
            self.localAppDir = path
            self.appDirLabel.setText(self.localAppDir)
        except Exception as e:
            self.showErrorMessage(str(e))

    def setLocalApiDir(self, path):
        self.apiDirLabel.setText('Local API directory not set...')
        self.localApiDir = None
        try:
            uaf.checkIsApiBaseDir(path)
            self.localApiDir = path
            self.apiDirLabel.setText(self.localApiDir)
        except Exception as e:
            self.showErrorMessage(str(e))

    def toggleCheckAll(self):
        self.checkUploadButton = False
        if self.toggleCheckAllCheckBox.checkState() == QtCore.Qt.PartiallyChecked:
            self.toggleCheckAllCheckBox.setChecked(QtCore.Qt.Checked)
        for index in range(self.listView.model().rowCount()):
            if self.listView.model().item(index).isCheckable():
                self.listView.model().item(index).setCheckState(
                    self.toggleCheckAllCheckBox.checkState())
        self.checkUploadButton = True

    def checkAllSelected(self):
        if self.checkUploadButton:
            selectionCount = 0
            for index in range(self.listView.model().rowCount()):
                if self.listView.model().item(index).checkState() == QtCore.Qt.Checked:
                    selectionCount += 1
            selection = QtCore.Qt.Unchecked
            if selectionCount == self.listView.model().rowCount():
                selection = QtCore.Qt.Checked
            elif selectionCount > 0:
                selection = QtCore.Qt.PartiallyChecked
            self.toggleCheckAllCheckBox.setCheckState(selection)

    def checkLoadUploadDirButtonEnabled(self):
        hostSelected = False
        for index in range(self.listView.model().rowCount()):
            if self.listView.model().item(index).checkState() == QtCore.Qt.Checked:
                hostSelected = True

        if not hostSelected or self.listView.model().rowCount() == 0 or self.localAppDir == None or self.localApiDir == None:
            self.loadUpdateDirButton.setDisabled(True)
        else:
            self.loadUpdateDirButton.setDisabled(False)

    @ QtCore.pyqtSlot()
    def on_open_host_click(self, fileName=""):
        if fileName == "":
            fileName, _ = QtWidgets.QFileDialog.getOpenFileName(
                self, 'Open host file', '', "Ini file (*.ini)")
        if fileName != "":
            self.toggleCheckAllCheckBox.setCheckState(QtCore.Qt.Unchecked)
            self.hostFileLabel.setText(fileName)
            self.hostFileLabel.setToolTip(fileName)

            self.listView.model().clear()

            self.config = configparser.ConfigParser()
            try:
                self.config.read(fileName)

                # QtCore.Qt.Checked if len(self.config.sections()) == 1 else QtCore.Qt.Unchecked
                checkState = QtCore.Qt.Unchecked

                if len(self.config.sections()) > 0:
                    for host in self.config.sections():
                        if self.config.has_option(host, 'sshuser') and self.config.has_option(host, 'sshpass') and self.config.has_option(host, 'sshhost') and self.config.has_option(host, 'basepath'):
                            item = QtGui.QStandardItem(host)
                            item.setCheckable(True)
                            item.setCheckState(checkState)
                            self.listView.model().appendRow(item)
            except Exception as e:
                self.showErrorMessage(str(e))

            if self.listView.model().rowCount() == 0:
                self.setDefaultHostModel()

            self.checkLoadUploadDirButtonEnabled()

    @ QtCore.pyqtSlot()
    def on_load_local_dir_click(self, dirType):
        if dirType.lower() == 'app':
            currentDir = self.localAppDir if self.localAppDir else ''
            dirName = QtWidgets.QFileDialog.getExistingDirectory(
                self, 'Select App Directory', currentDir)
            if dirName != '':
                self.setLocalAppDir(dirName)
        elif dirType.lower() == 'api':
            currentDir = self.localApiDir if self.localApiDir else ''
            dirName = QtWidgets.QFileDialog.getExistingDirectory(
                self, 'Select API Directory', currentDir)
            if dirName != '':
                self.setLocalApiDir(dirName)
        else:
            raise Exception('Unknown directory type call!')

        self.checkLoadUploadDirButtonEnabled()

    @ QtCore.pyqtSlot()
    def on_load_update_dir_click(self):
        try:
            self.config
        except Exception:
            return

        self.setDisabled(True)
        # self.repaint()

        selectedConfigs = []
        for index in range(self.listView.model().rowCount()):
            if self.listView.model().item(index).isCheckable() and self.listView.model().item(index).checkState() == QtCore.Qt.Checked:
                selectedConfigs.append(
                    self.listView.model().item(index).text())

        self.progressBar.setRange(0, len(selectedConfigs))
        self.loadUpdateDirButton.hide()
        self.progressBar.show()
        self.progressBar.setValue(0)
        self.repaint()
        self.dialog = CUpdateWindow(self)
        self.dialog.updateWindowCloses.connect(self.dialogClosed)
        self.dialog.parentProgressIncrement.connect(self.incrementProgress)
        self.dialog.init(self.config, selectedConfigs,
                         self.localAppDir, self.localApiDir)
        self.dialog.show()

    @ QtCore.pyqtSlot()
    def incrementProgress(self):
        self.progressBar.setValue(self.progressBar.value() + 1)

    @ QtCore.pyqtSlot()
    def dialogClosed(self):
        self.progressBar.hide()
        self.loadUpdateDirButton.show()
        self.setDisabled(False)


app = QtWidgets.QApplication(sys.argv)
ex = App()
sys.exit(app.exec_())
