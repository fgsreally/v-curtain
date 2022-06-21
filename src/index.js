import { Curtains, Plane } from "curtainsjs";
let curtains;
export default (onError) => {
  return {
    install(app) {
      app.directive("curtains", {
        mounted(el, binding) {
          if (!curtains) {
            curtains = new Curtains({
              container: "canvas",
              alpha: true,
              pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
            });
            curtains
              .onError(function (e) {
                onError && onError();
              })
              .onContextLost(() => {
                curtains.restoreContext();
              });
            app.provide("curtains", curtains);
          }
          const state = {};
          const planeElement = el;
          const params = {
            //     vertexShader: vs,
            //     fragmentShader: fs,
            uniforms: {
              transitionTimer: {
                name: "uTransitionTimer",
                type: "1f",
                value: 0,
              },
              fadeIn: {
                name: "uFadeIn",
                type: "1f",
                value: 0,
              },
              timer: {
                name: "uTimer",
                type: "1f",
                value: 0,
              },
              to: {
                name: "uTo",
                type: "1f",
                value: 0,
              },
              from: {
                name: "uFrom",
                type: "1f",
                value: 0,
              },
            },
            ...binding.value,
          };
          const multiTexturesPlane = new Plane(curtains, planeElement, params);
          multiTexturesPlane
            .onLoading((texture) => {
              binding.value.onLoad && binding.value.onLoad(texture);
            })
            .onReady(() => {
              // display the button
              binding.value.onReady &&
                binding.value.onReady(multiTexturesPlane, curtains, state);
            })
            .onRender(() => {
              binding.value.onRender &&
                binding.value.onRender(multiTexturesPlane, curtains, state);
            })
            .onAfterResize(() => {
              binding.value.onAfterResize &&
                binding.value.onAfterResize(
                  multiTexturesPlane,
                  curtains,
                  state
                );
            })
            .onReEnterView(() => {
              binding.value.onReEnterView &&
                binding.value.onReEnterView(
                  multiTexturesPlane,
                  curtains,
                  state
                );
            })
            .onLeaveView(() => {
              binding.value.onLeaveView &&
                binding.value.onLeaveView(multiTexturesPlane, curtains, state);
            });
        },
      });
    },
  };
};
