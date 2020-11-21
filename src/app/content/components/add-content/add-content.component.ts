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
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.scss']
})
export class AddContentComponent implements OnInit {

  public ChapterForm: FormGroup;
  //public Courses = [];
  public trainerList = [];
  public Chapter = 0;
  public filePath = "";
  public isButtonActive = [];
  minDate: Date;
  public DisableButton = 0;
  public config = {
    uiColor: '#F0F3F4',
    height: '400',
  };
  allowedFileTypesAudioVideo = ['application/pdf', 'image/png'];
  allowedFileTypesPdf = ['application/pdf'];
  isEditer: boolean = true;
  public fileUploaderOptions: UploadInput = {
    type: 'uploadAll',
    url: this._globals.APIURL + 'Chapter/videoUpload',
    method: 'POST',
    data: {}
  };

  constructor(public router: Router, private route: ActivatedRoute, private modalService: NgbModal, protected service: ContentService, private formBuilder: FormBuilder, private translate: TranslateService, public _globals: Globals) {
    if (this.translate.currentLang != this._globals.userInfo.userLang) {
      this.translate.use(this._globals.userInfo.userLang);
    }
    this._globals.currentTranslateService = this.translate;

    this.minDate = new Date();
    this.ChapterForm = this.formBuilder.group({
      ChapterName: ['', Validators.required],
      course: ['', Validators.required],
      isOffline: [false],
      SubChapter: this.formBuilder.array([], validateSubChap),
      SubModel: this.formBuilder.array([])
    });
    this.route.params.subscribe(params => {
      this.ChapterForm.patchValue({ course: params.id });
    });
    // this.service.getAllCourseByCompany().subscribe((data) => {
    //   if (data.success) {
    //     // console.log(data.data);
    //     this.Courses = data.data;
    //   } else {
    //     this.Courses = [];
    //   }
    // });
    this.service.getAllTrainerByCompany(this._globals.companyInfo.companyId).subscribe((data) => {
      if (data.success) {

        this.trainerList = data.data;
      } else {
        this.trainerList = [];
      }
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

  public removeModel(i) {
    this.translate.get('dialog.DeleteSubChapSure').subscribe(value => {
      if (window.confirm(value)) {
        const control = <FormArray>this.ChapterForm.controls['SubModel'];
        control.removeAt(i);
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
      'confirmationStart': [''],
      'confirmationEnd': ['']
    });
  }


  public removeChapter(i) {
    this.translate.get('dialog.DeleteSubChapterSure').subscribe(value => {
      //alert(value);
      if (window.confirm(value)) {
        const control = <FormArray>this.ChapterForm.controls['SubChapter'];
        control.removeAt(i);
      }
    });
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
      'FilePath': [null]
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
    // var bTrue = true;
    // if (bTrue) {
    //   console.log(this.ChapterForm.value);
    //   return;
    // }
    if (this.ChapterForm.value.isOffline) {
      this.ChapterForm.value.SubChapter = [];
    } else {
      this.ChapterForm.value.SubModel = [];
    }
    this.service.add(this.ChapterForm.value).subscribe((data) => {
      if (data.success) {
        // this.ChapterForm.reset();
        this.translate.get('alert.SaveChapterSuccess').subscribe(value => { alert(value); });
        // const control = <FormArray>this.ChapterForm.controls['SubChapter'];
        // for (var i = control.length - 1; i >= 0; i--) {
        //   control.removeAt(i);
        // }
        // const control1 = <FormArray>this.ChapterForm.controls['SubModel'];
        // for (var i = control1.length - 1; i >= 0; i--) {
        //   control1.removeAt(i);
        // }
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
        // TODO: Print error message to user
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
    this.modalService.open(content).result.then((result) => { }, (reason) => { });
  }
}
