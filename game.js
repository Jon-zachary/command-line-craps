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

const totalBankroll = (aPlayer, bet) => aPlayer.bankroll.reduce((a, b) => a + b);

const checkComeOut = (aRoll, aPlayer, bet) => {
  let comeOutFlag = null;
  let newPoint = null;
  let betAmt = bet;
  switch (total(aRoll)) {
    case 7:
    case 11:
      console.log('Pay the line!\n');
      winLose(aPlayer, bet);
      comeOutFlag = true;
      betAmt = 0;
      break;
    case 2:
    case 3:
    case 12:
      console.log('Craps!\n');
      winLose(aPlayer, (-1 * bet));
      comeOutFlag = true;
      betAmt = 0;
      break;
    default:
      newPoint = total(aRoll);
      comeOutFlag = false;
      break;
  }
  return { comeOutFlag, newPoint, aPlayer, betAmt };
};

const msg = (aGame, aRoll, aBet) => {
  const bnk = 
  console.log(`${aGame.aPlayer.name}, you have rolled ${aRoll} and wagered ${aBet}
your point is ${aGame.newPoint || 'Off'} and your bankroll is ${totalBankroll(aGame.aPlayer, aBet)}\n`);
};

const comeOutRoll = (aGame) => {
  const newRoll = roll(2);
  const res = checkComeOut(newRoll, aGame.aPlayer, aGame.bet);
  msg(res, newRoll, aGame.bet);
  return game(aGame.aPlayer, res.comeOutFlag, res.newPoint, aGame.bet);
};

const pointRoll = (aGame) => {
  const newRoll = roll(2);
  let comeOutFlag = false;
  if (total(newRoll) === aGame.point) {
    winLose(aGame.aPlayer, aGame.bet);
    console.log(`you rolled ${newRoll}! Winner winner chicken dinner! your bankroll is ${totalBankroll(aGame.aPlayer, aGame.bet)}\n`);
    comeOutFlag = true;
  } else if (total(newRoll) === 7) {
    winLose(aGame.aPlayer, (-1 * aGame.bet));
    console.log(`you rolled ${newRoll} Seven out! your bankroll is ${totalBankroll(aGame.aPlayer, 0)}\n`);
    comeOutFlag = true;
  } else {
    console.log(`${aGame.aPlayer.name}, you have rolled ${newRoll} your point is ${aGame.point}\n`);
  }
  return game(aGame.aPlayer, comeOutFlag, aGame.point, aGame.bet);
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
