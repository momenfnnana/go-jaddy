import React from 'react';

function shallowEqual(objA: any, objB: any) {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A[key] === B[key]
  return keysA.every(key => {
    return objA[key] === objB[key];
  });
}
