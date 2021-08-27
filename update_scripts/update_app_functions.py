import os
from termcolor import colored


def checkIsAppBaseDir(path, throwException=True, removeWebJson=True):
    # Check if web app distribution found
    # appDir = localBaseDir + '/smart_study_pro_web_app/dist/Smart-Study'
    if not os.path.exists(path) or not os.path.exists(path + '/index.html'):
        if throwException:
            raise Exception(
                '[ERROR] Cold not find compiled web app distribution in "' + path + '".')
        else:
            return False

    # Delete web.json if found
    webJsonPath = path + '/assets/i18n/web.json'
    if os.path.exists(webJsonPath) and removeWebJson:
        os.remove(webJsonPath)
    return True


def checkIsApiBaseDir(path, throwException=True, removeWebJson=True):
    if not os.path.exists(path) or not os.path.exists(path + '/application/controllers') or not os.path.exists(path + '/application/libraries') or not os.path.exists(path + '/application/views'):
        if throwException:
            raise Exception(
                '[ERROR] Cold not find API distribution in "' + path + '".')
        else:
            return False
    return True


# # updateDbFile = open('table_changes.sql', 'r')
# # updateStatements = updateDbFile.readlines()
# # strippedUpdateStatements = []
# # for updateStatement in updateStatements:
# #     # print(updateStatement.strip())
# #     strippedUpdateStatements.append(updateStatement.strip())

# # test = json.dumps(strippedUpdateStatements, separators=(',', ':'))

# # userdata = {"key": "laksjdfhlakdsjfhalksdjfhlaksdjfh",
# #             "VERSION_NUMBER": '3.7.0',
# #             "SQL": test}
# # # print(userdata)
# # resp = requests.post(
# #     'https://develop.smart-study.at/API/index.php/UpdateDb/executesql', data=userdata)
# # # print(resp.url)
# # print(resp.text)

# # # updateDbFile = open('table_changes.sql', 'r')
# # # updateStatements = updateDbFile.readlines()
# # # for updateStatement in updateStatements:
# # #     print(updateStatement.strip())
