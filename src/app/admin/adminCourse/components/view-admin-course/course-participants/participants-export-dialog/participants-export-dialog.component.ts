import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Globals } from 'src/app/common/auth-guard.service';
import { TableData } from '../course-participants.component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver/src/FileSaver.js'
import * as xlsx from 'xlsx'
import { DatePipe } from '@angular/common';


enum ExportFormat {
  PDF,
  XLSX,
  CSV
}

@Component({
  selector: 'app-participants-export-dialog',
  templateUrl: './participants-export-dialog.component.html',
  styleUrls: ['./participants-export-dialog.component.scss'],
})
export class ParticipantsExportDialogComponent implements OnInit {
  public ExportFormat = ExportFormat;

  private _originalData : TableData[] = [];
  private _filteredData : TableData[] = [];
  private _courseName : string = "";
  private _statuses : any[] = [];
  private _filterCriteria : any = {};

  private _exportForm : FormGroup = this._formBuilder.group({
    format : new FormControl(ExportFormat.CSV, []),
    filtered : new FormControl(false, []),
    exportEmail : new FormControl(false, []),
    exportDepartments : new FormControl(false, []),
    exportGroups : new FormControl(false, []),
    exportFinishedAt : new FormControl(false, []),
    exportFinishedAtAll : new FormControl(false, []),
  });

  constructor( private _ref: DynamicDialogRef, 
               private _config: DynamicDialogConfig,
               private _translate: TranslateService,
               private _globals : Globals,
               private _formBuilder : FormBuilder,
               private _datePipe : DatePipe
               ) {
                if (this._translate.currentLang != this._globals.userInfo.userLang) {
                  this._translate.use(this._globals.userInfo.userLang);
                }
                this._globals.currentTranslateService = this._translate;
                }

  ngOnInit(): void {
    this._originalData = this._config.data['original'];
    this._filteredData = this._config.data['filtered'];
    this._statuses = this._config.data['statuses'];
    this._filterCriteria = this._config.data['filterCriteria'];
    this._courseName = this._config.data['courseName'];

    try {
      let storedOptions = localStorage.getItem('participantTableExportOptions');
      if(storedOptions != null) {
        this.exportForm.patchValue(JSON.parse(storedOptions));
      }
    }
    catch {
      localStorage.removeItem('participantTableExportOptions');
    }
  }

  public export() {
    switch(this.format){
      case ExportFormat.CSV: this.exportCsv(); break;
      case ExportFormat.PDF: this.exportPdf(); break;
      case ExportFormat.XLSX: this.exportExcel(); break;
    }
    
    localStorage.setItem('participantTableExportOptions', JSON.stringify(this.exportForm.value));

    this._ref.close();
  }

  public exportPdf() : void {
    const doc = new jsPDF({ format : 'a3'});
    let tableData = this._getExportData();
    (doc as any).autoTable({
        head: tableData.header,
        body: tableData.data,
        theme: 'plain',
      });
    
    if(this.filtered) {
      tableData = this._getFilters();
      
      if(tableData.data.length > 0) {
        (doc as any).autoTable({
          head: tableData.header,
          body: tableData.data,
          theme: 'plain',
        });
      }
    }

    doc.save(this._courseName +'.pdf');
  }

  public exportCsv() : void {
    let tableData = this._getExportData();
    {
      let csv = tableData.data;
      csv.unshift(tableData.header.join(','));
      let csvArray = csv.join('\r\n');
      let blob = new Blob([csvArray], {type: 'text/csv' })
      saveAs(blob, this._courseName +'.csv');
    }
    
    if(this.filtered) {
      let filters = this._getFilters();
      if(filters.data.length > 0) {
        let csv = filters.data;
        csv.unshift(filters.header.join(','));
        let csvArray = csv.join('\r\n');
        let blob = new Blob([csvArray], {type: 'text/csv' })
        saveAs(blob, this._courseName +'_filters.csv');
      }
    }
  }

  public exportExcel() : void {
    let tableData = this._getExportData();
    let worksheet = xlsx.utils.aoa_to_sheet(tableData.header);
    xlsx.utils.sheet_add_aoa(worksheet, tableData.data, { origin : "A2" } );
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    if(this.filtered) {
      let filters = this._getFilters();
      if(filters.data.length > 0) {
        let worksheet = xlsx.utils.aoa_to_sheet(filters.header);
        xlsx.utils.sheet_add_aoa(worksheet, filters.data, { origin : "A2" } );
        xlsx.utils.book_append_sheet(workbook, worksheet, 'filters');
      }
    }

    const excelData: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

    let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([excelData], { type: type });
    saveAs(data, this._courseName + '.xlsx');
  }

  private _getExportData() : any {
    let seperator : string = ', ';
    if(this.format == ExportFormat.PDF) { seperator = ',\n'; }
    if(this.format == ExportFormat.CSV) { seperator = ';'; }
    let headRow : string[] = [];

    headRow.push(this._translate.instant('employees.Surname'));
    headRow.push(this._translate.instant('employees.Name'));
    headRow.push(this._translate.instant('course.Status'));
    
    if(this.exportEmail) { headRow.push(this._translate.instant('employees.Email')); }
    if(this.exportDepartments) { headRow.push(this._translate.instant('employees.Department')); }
    if(this.exportGroups) { headRow.push(this._translate.instant('course.Group')); }
    if(this.exportFinishedAt) { headRow.push(this._translate.instant('course.LastFinished')); }
    if(this.exportFinishedAtAll) { headRow.push(this._translate.instant('exports.FinishedAtAll')); }

    let header = [headRow];

    let data = [];
    let source : TableData[] = this.filtered ? this._filteredData : this._originalData;
    source.forEach(d => {
      let currentData : any[] = [
        d.lastName, 
        d.firstName,   
        this._statuses.find(s => s.value == d.courseStatus).label
      ];

      if(this.exportEmail) { currentData.push(d.email); }
      if(this.exportDepartments) { currentData.push(d.departments.map(d => d.name).join(seperator)); }
      if(this.exportGroups) { currentData.push(d.groups.map(g => g.name).join(seperator)); }
      if(this.exportFinishedAt) { currentData.push(d.finishInfo.length > 0 ? this._datePipe.transform(d.finishInfo[0], 'dd.MM.yyyy') : '-'); }
      if(this.exportFinishedAtAll) { currentData.push(d.finishInfo.length > 0 ? d.finishInfo.map(x => this._datePipe.transform(x, 'dd.MM.yyyy')).join(seperator) : '-'); }

      data.push(currentData)
    });

    return { header, data };
  }

  private _getFilters() : any {
    let seperator : string = ', ';
    if(this.format == ExportFormat.PDF) { seperator = ',\n'; }
    if(this.format == ExportFormat.CSV) { seperator = ';'; }

    let header = [[
      this._translate.instant('exports.FieldName'),
      this._translate.instant('exports.FilterValue'), 
    ]];
    
    let data = [];
      
    Object.keys(this._filterCriteria).forEach(f => {
      let filter : any = this._filterCriteria[f];
      if(filter[0].value != null) {
        let columnName : string = f;
        let value : string = filter[0].value;
        switch(f) {
          case 'fullName': columnName = this._translate.instant('employees.Surname'); break;
          case 'email': columnName = this._translate.instant('employees.Email'); break;
          case 'departments': {
            columnName = this._translate.instant('employees.Department'); 
            value = filter[0].value.map( v => v.name).join(seperator);
            break;
          }
          case 'groups': {
            columnName = this._translate.instant('course.Group'); 
            value = filter[0].value.map( v => v.name).join(seperator);
            break;
          }
          case 'finished': { 
            columnName = this._translate.instant('course.LastFinished');
            value = filter[0].matchMode + ' ' + this._datePipe.transform(filter[0].value, 'dd.MM.yyyy');
            break;
          };
          case 'courseStatus': { 
            columnName = this._translate.instant('course.Status'); 
            value = this._statuses.find(s => s.value == value ).label
          } break;
        }

        data.push([
          columnName,
          value
        ]);
      }
    });

    return { header, data };
  }


  get exportForm() : FormGroup { return this._exportForm; }
  get format() : ExportFormat { return this._exportForm.get('format').value; }
  get filtered() : boolean { return this._exportForm.get('filtered').value; }
  get exportEmail() : boolean { return this._exportForm.get('exportEmail').value; }
  get exportDepartments() : boolean { return this._exportForm.get('exportDepartments').value; }
  get exportGroups() : boolean { return this._exportForm.get('exportGroups').value; }
  get exportFinishedAt() : boolean { return this._exportForm.get('exportFinishedAt').value; }
  get exportFinishedAtAll() : boolean { return this._exportForm.get('exportFinishedAtAll').value; }
}
