import { Directive, HostListener, ElementRef, Input, OnInit, AfterViewInit, AfterViewChecked, Output, EventEmitter, OnChanges } from '@angular/core';

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit, AfterViewChecked, OnChanges {
  @Input() appResize: string;
  @Input() public input: any;

  @Output() updateWidth: EventEmitter<number> = new EventEmitter();
  // @HostListener('mouseenter') onMouseEnter() {
  //   this.getWidth();
  //   // this.highlight(this.highlightColor || this.defaultColor || 'red');
  // }
  // @HostListener('resize') onResize() {
  //   console.log('RES');
  //   // this.highlight(this.highlightColor || this.defaultColor || 'red');
  // }

  constructor(private el: ElementRef) {
    console.log('I EXIISST!!!');
    // setInterval(() => {
    // console.log(el.nativeElement);
    // this.getWidth();
    // console.log('I EXIISST');
    // }
    // , 100);
    // el.nativeElement.style.backgroundColor = 'yellow';
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.input) {
      console.log('input changed');
    }
    // this.el.nativeElement.style.width = changes.currentValue;
  }

  ngOnInit() {
    // this.getWidth();
  }

  ngAfterViewChecked() {
    // console.log('afvi: ', this.el.nativeElement.offsetWidth, this.index);
    // this.updateWidth.emit(this.el.nativeElement.offsetWidth);
  }

  private getWidth() {
    console.log('mouse enelakjwer: ', this.el.nativeElement.offsetWidth);
  }
}
