# Ng Intersection
Angular library that wraps the browser IntersectionObserver in an Angular directive.

The library allows for getting a callback whenever the target element enters/exits the ancestor/viewport depending on the options.

Allows for browser based in viewport detection instead of old style Element.getBoundClientRect().

Useful for many different scenarios such as:

* Lazy-loading of images or other content as a page is scrolled.
* Implementing "infinite scrolling" web sites.
* Deciding whether or not to perform tasks or animation processes based on whether or not the user will see the result.

The library has no external dependencies. 

# Installation
Install using npm or yarn.

`npm i ng-intersection`

# Usage
Add the Angular directive to the element you want to get notified about.

`<div libNgIntersection (intersectionChanged)="intersectionChanged($event)" [intersectionObserverInit]="options" [waitBeforeReportingIntersection]="700"></div>`

_intersectionChanged_ will be triggered when the element enters/exits the ancestor/viewport.

_waitBeforeReportingIntersection_ is an optional parameter that allows for only getting visible events if the element remains in the viewport for x amount of time. Useful for only loading/rendering elements if the user waits x amount of ms before scrolling past it.

_intersectionObserverInit_ allows for specifying what options should be used for the IntersectionObserver. If no options are specified it will use the viewport by default for intersection detection.

Targeting a specific element with IntersectionObserver options:
 `const options = {
    root: xyzHtmlElement,
    rootMargin: '0px',
    threshold: 1.0
  }`
  
See: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver for docs on the options.
  
# Browser compatibility
See: https://caniuse.com/#feat=intersectionobserver
