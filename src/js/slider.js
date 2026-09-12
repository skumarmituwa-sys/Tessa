/**
 * Resisting Volume Slider Component
 * Prevents direct manual dragging and provides spring recoil + funny resistance reactions!
 */

export class ResistingSlider {
  constructor(trackId, thumbId, fillId, displayId, onDragAttempt) {
    this.track = document.getElementById(trackId);
    this.thumb = document.getElementById(thumbId);
    this.fill = document.getElementById(fillId);
    this.display = document.getElementById(displayId);
    this.onDragAttempt = onDragAttempt;

    this.currentVolume = 30; // 0 - 100
    this.targetVolume = 30;
    this.dragAttempts = 0;
    this.isEvading = false;

    this.init();
  }

  init() {
    if (!this.track || !this.thumb) return;

    this.bindEvents();
    this.updateVisuals(30, false);
  }

  bindEvents() {
    // 1. Block mousedown / drag on thumb
    this.thumb.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.handleForbiddenInteraction("thumb_click");
    });

    this.thumb.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.handleForbiddenInteraction("thumb_touch");
    });

    // 2. Block click on track
    this.track.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleForbiddenInteraction("track_click");
    });

    // 3. Evasion effect when cursor gets too close to thumb!
    this.track.addEventListener("mousemove", (e) => {
      const thumbRect = this.thumb.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (thumbRect.left + thumbRect.width / 2), e.clientY - (thumbRect.top + thumbRect.height / 2));

      if (dist < 40 && !this.isEvading) {
        this.triggerEvasion();
      }
    });
  }

  handleForbiddenInteraction(type) {
    this.dragAttempts++;
    
    // Trigger visual recoil animation
    this.thumb.classList.add("recoil-animation");
    this.track.classList.add("shake-red-animation");

    setTimeout(() => {
      this.thumb.classList.remove("recoil-animation");
      this.track.classList.remove("shake-red-animation");
    }, 400);

    if (typeof this.onDragAttempt === "function") {
      this.onDragAttempt(this.dragAttempts, type);
    }
  }

  triggerEvasion() {
    this.isEvading = true;
    const offset = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20);
    this.thumb.style.transform = `scale(1.25) translateX(${offset}px)`;

    setTimeout(() => {
      this.thumb.style.transform = `scale(1) translateX(0px)`;
      this.isEvading = false;
    }, 350);
  }

  setVolume(newVolume, animated = true) {
    this.targetVolume = Math.max(0, Math.min(100, Math.round(newVolume)));
    this.currentVolume = this.targetVolume;
    this.updateVisuals(this.currentVolume, animated);
  }

  updateVisuals(volume, animated = true) {
    if (this.fill) {
      this.fill.style.transition = animated ? "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none";
      this.fill.style.width = `${volume}%`;
    }

    if (this.thumb) {
      this.thumb.style.transition = animated ? "left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none";
      this.thumb.style.left = `${volume}%`;
    }

    if (this.display) {
      this.display.innerText = `${volume}%`;
      // Update color class based on volume
      if (volume <= 0) this.display.className = "volume-badge vol-muted";
      else if (volume <= 30) this.display.className = "volume-badge vol-low";
      else if (volume <= 70) this.display.className = "volume-badge vol-mid";
      else this.display.className = "volume-badge vol-high";
    }
  }
}
