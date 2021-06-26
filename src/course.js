import { gsap } from 'gsap';

const duration = (speed, amount) => speed * Math.abs(amount);
const cloudOneTL = gsap.timeline({ repeat: -1 });
const cloudTwoTL = gsap.timeline({ repeat: -1 });
const cloudThreeTL = gsap.timeline({ repeat: -1 });
const cloudFourTL = gsap.timeline({ repeat: -1 });
const headTL = gsap.timeline({ repeat: -1 });
const leftFeetTL = gsap.timeline({ repeat: -1, yoyo: true });
const rightFeetTL = gsap.timeline({ repeat: -1, yoyo: true });

cloudOneTL.to('.cloud-1', {
  x: -250,
  duration: duration(0.2, 250),
  ease: 'none'
}).to('.cloud-1', {
  x: 1100,
  duration: 0
})
  .to('.cloud-1', {
    x: 0,
    duration: duration(0.2, 1100),
    ease: 'none'
  });

cloudTwoTL.to('.cloud-4', {
  x: 250,
  duration: duration(0.15, 250),
  ease: 'none'
}).to('.cloud-4', {
  x: -1100,
  duration: 0
})
  .to('.cloud-4', {
    x: 0,
    duration: duration(0.15, 1100),
    ease: 'none'
  });

cloudThreeTL.to('.cloud-3', {
  x: -830,
  duration: duration(0.05, 830),
  ease: 'none'
}).to('.cloud-3', {
  x: 450,
  duration: 0
})
  .to('.cloud-3', {
    x: 0,
    duration: duration(0.05, 450),
    ease: 'none'
  });

cloudFourTL.to('.cloud-2', {
  x: 1050,
  duration: duration(0.09, 1050),
  ease: 'none'
}).to('.cloud-2', {
  x: -400,
  duration: 0
})
  .to('.cloud-2', {
    x: 0,
    duration: duration(0.09, 400),
    ease: 'none'
  });

headTL.to('.head', {
  rotate: -9,
  duration: 2,
  delay: 3,
  transformOrigin: 'center center'
}).to('.head', {
  rotate: 0,
  duration: 2,
  delay: 7,
  transformOrigin: 'center center'
}).to('.head', {
  rotate: 9,
  duration: 2,
  delay: 9,
  transformOrigin: 'center center'
}).to('.head', {
  rotate: 0,
  duration: 2,
  delay: 6,
  transformOrigin: 'center center'
});

leftFeetTL.to('.left-foot', {
  rotate: 10,
  duration: 1,
  transformOrigin: 'top right',
  delay: 6
});

rightFeetTL.to('.right-foot', {
  rotate: -10,
  duration: 1,
  transformOrigin: 'top left',
  delay: 6
});
