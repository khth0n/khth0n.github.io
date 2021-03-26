"use strict";
class Slideshow {
    constructor(element) {
        this.slides = element.getElementsByClassName('slide');
        this.previousIndex = this.slides.length - 1;
        if (this.previousIndex <= 0) {
            this.currentIndex = -1;
            this.isAutoplay = false;
            return;
        }
        this.currentIndex = 0;
        this.isAutoplay = true;
        let i;
        for (i = 0; i < this.slides.length; i++) {
            const slide = this.slides[i];
            slide.style.display = 'none';
        }
        element.addEventListener('mouseenter', () => {
            this.isAutoplay = false;
        });
        element.addEventListener('mouseleave', () => {
            this.isAutoplay = true;
        });
        element.addEventListener('focusin', () => {
            this.isAutoplay = false;
        });
        element.addEventListener('focusout', () => {
            this.isAutoplay = true;
        });
        this.showSlide();
        setInterval(() => { if (this.isAutoplay)
            this.nextSlide(); }, 4000);
    }
    nextSlide() {
        this.previousIndex = this.currentIndex;
        if (++this.currentIndex === this.slides.length) {
            this.currentIndex = 0;
        }
        this.showSlide();
    }
    prevSlide() {
        this.previousIndex = this.currentIndex;
        if (--this.currentIndex < 0) {
            this.currentIndex = this.slides.length - 1;
        }
        this.showSlide();
    }
    showSlide() {
        if (this.currentIndex < 0)
            return;
        this.slides[this.previousIndex].style.display = 'none';
        this.slides[this.currentIndex].style.display = 'grid';
    }
}
function createSlideshowMap() {
    var slideshowsElements = document.getElementsByClassName('slideshow');
    let map = new Map();
    console.log(map);
    let i;
    for (i = 0; i < slideshowsElements.length; i++) {
        const slideshowElement = slideshowsElements[i];
        map.set(slideshowElement.id, new Slideshow(slideshowElement));
    }
    console.log(map);
    return map;
}
var slideshowMap = createSlideshowMap();
