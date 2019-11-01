import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';

@Directive({
  selector: '[libNgIntersection]'
})
export class NgIntersectionDirective implements AfterViewInit, OnDestroy {
  @Input() public intersectionObserverInit: IntersectionObserverInit;
  @Input() public waitBeforeReportingIntersection?: number;
  @Output() public intersectionChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isIntersecting: boolean;
  private observer: IntersectionObserver;
  private timeoutDataName: string = 'timeout';
  private dataPrefix: string = 'ng-intersection-';

  constructor(private el: ElementRef) {

  }

  public ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      this.intersectionObserverInit
    );
    this.observer.observe(this.el.nativeElement);
  }

  public ngOnDestroy(): void {
    if (this.observer) {
      this.observer.unobserve(this.el.nativeElement);
    }
  }

  public intersectionObserverCallback(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (this.isIntersecting === entry.isIntersecting) {
        return;
      }
      this.isIntersecting = entry.isIntersecting;
      //If not in viewport send the event immediately.
      if (!this.isIntersecting || !this.waitBeforeReportingIntersection) {
        this.intersectionChanged.emit(this.isIntersecting);
      }
      if (this.waitBeforeReportingIntersection) {
        //If in viewport wait for the amount of time if specified before sending event
        if (entry.isIntersecting) {
          this.delayedEvent(this.el.nativeElement, this.waitBeforeReportingIntersection);
        } else {
          this.cancelDelayedEvent(this.el.nativeElement);
        }
      }
    });
  }

  private delayedEvent(element: HTMLElement, delayTime: number): void {
    let timeoutId = this.getTimeoutData(element);
    if (timeoutId) {
      return; // timeout was already set, do nothing
    }
    // @ts-ignore
    timeoutId = setTimeout(() => {
      this.intersectionChanged.emit(this.isIntersecting);
      this.cancelDelayedEvent(element);
    }, delayTime);
    this.setTimeoutData(element, timeoutId);
    this.deleteTimeoutData(element);
  }

  private deleteTimeoutData(element: HTMLElement): void {
    element.removeAttribute(this.dataPrefix + this.timeoutDataName);
  }

  private cancelDelayedEvent(element: HTMLElement): void {
    const timeoutId = this.getTimeoutData(element);
    if (!timeoutId) {
      return; // do nothing if timeout doesn't exist
    }
    // @ts-ignore
    clearTimeout(timeoutId);
  }

  private setTimeoutData(element: HTMLElement, value: number | null): void {
    this.setAttributeData(element, this.timeoutDataName, value);
  }

  private getTimeoutData(element: HTMLElement): number | null {
    return this.getAttributeData(element, this.timeoutDataName);
  }

  private getAttributeData(element: HTMLElement, attribute: string): number | null {
    const result = element.getAttribute(this.dataPrefix + attribute);
    if (!result) {
      return null;
    }
    return parseInt(result);
  }

  private setAttributeData(element: HTMLElement, attribute: string, value: number | null): void {
    const attrName = this.dataPrefix + attribute;
    if (value === null) {
      element.removeAttribute(attrName);
      return;
    }
    element.setAttribute(attrName, value.toString());
  }
}
