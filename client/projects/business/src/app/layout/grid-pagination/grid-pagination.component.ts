import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface page {
  pageNumber: number,
  pageSize: number,
  firstPage: number,
  lastPage: number,
  totalPages: number,
  totalRecords: number,
  nextPage: number,
  previousPage: number,
  currentRecords: number,
  recordStart: number,
  recordEnd: number,
}

@Component({
  selector: 'app-grid-pagination',
  templateUrl: './grid-pagination.component.html',
  styleUrls: ['./grid-pagination.component.css']
})
export class GridPaginationComponent implements OnInit {

  constructor() { }

  @Input() page: page;
  @Output() pageChangeEvent = new EventEmitter<any>();

  ngOnInit() { }

  pageChange(number?: number, size?: number) {
    this.pageChangeEvent.emit({ number: number, size: size });
  }
}
