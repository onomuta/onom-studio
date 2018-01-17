Math.cubic = function(t, b, c, d){
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t-2) - 1) + b;
}

Math.degrees = function(radian){
  if(isNaN(radian)){
     return NaN;
  }
  return radian * 360/(2*Math.PI);
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
