const readlineSync = require('readline-sync');

const getInput = prompt => readlineSync.question(`${prompt}: `);

const die = sides => Math.floor(Math.random() * sides) + 1;

const roll = (n) => {
  const nDiceRoll = Array.from({ length: n }, () => die(6));
  return nDiceRoll;
};

const total = dice => dice.reduce((a, b) => a + b);

const game = (aPlayer, comeOut, point, bet) => ({ aPlayer, comeOut, point, bet });

const player = (name, bankroll) => ({ name, bankroll: [bankroll] });

const winLose = (aPlayer, amt) => aPlayer.bankroll.push(amt);

const totalBankroll = (aPlayer, bet = 0) => aPlayer.bankroll.reduce((a, b) => a + b) - bet;

const checkComeOut = (aRoll, aPlayer, bet) => {
  let comeOutFlag = null;
  let newPoint = null;
  const betAmt = bet;
  switch (total(aRoll)) {
    case 7:
    case 11:
      console.log('Pay the line!\n');
      winLose(aPlayer, bet);
      comeOutFlag = true;
      break;
    case 2:
    case 3:
    case 12:
      console.log('Craps!\n');
      winLose(aPlayer, (-1 * bet));
      comeOutFlag = true;
      break;
    default:
      newPoint = total(aRoll);
      comeOutFlag = false;
      break;
  }
  return { comeOutFlag, newPoint, aPlayer, betAmt };
};

const msg = (aGame, aRoll, aBet) => {
  let res = aBet;
  if (!aGame.newPoint) res = 0;
  console.log(`${aGame.aPlayer.name}, you have rolled ${aRoll} and wagered ${aBet}
your point is ${aGame.newPoint || 'Off'} and your bankroll is ${totalBankroll(aGame.aPlayer, res)}\n`);
};

const comeOutRoll = (aGame) => {
  const newRoll = roll(2);
  const res = checkComeOut(newRoll, aGame.aPlayer, aGame.bet);
  msg(res, newRoll, res.betAmt);
  return game(aGame.aPlayer, res.comeOutFlag, res.newPoint, aGame.bet);
};

const checkPoint = (aGame, aRoll) => {
  const myGame = aGame;
  const rollTotal = total(aRoll);
  switch (rollTotal) {
    case myGame.point:
      winLose(myGame.aPlayer, myGame.bet);
      console.log(`you rolled ${aRoll}! Winner winner chicken dinner! your bankroll is ${totalBankroll(myGame.aPlayer)}\n`);
      myGame.comeOut = true;
      break;
    case 7:
      winLose(myGame.aPlayer, (-1 * myGame.bet));
      console.log(`you rolled ${aRoll} Seven out! your bankroll is ${totalBankroll(myGame.aPlayer)}\n`);
      myGame.comeOut = true;
      break;
    default:
      console.log(`${myGame.aPlayer.name}, you have rolled ${aRoll} your point is ${myGame.point}\n`);
  }
  return myGame;
};

const pointRoll = (aGame) => {
  const newRoll = roll(2);
  const res = checkPoint(aGame, newRoll);
  return game(res.aPlayer, res.comeOut, res.point, res.bet);
};

const jon = player('jon', 100);
const newGame = game(jon, true, true, 5);

const playGame = (aGame) => {
  let myGame = aGame;
  let rollAgain = true;
  while (rollAgain) {
    if (myGame.comeOut) {
      myGame = comeOutRoll(myGame);
    } else {
      myGame = pointRoll(myGame);
    }
    if (getInput('Roll again? [Y/N]') !== 'Y') rollAgain = false;
  }
};

playGame(newGame);
