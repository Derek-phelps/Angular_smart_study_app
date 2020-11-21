import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadInput } from 'ngx-uploader';
import { ContentService } from '../../content.service';
import { Globals } from '../../../common/auth-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from '@angular/forms';

function validateSubChap(c: FormControl) {
  if (c.value.length == 0) {
    return { 'not-valid': true };
  }
  return null;
}

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent implements OnInit {

  public ChapterForm: FormGroup;
  public Courses = [];
  public Chapter = 0;
  public filePath = "";
  public isButtonActive = [];
  public DisableButton = 0;
  public config = {
    uiColor: '#F0F3F4',
    height: '400',
  };
  minDate: Date;
  isEditer: boolean = true;
  trainerList = [];
  contentId = 0;
  public fileUploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Chapter/videoUpload',
    method: 'POST',
    data: {}
  };

  constructor(public router: Router, private modalService: NgbModal, private route: ActivatedRoute, protected service: ContentService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.route.params.subscribe(params => {
      this.contentId = params.id;
    });
    this.minDate = new Date();
    this.ChapterForm = this.formBuilder.group({
      chapterId: ['', Validators.required],
      ChapterName: ['', Validators.required],
      course: ['', Validators.required],
      isOffline: [false],
      SubChapter: this.formBuilder.array([], validateSubChap),
      SubModel: this.formBuilder.array([])
    });
    this.service.getAllCourseByCompany().subscribe((data) => {
      if (data.success) {
        // console.log(data.data);
        this.Courses = data.data;
      } else {
        this.Courses = [];
      }
    });
    this.service.getAllTrainerByCompany(this._globals.companyInfo.companyId).subscribe((data) => {
      if (data.success) {
        this.trainerList = data.data;

      } else {
        this.trainerList = [];
      }
      this.loadContentById(this.contentId);
    });

    function goodbye(e) {
      if (!e) e = window.event;
      //e.cancelBubble is supported by IE - this will kill the bubbling process.
      e.cancelBubble = true;
      e.returnValue = undefined; //This is displayed on the dialog

      //e.stopPropagation works in Firefox.
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    window.onbeforeunload = goodbye;
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    window.onbeforeunload = undefined;
  }
  loadContentById(conId) {
    this.service.getChapterById(conId).subscribe((data) => {
      if (data.success) {
        var Subchar = [];
        var SubModel = [];
        for (var i = 0; i < data.data[0].SubChapter.length; i++) {
          if (data.data[0].is_offline == "1" || data.data[0].is_offline == "true" || data.data[0].is_offline == true) {
            this.addModel();
            var dateTime: any = "";
            if (data.data[0].SubChapter[i].trainingDate && data.data[0].SubChapter[i].trainingDate != '') {
              dateTime = new Date(data.data[0].SubChapter[i].trainingDate);
            }
            //console.log(data.data[0].SubChapter[i].trainerId);
            SubModel.push({
              'subChapterTitle': data.data[0].SubChapter[i].subChapterTitle,
              'trainerId': data.data[0].SubChapter[i].trainerId,
              'coursedateTime': dateTime,
              'placeName': data.data[0].SubChapter[i].trainingPlace,
              'startTime': data.data[0].SubChapter[i].trainingstartTime,
              'endTime': data.data[0].SubChapter[i].trainingEndTime,
              "subChapterId": data.data[0].SubChapter[i].subChapterId,
              'confirmationStart': data.data[0].SubChapter[i].trainingConfirmdStartTime,
              'confirmationEnd': data.data[0].SubChapter[i].trainingConfirmdEndTime
            });
          } else {
            this.addChapter();
            Subchar.push({
              "FilePath": data.data[0].SubChapter[i].FilePath,
              "isVideo": data.data[0].SubChapter[i].IsVideo,
              "subChapterTitle": data.data[0].SubChapter[i].subChapterTitle,
              "ChapterTxt": data.data[0].SubChapter[i].chapterTxt,
              "subChapterId": data.data[0].SubChapter[i].subChapterId
            });
          }
        }
        var isOff = false;
        if (data.data[0].is_offline == "1" || data.data[0].is_offline == "true" || data.data[0].is_offline == true) {
          isOff = true;
        }
        this.ChapterForm.setValue({
          chapterId: data.data[0].chapterId,
          ChapterName: data.data[0].chapterName,
          course: data.data[0].courseId,
          SubChapter: Subchar,
          SubModel: SubModel,
          isOffline: isOff,
        });
      }
    });
  }
  public removeModel(i, add) {
    this.translate.get('dialog.DeleteSubChapterSure').subscribe(value => {
      //alert(value);
      if (window.confirm(value)) {
        const control = <FormArray>this.ChapterForm.controls['SubModel'];
        control.removeAt(i);
        this.service.deleteSubchapter(add).subscribe((data) => {
          if (data.success) { }
        });
      }
    });
  }
  public addModel() {
    const control = <FormArray>this.ChapterForm.controls['SubModel'];
    // control.push(this.initChapter());
    control.insert(0, this.initModel());
  }
  initModel() {
    return this.formBuilder.group({
      'subChapterTitle': ['', Validators.required],
      'trainerId': [''],
      'coursedateTime': [''],
      'placeName': [''],
      'startTime': [''],
      'endTime': [''],
      'subChapterId': [''],
      'confirmationStart': [''],
      'confirmationEnd': ['']
    });
  }

  public removeChapter(i, add) {
    this.translate.get('dialog.DeleteSubChapSure').subscribe(value => {
      if (window.confirm(value)) {
        const control = <FormArray>this.ChapterForm.controls['SubChapter'];
        control.removeAt(i);
        this.service.deleteSubchapter(add).subscribe((data) => {
          if (data.success) { }
        });
      }
    });
    // if (window.confirm('Do you really want to delete the Sub Chapter?"')) {
    //   const control = <FormArray>this.ChapterForm.controls['SubChapter'];
    //   control.removeAt(i);
    //   this.service.deleteSubchapter(add).subscribe((data) => {
    //     if (data.success) { }
    //   });
    // }
  }
  public addChapter() {
    const control = <FormArray>this.ChapterForm.controls['SubChapter'];
    control.insert(0, this.initChapter());
  }
  initChapter() {
    return this.formBuilder.group({
      'subChapterTitle': ['', Validators.required],
      'isVideo': ['1'],
      'ChapterTxt': [null],
      'FilePath': [null],
      'subChapterId': [null]
    });
  }
  disableButton() {
    this.DisableButton = this.DisableButton + 1;
  }
  imgUpload(e, obj) {
    if (e.success) {
      // if(this._globals.companyInfo.companyId==0){
      obj.controls['FilePath'].setValue("API/img/Course/" + e.data);
      /* }else{
         obj.controls['FilePath'].setValue(this._globals.companyInfo.webUrl+"/API/img/Course/"+e.data);
       }*/
    } else {
      obj.controls['FilePath'].setValue("");
    }

    this.DisableButton = this.DisableButton - 1;
  }
  saveChapterData() {
    this.service.edit(this.ChapterForm.value).subscribe((data) => {
      if (data.success) {
        this.translate.get('alert.SaveChapterSuccess').subscribe(value => { alert(value); });

        var path = "";
        if (this._globals.getUserType() == "1") {
          path = 'superadmin/course/view';
        } else if (this._globals.getUserType() == "2") {
          path = 'admin/course/view';
        } else if (this._globals.getUserType() == "3") {
          path = 'trainer/course/view';
        } else {
          path = 'employee/course/view';
        }
        this.router.navigate([path, this.ChapterForm.value.course, 2], { skipLocationChange: false });
      } else {
        // TODO: Write message to user here
      }
    });
  }
  cancel() {
    var path = "";
    if (this._globals.getUserType() == "1") {
      path = 'superadmin/course/view';
    } else if (this._globals.getUserType() == "2") {
      path = 'admin/course/view';
    } else if (this._globals.getUserType() == "3") {
      path = 'trainer/course/view';
    } else {
      path = 'employee/course/view';
    }
    this.router.navigate([path, this.ChapterForm.value.course, 2], { skipLocationChange: false });
  }
  playVideo(val, content) {
    this.modalService.open(content).result.then((result) => {

    }, (reason) => {

    });
  }
}
