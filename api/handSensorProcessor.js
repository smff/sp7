'use strict';

let moves = {
  '000': 'left1',
  '001': 'left2',
  '011': 'left3',
  '111': 'left4',
  '110': 'left5',
  '100': 'left6',
  '101': 'left7',
};
let currentAction = 'left';

module.exports = (params) => {
  let action = '';

  for (let key in params) {
    action += params[key];
  }

  currentAction = moves[action];

  return currentAction;
};