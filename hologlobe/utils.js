'use strict';

function cortesianToSphere(x, y, z) {
  const radius = Math.sqrt(x*x + y*y + z*z); 
  return {
    r: radius,
    t: Math.acos(z/radius),
    p: Math.atan(y/x),
  };
}

function sphereToCortesian(r, t, p) {
  return {
    x: r * Math.sin(t) * Math.cos(p),
    y: r * Math.sin(t) * Math.sin(p),
    z: r * Math.cos(t),
  };
}
