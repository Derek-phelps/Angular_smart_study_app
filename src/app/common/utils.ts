export enum FileType {
    NoFile,
    Video,
    Audio,
    PDF,
    Image,
    Unknown = -1
}

export const FILE_TYPE_UTILS = {
    getFileEnding(filePath: string = undefined) {
        return filePath.split('.').pop().toLowerCase();
    },

    isFileViewable(filePath: string = undefined) {
        if (filePath && filePath != '') {
            let fileEnding = this.getFileEnding(filePath);
            return fileEnding.match(/(jpg|jpeg|png|gif|pdf)$/i);
        }
        return false;
    },

    checkAndGetNonDisplayablePath(filePath: string = undefined) {
        let fileEnding = this.getFileEnding(filePath);
        if (fileEnding.match(/(jpg|jpeg|png|gif)$/i)) {
            return undefined;
        } else if (fileEnding.match(/(csv)$/i)) {
            return '/assets/img/theme/csv.png';
        } else if (fileEnding.match(/(7z|rar|z|zip)$/i)) {
            return '/assets/img/theme/zip.png';
        } else if (fileEnding.match(/(doc|docx)$/i)) {
            return '/assets/img/theme/word.png';
        } else if (fileEnding.match(/(xls|xlsx|xlsm)$/i)) {
            return '/assets/img/theme/excel.png';
        } else if (fileEnding.match(/(ppt|pptx|pptm)$/i)) {
            return '/assets/img/theme/powerpoint.png';
        } else if (fileEnding.match(/(pdf)$/i)) {
            return '/assets/img/theme/pdf.png';
        } else {
            return '/assets/img/theme/file.png';
        }
    },

    getFileType(filePath: string = undefined) {
        let fileEnding = this.getFileEnding(filePath);
        if (fileEnding.match(/(jpg|jpeg|png|gif)$/i)) {
            return FileType.Image;
        } else if (fileEnding.match(/(pdf)$/i)) {
            return FileType.PDF;
        } else if (fileEnding.match(/(mp4|mov|avi|webm)$/i)) {
            return FileType.Video;
        } else if (fileEnding.match(/(mp3|m4a|wav)$/i)) {
            return FileType.Audio;
        } else if (fileEnding.length > 0) {
            console.log("unknown file type");
            return FileType.Unknown;
        } else {
            return FileType.NoFile;
        }
    }
};