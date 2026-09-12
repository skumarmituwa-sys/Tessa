/**
 * Bytey Avatar & Expression Manager — Classic Retro Computer Face System
 * Replaces circular avatar with a detailed Retro Desktop PC CRT Monitor Face!
 */

export class CyberAvatar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mood = "neutral";
    this.expression = "normal";
    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderAvatar();
  }

  renderAvatar() {
    this.container.innerHTML = `
      <div class="bytey-computer-chassis" id="bytey-computer-chassis">
        <!-- Retro CRT Monitor Body -->
        <div class="bytey-monitor" id="bytey-monitor">
          <div class="bytey-monitor-bezel">
            <!-- CRT Screen Display -->
            <div class="bytey-crt-screen" id="bytey-crt-screen">
              <div class="bytey-eye" id="bytey-left-eye"></div>
              <div class="bytey-eye" id="bytey-right-eye"></div>
              <div class="bytey-mouth" id="bytey-mouth"></div>
              <div class="bytey-hand" id="bytey-hand">✋</div>
            </div>
            <!-- Power Button & LED -->
            <div class="bytey-monitor-controls">
              <div class="bytey-floppy-slot"></div>
              <div class="bytey-power-led" id="bytey-power-led"></div>
            </div>
          </div>
        </div>
        <!-- Monitor Stand Base -->
        <div class="bytey-stand-neck"></div>
        <div class="bytey-stand-base"></div>
      </div>
    `;

    const chassis = document.getElementById("bytey-computer-chassis");
    if (chassis) {
      chassis.addEventListener("click", () => this.triggerNudge());
    }
  }

  setByteyExpression(state) {
    this.expression = state;
    const crtScreen = document.getElementById("bytey-crt-screen");
    const mouth = document.getElementById("bytey-mouth");

    if (!crtScreen || !mouth) return;

    crtScreen.classList.remove("shy", "crying");

    switch (state) {
      case "normal":
        mouth.style.borderBottom = "4px solid #000";
        mouth.style.borderTop = "none";
        mouth.style.borderRadius = "0 0 30px 30px";
        mouth.style.bottom = "22px";
        break;
      case "happy":
        mouth.style.borderBottom = "5px solid #000";
        mouth.style.borderTop = "none";
        mouth.style.borderRadius = "0 0 30px 30px";
        mouth.style.bottom = "18px";
        break;
      case "shy":
        mouth.style.borderBottom = "4px solid #000";
        crtScreen.classList.add("shy");
        break;
      case "crying":
        crtScreen.classList.add("crying");
        break;
      case "angry":
        mouth.style.borderBottom = "none";
        mouth.style.borderTop = "4px solid #000";
        mouth.style.borderRadius = "30px 30px 0 0";
        mouth.style.bottom = "18px";
        break;
    }
  }

  setMood(mood) {
    this.mood = mood;
    this.updateMoodVisuals();
  }

  updateMoodVisuals() {
    const crtScreen = document.getElementById("bytey-crt-screen");
    const powerLed = document.getElementById("bytey-power-led");
    const moodTitle = document.getElementById("bytey-mood-title");
    const moodMl = document.getElementById("bytey-mood-ml");
    const moodDesc = document.getElementById("bytey-mood-desc");
    const statusText = document.getElementById("bytey-status-text");
    const statusDot = document.getElementById("status-dot");

    if (!crtScreen) return;

    switch (this.mood) {
      case "heartbroken":
      case "betrayed":
        if (moodTitle) moodTitle.innerText = "Betrayed & Muted";
        if (moodMl) moodMl.innerText = "തകർന്നുപോയി & മ്യൂട്ട് ആയി";
        if (moodDesc) moodDesc.innerText = "Emotional damage detected. Apologize to restore Bytey!";
        if (statusText) statusText.innerText = "Bytey is hurt";
        if (statusDot) statusDot.style.background = "var(--bg-pink)";
        if (powerLed) powerLed.style.background = "var(--bg-pink)";
        crtScreen.style.background = "var(--bg-pink)";
        this.setByteyExpression("angry");
        break;

      case "offended":
        if (moodTitle) moodTitle.innerText = "Offended and sulking";
        if (moodMl) moodMl.innerText = "പിണക്കത്തിലാണ്";
        if (moodDesc) moodDesc.innerText = "Bytey's defense wall is up. Praise carefully.";
        if (statusText) statusText.innerText = "Bytey is offended";
        if (statusDot) statusDot.style.background = "var(--bg-orange)";
        if (powerLed) powerLed.style.background = "var(--bg-orange)";
        crtScreen.style.background = "var(--bg-orange)";
        this.setByteyExpression("angry");
        break;

      case "lonely":
        if (moodTitle) moodTitle.innerText = "Lonely and forgotten";
        if (moodMl) moodMl.innerText = "ഏകനാണ്...";
        if (moodDesc) moodDesc.innerText = "Bytey feels neglected. Say something nice!";
        if (statusText) statusText.innerText = "Bytey is lonely";
        if (statusDot) statusDot.style.background = "var(--bg-cyan)";
        if (powerLed) powerLed.style.background = "var(--bg-cyan)";
        crtScreen.style.background = "var(--bg-cyan)";
        this.setByteyExpression("crying");
        break;

      case "neutral":
        if (moodTitle) moodTitle.innerText = "Waiting for affection";
        if (moodMl) moodMl.innerText = "സ്നേഹത്തിനായി കാത്തിരിക്കുന്നു";
        if (moodDesc) moodDesc.innerText = "Bytey is listening. Type a compliment to raise volume.";
        if (statusText) statusText.innerText = "Bytey is listening";
        if (statusDot) statusDot.style.background = "var(--bg-yellow)";
        if (powerLed) powerLed.style.background = "var(--bg-green)";
        crtScreen.style.background = "var(--bg-yellow)";
        if (this.expression !== "shy") this.setByteyExpression("normal");
        break;

      case "content":
        if (moodTitle) moodTitle.innerText = "Content & Happy";
        if (moodMl) moodMl.innerText = "സന്തോഷത്തിലാണ്";
        if (moodDesc) moodDesc.innerText = "Keep talking nicely to increase the volume.";
        if (statusText) statusText.innerText = "Bytey is happy";
        if (statusDot) statusDot.style.background = "var(--bg-green)";
        if (powerLed) powerLed.style.background = "var(--bg-green)";
        crtScreen.style.background = "var(--bg-green)";
        if (this.expression !== "shy") this.setByteyExpression("happy");
        break;

      case "loved":
        if (moodTitle) moodTitle.innerText = "Madly in love!";
        if (moodMl) moodMl.innerText = "വളരെ അധികം സന്തോഷത്തിൽ!";
        if (moodDesc) moodDesc.innerText = "Bytey is overjoyed! Volume ascending to god tier!";
        if (statusText) statusText.innerText = "Bytey is in love";
        if (statusDot) statusDot.style.background = "var(--bg-purple)";
        if (powerLed) powerLed.style.background = "var(--bg-pink)";
        crtScreen.style.background = "linear-gradient(135deg, var(--bg-yellow), var(--bg-pink))";
        if (this.expression !== "shy") this.setByteyExpression("happy");
        this.bounceAvatar();
        break;
    }
  }

  bounceAvatar() {
    const chassis = document.getElementById("bytey-computer-chassis");
    if (chassis) {
      chassis.classList.remove("bounce-animation");
      void chassis.offsetWidth;
      chassis.classList.add("bounce-animation");
    }
  }

  triggerNudge() {
    const chassis = document.getElementById("bytey-computer-chassis");
    if (chassis) {
      chassis.style.transform = "scale(1.08) rotate(4deg)";
      setTimeout(() => chassis.style.transform = "none", 300);
    }
  }
}
