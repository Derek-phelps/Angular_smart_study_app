# import argparse
import re
from termcolor import colored
import os
import paramiko
import json
import requests
# import sys
from PyQt5 import QtCore


class CSftp(QtCore.QObject):
    updateProgressStatus = QtCore.pyqtSignal(str)

    m_sshClient = None
    m_ftpClient = None

    m_isInit = False

    # Method to initialize the ftp client, returns true on success
    def init(self, hostname, username, password):
        if self.__isInit(False):
            self.m_isInit = False
            self.m_ftpClient.close()
            self.m_sshClient.close()
        try:
            self.m_sshClient = paramiko.SSHClient()
            self.m_sshClient.set_missing_host_key_policy(
                paramiko.AutoAddPolicy())
            self.m_sshClient.connect(
                hostname=hostname, username=username, password=password)

            self.m_ftpClient = self.m_sshClient.open_sftp()
            self.m_isInit = True
        except Exception:
            self.m_ftpClient.close()
            self.m_sshClient.close()
            self.m_isInit = False
        return self.m_isInit

    # Methon to check if base directory was found
    def changeAndCheckBaseDir(self, basedir):
        self.__isInit()

        try:
            self.m_ftpClient.chdir(basedir)
            return True
        except Exception as e:
            print(e)
            return False

    def getAllChildDirs(self):
        self.__isInit()

        checkFiles = ['/index.html', '/Maintenance/index.html',
                      '/assets/i18n/web.json', '/..htaccess']

        updateDirs = []

        for updateDir in self.__getChildDirectories():
            validAppDir = True
            for checkFile in checkFiles:
                try:
                    self.m_ftpClient.stat(updateDir + checkFile)
                except Exception:
                    validAppDir = False

            updateDirs.append((updateDir, validAppDir))
        return updateDirs

    def getValidAppChildDirs(self):
        self.__isInit()

        checkFiles = ['/index.html', '/Maintenance/index.html',
                      '/assets/i18n/web.json', '/..htaccess']

        updateDirs = []

        for updateDir in self.__getChildDirectories():
            validAppDir = True
            for checkFile in checkFiles:
                try:
                    self.m_ftpClient.stat(updateDir + checkFile)
                except Exception:
                    validAppDir = False

            if validAppDir:
                updateDirs.append(updateDir)
        return updateDirs

    def setMaintenancePage(self, updateDir):
        # Set maintenance page
        statusText = '[INFO] Setting maintenance page...'
        print(colored(statusText, 'blue'))
        self.updateProgressStatus.emit(statusText)
        self.m_ftpClient.posix_rename(
            updateDir + '/..htaccess', updateDir + '/.htaccess')
        # TODO: Differentiate between easyname and other servers
        # self.m_ftpClient.posix_rename(
        #     updateDir + '/API/.htaccess', updateDir + '/API/..htaccess')

    def alterDbIfNeeded(self, updateDir, apiDir):
        return True
        # # print("STOR", name, localpath)

        # if not os.path.isfile('table_changes.sql'):
        #     return False
        # updateDbFile = open('table_changes.sql', 'r')
        # updateStatements = updateDbFile.readlines()
        # strippedUpdateStatements = []
        # for updateStatement in updateStatements:
        #     # print(updateStatement.strip())
        #     strippedUpdateStatements.append(updateStatement.strip())

        # sql = json.dumps(strippedUpdateStatements, separators=(',', ':'))

        # # # print(userdata)
        # remoteServerUrl = self.__getRemoteServerUrl(updateDir)
        # if remoteServerUrl:
        #     localVersionNumber = self.__getLocalVersionNumber(apiDir)
        #     if not localVersionNumber:
        #         return False
        #     try:
        #         self.m_ftpClient.put(
        #             'UpdateDb.php', updateDir + '/API/application/controllers/UpdateDb.php')
        #     except Exception:
        #         return False
        #     userdata = {"key": "laksjdfhlakdsjfhalksdjfhlaksdjfh",
        #                 "VERSION_NUMBER": localVersionNumber,
        #                 "SQL": sql}
        #     resp = requests.post(
        #         remoteServerUrl + '/API/index.php/UpdateDb/executesql', data=userdata)
        #     # # print(resp.url)
        #     try:
        #         ret = json.loads(resp.text)["success"]
        #         self.m_ftpClient.remove(
        #             updateDir + '/API/application/controllers/UpdateDb.php')
        #         return ret
        #     except Exception:
        #         return False
        #     # print(resp.text)
        # # return self.__getLocalVersionNumber(apiDir)
        # return False

    def resetMainTenancePage(self, updateDir):
        statusText = '[INFO] Resetting maintenance page...'
        print(colored(statusText, 'blue'))
        self.updateProgressStatus.emit(statusText)
        # self.m_ftpClient.posix_rename(
        #     updateDir + '/API/..htaccess', updateDir + '/API/.htaccess')
        self.m_ftpClient.posix_rename(updateDir + '/.htaccess',
                                      updateDir + '/..htaccess')

    def deleteOldApp(self, updateDir):
        # Update database
        # TODO: copy code here

        # Delete old app and API files
        statusText = '[INFO] Deleting old files...'
        print(colored(statusText, 'blue'))
        self.updateProgressStatus.emit(statusText)

        # Delete files in app root folder
        self.__deleteFilesInFolder(updateDir, excludeFileList=['.htaccess'])
        # Delete files in assets folder
        self.__deleteFilesInFolder(updateDir + '/assets')
        # Delete folders recursive in assets (except i18n)
        delAssetsDirs = self.__getChildDirectories(
            updateDir + '/assets', ['i18n'])
        for delAssetsDir in delAssetsDirs:
            self.__removeDirectory(updateDir + '/assets/' + delAssetsDir)
        # Delete all files in assets/i18n folder except web.json
        self.__deleteFilesInFolder(updateDir + '/assets/i18n', ['web.json'])
        # Delete folders recursive in i18n
        delSubFolders = self.__getChildDirectories(updateDir + '/assets/i18n')
        for delSubFolder in delSubFolders:
            self.__removeDirectory(updateDir + '/assets/i18n/' + delSubFolder)

        self.__deleteFiles([updateDir + '/API/index.php', updateDir + '/API/test.php',
                            updateDir + '/API/loadData.php', updateDir + '/API/.htaccess'])

        # Delete API controller files
        self.__deleteFilesInFolder(updateDir + '/API/application/controllers')
        # Delete API library files
        self.__deleteFilesInFolder(updateDir + '/API/application/libraries')
        # Delete API view files
        self.__deleteFilesInFolder(updateDir + '/API/application/views')
        # Delete API model files
        self.__deleteFilesInFolder(updateDir + '/API/application/models')

    def uploadNewApp(self, updateDir, appDir, apiDir):
        # Add new app and API files
        statusText = '[INFO] Uploading new files...'
        print(colored(statusText, 'blue'))
        self.updateProgressStatus.emit(statusText)
        wd = self.m_ftpClient.getcwd()

        # Add new app files
        self.m_ftpClient.chdir(updateDir)
        self.__addDirectory(appDir)

        # Add new API files
        self.m_ftpClient.put(apiDir + '/index.php', 'API/index.php')
        self.m_ftpClient.put(apiDir + '/loadData.php', 'API/loadData.php')
        self.m_ftpClient.put(apiDir + '/.htaccess', 'API/.htaccess')
        self.m_ftpClient.chdir('API/application')
        wdAPIApplication = self.m_ftpClient.getcwd()
        # Upload new controllers
        self.m_ftpClient.chdir('controllers')
        self.__addDirectory(apiDir + '/application/controllers')
        self.m_ftpClient.chdir(wdAPIApplication + '/libraries')
        uploadDir = apiDir + '/application/libraries'
        onlyfiles = [f for f in os.listdir(
            uploadDir) if os.path.isfile(os.path.join(uploadDir, f))]
        for onlyfile in onlyfiles:
            print("STOR", onlyfile, uploadDir + '/' + onlyfile)
            self.m_ftpClient.put(uploadDir + '/' + onlyfile, onlyfile)
        # Upload new views
        self.m_ftpClient.chdir(wdAPIApplication + '/views')
        uploadDir = apiDir + '/application/views'
        onlyfiles = [f for f in os.listdir(
            uploadDir) if os.path.isfile(os.path.join(uploadDir, f))]
        for onlyfile in onlyfiles:
            print("STOR", onlyfile, uploadDir + '/' + onlyfile)
            self.m_ftpClient.put(uploadDir + '/' + onlyfile, onlyfile)
        # Upload new models
        self.m_ftpClient.chdir(wdAPIApplication + '/models')
        uploadDir = apiDir + '/application/models'
        onlyfiles = [f for f in os.listdir(
            uploadDir) if os.path.isfile(os.path.join(uploadDir, f))]
        for onlyfile in onlyfiles:
            print("STOR", onlyfile, uploadDir + '/' + onlyfile)
            self.m_ftpClient.put(uploadDir + '/' + onlyfile, onlyfile)

        self.m_ftpClient.chdir(wd)

        # # # TODO: Update database

        # # # Reset maintenance page
        # # print(colored('[INFO] Resetting maintenance page', 'blue'))
        # # ftp_client.posix_rename(updateDir[0] + '/API/..htaccess',
        # #                         updateDir[0] + '/API/.htaccess')
        # # ftp_client.posix_rename(updateDir[0] + '/.htaccess',
        # #                         updateDir[0] + '/..htaccess')

    #####################################################################
    # PRIVATE
    #####################################################################
    def __isInit(self, throwException=True):
        if throwException and not self.m_isInit:
            raise Exception('[ERROR] CSftp not initialized!!')
        else:
            return self.m_isInit

    def __getChildDirectories(self, folder='.', excludeFolderList=[]):
        childDirs = []
        for name in self.m_ftpClient.listdir(folder):
            lstatout = str(self.m_ftpClient.lstat(
                folder + '/' + name)).split()[0]
            if 'd' in lstatout and name not in excludeFolderList:
                childDirs.append(name)
        return childDirs

    def __getFilesInFolder(self, folder='.', excludeFileList=[]):
        files = []
        for name in self.m_ftpClient.listdir(folder):
            lstatout = str(self.m_ftpClient.lstat(
                folder + '/' + name)).split()[0]
            if 'd' not in lstatout and name not in excludeFileList:
                files.append(name)
        return files

    def __deleteFilesInFolder(self, folder='.', excludeFileList=[]):
        filesToDel = self.__getFilesInFolder(
            folder, excludeFileList=excludeFileList)
        for delFile in filesToDel:
            self.m_ftpClient.remove(folder + '/' + delFile)

    def __deleteFiles(self, files=[]):
        for file in files:
            try:
                self.m_ftpClient.remove(file)
            except Exception:
                pass

    def __removeDirectory(self, path):
        files = self.m_ftpClient.listdir(path)

        for f in files:
            filepath = path + '/' + f  # os.path.join(path, f)
            try:
                self.m_ftpClient.remove(filepath)
            except IOError:
                self.__removeDirectory(filepath)

        self.m_ftpClient.rmdir(path)

    def __addDirectory(self, path):
        for name in os.listdir(path):
            localpath = os.path.join(path, name)
            if os.path.isfile(localpath):
                print("STOR", name, localpath)
                self.m_ftpClient.put(localpath, name)
            elif os.path.isdir(localpath):
                print("MKD", name)

                try:
                    self.m_ftpClient.chdir(name)
                except IOError:
                    self.m_ftpClient.mkdir(name)
                    self.m_ftpClient.chdir(name)

                self.__addDirectory(localpath)
                self.m_ftpClient.chdir('..')

    def __getRemoteServerUrl(self, updateDir):
        webUrlPath = updateDir + '/assets/i18n/web.json'
        try:
            self.m_ftpClient.stat(webUrlPath)
        except Exception:
            return False

        web_url_file = self.m_ftpClient.open(webUrlPath)
        jsonString = ''
        try:
            for line in web_url_file:
                jsonString += line
        finally:
            web_url_file.close()
        try:
            return json.loads(jsonString)["WebURL"]
        except Exception:
            return False

    def __getLocalVersionNumber(self, apiDir):
        configPath = apiDir + '/application/controllers/Users.php'
        if os.path.isfile(configPath):
            pattern = re.compile(r"^\s*[$]VERSION_NUMBER *= *'(.*)';\s*$")

            for line in open(configPath):
                for match in re.finditer(pattern, line):
                    return match.group(1)
        return False

    # Destructor
    def __del__(self):
        try:
            self.m_ftpClient.close()
            self.m_sshClient.close()
        except Exception:
            pass
