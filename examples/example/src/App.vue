<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import gsap from "gsap";
import fs from "./shader/frag/1.js";
import vs from "./shader/vert/1.js";
import video1 from "./assets/1.mp4";
import video2 from "./assets/2.mp4";
import video3 from "./assets/3.mp4";

let activeTexture = 0;
let currentTexture = 0;
let transitionTimer = 0;
let timer = 0;
let isRunning = 0;

const params = {
  vertexShader: vs,
  fragmentShader: fs,
  onRender: (multiTexturesPlane) => {
    timer += 0.001;
    multiTexturesPlane.uniforms.timer.value = timer;
  },
  onReady: (multiTexturesPlane, curtains) => {
    document.body.classList.add("curtains-ready");
    const navElements = [...document.getElementsByClassName("js-nav")];

    let length = multiTexturesPlane.videos.length;
    navElements.forEach((nav) => {
      nav.addEventListener("click", (event) => {
        let to = event.target.getAttribute("data-nav");
        if (isRunning || to == currentTexture) return;
        isRunning = true;

        multiTexturesPlane.uniforms.to.value = to;

        let fake = { progress: 0 };
        gsap.to(fake, {
          duration: 2,
          progress: 1,
          easing: "power2.in",
          onStart: () => {
            multiTexturesPlane.videos[to].play();
            currentTexture = to;
          },
          onUpdate: () => {
            if (fake.progress === 1) {
              multiTexturesPlane.uniforms.from.value = to;
            }
            multiTexturesPlane.uniforms.transitionTimer.value = fake.progress;
          },
          onComplete: () => {
            multiTexturesPlane.uniforms.from.value = to;
            multiTexturesPlane.videos[
              (currentTexture + length - 1) % length
            ].pause();
            multiTexturesPlane.videos[
              (currentTexture + length + 1) % length
            ].pause();
            isRunning = false;
          },
        });
      });

      // click to play the videos
      document.getElementById("intro").addEventListener(
        "click",
        () => {
          // fade out animation
          // gsap.to('#intro',{duration:0.1,autoAlpha:0.})
          document.body.classList.add("video-started");

          gsap.to(multiTexturesPlane.uniforms.fadeIn, {
            duration: 1,
            value: 1,
          });

          // play all videos to force uploading the first frame of each texture
          multiTexturesPlane.playVideos();

          // wait a tick and pause the rest of videos (the ones that are hidden)
          curtains.nextRender(() => {
            multiTexturesPlane.videos[1].pause();
            multiTexturesPlane.videos[2].pause();
          });
        },
        false
      );
    });
  },
};
</script>

<template>
  <main>
    <div class="frame">
      <button class="frame__button" id="intro">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          width="60"
          height="60"
        >
          <path
            d="M45.563 29.174l-22-15A1 1 0 0022 15v30a.999.999 0 001.563.826l22-15a1 1 0 000-1.652zM24 43.107V16.893L43.225 30 24 43.107z"
          />
          <path
            d="M30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z"
          />
        </svg>
      </button>
      <div class="frame__content">
        <h2 class="frame__content-title">v-curtain</h2>
        <p style="color:white;font-size:30px">vue directive for curtainsjs</p>
        <p class="frame__content-text">Select another video here:</p>

        <nav class="frame__switch" id="nav">
          <a class="frame__switch-item js-nav" data-nav="0">Wake up</a>
          <a class="frame__switch-item js-nav" data-nav="1">Rejoice</a>
          <a class="frame__switch-item js-nav" data-nav="2">Breathe</a>
        </nav>
      </div>
    </div>
    <div class="video">
      <div class="wrapper">
        <div class="plane" data-duration="2.5" v-curtains="params">
          <video
            playsinline
            muted
            :src="video1"
            data-sampler="firstTexture"
            preload="auto"
          ></video>
          <video
            playsinline
            muted
            :src="video2"
            data-sampler="secondTexture"
          ></video>
          <video
            playsinline
            muted
            :src="video3"
            data-sampler="thirdTexture"
          ></video>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
