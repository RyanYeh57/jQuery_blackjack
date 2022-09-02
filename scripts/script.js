let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;
let inGame = false;//旗桿 來判定遊戲是否進行中
let winner = 0;//0: 未定 1: 玩家贏 2: 莊家贏 3:平手

$(document).ready(function(){
  initCards();
  initButton();
});

function initCards() {
  $('.card div').html('☠') //jQuery也可以把集合轉換
};

function initButton(){
  $('#action-new-game').click((evt) =>{
    evt.preventDefault();
    newGame()
  });

  $('#action-hit').click((evt) =>{
    evt.preventDefault();
    yourDeck.push(deal());
    renderGameTable();
  });

  $('#action-stand').click((evt) =>{
    evt.preventDefault();
    dealerDeck.push(deal());
    dealerRound();
  });
};

function newGame(){
  resetGame();
  initCards();
  deck = shuffle(builtDeck())
  yourDeck.push(deal());
  dealerDeck.push(deal());
  yourDeck.push(deal());
  inGame = true;

  renderGameTable()
}

function deal(){
  return deck.shift();
}

function builtDeck(){
  let deck = [];
  for(let suit=1;suit<=4;suit++){ 
    for(let num=1;num<14;num++){
      let d = new Card(suit, num); 
      deck.push(d);
    };
  };
  switchSuit(deck);
  return deck;
};

class Card{
  constructor(suit, num){
    this.suit = suit;
    this.num = num;
  }
  // 牌面
  cardNumber(){
    switch(this.num){
      case 1:
        return 'A';
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      default:
        return this.num;
    }
  }
  // 牌值
  cardPoint(){
    switch(this.num){
      case 1:
        return 11;
      case 11:
      case 12:
      case 13:
        return 10;
      default:
        return this.num;
    }
  }
}

function switchSuit(deck){
  deck.forEach(element => {
    switch (element.suit){
    case 1:
      element.suit = '♠';
      break;
    case 2:
      element.suit = '♥';
      break;
    case 3:
      element.suit = '♦';
      break;
    case 4:
      element.suit = '♣';
      break;
    }
  });
}

function renderGameTable(){
  yourDeck.forEach((card, i) =>{
    let theCard = $(`#yourCard${i+1}`).html(card.cardNumber());
    theCard.prev().html(card.suit)// jQuery 抓同一層前面的元素
  });

  dealerDeck.forEach((card, i) =>{
    let theCard = $(`#dealerCard${i+1}`).html(card.cardNumber());
    theCard.prev().html(card.suit)
  });
  //算牌值
  yourPoint = calcCardPoint(yourDeck);
  dealerPoint = calcCardPoint(dealerDeck);
  
  $('.your-cards h1').html(`你: ${yourPoint} 點`)
  $('.dealer-cards h1').html(`莊家: ${dealerPoint} 點`)

  if (yourPoint>=21||dealerPoint>=21){
    inGame = false;
  }
  if (yourPoint< 21 && yourDeck.length === 5){
    inGame = false;
  }
  //輸贏

  checkWinner()
  showStamp();
  //按鈕
  //jQuery attr改變屬性用法
  $('#action-hit').attr('disabled', !inGame);
  $('#action-stand').attr('disabled', !inGame);

};

function calcCardPoint(deck) {
  let point = 0;

  deck.forEach((card) =>{
    point += card.cardPoint();
  });

  if (point>21){
    deck.forEach((card) =>{
      if(card.cardNumber() === 'A'){
        point -= 10;
      };
    });
  }
  return point;
};

// 洗牌
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function resetGame() {
  deck = [];
  yourDeck = [];
  dealerDeck = [];
  yourPoint = 0;
  dealerPoint = 0;
  winner = 0;
  removeStamp()
}

function  dealerRound() {
  while(true){
    dealerPoint = calcCardPoint(dealerDeck);

    if (dealerPoint<yourPoint){
      dealerDeck.push(deal());
    } else {
      break;
    }
  
    inGame = false;
    renderGameTable();
  }
};

function removeStamp(){
  $('.dealer-cards').removeClass('win');
  $('.your-cards').removeClass('win');
};

function showStamp(){
  switch (winner) {
    case 1:
      $('.your-cards').addClass('win');
      break;

    case 2:
      $('.dealer-cards').addClass('win');
      break;

    case 3:
      // $('.dealer-cards').addClass('tie');
      // $('.your-cards').addClass('tie');
      break;

    default: 
      break;
  }
}

function checkWinner(){
  switch (true) { 
    case yourPoint === 21:
      winner = 1;
      break

    case yourPoint > 21:
      winner = 2;
      break;

    case dealerPoint > 21:
      winner = 1;
      break

    case yourPoint < 21 && yourDeck.length === 5:
      winner = 1;
      break

    case dealerPoint > yourPoint:
      winner = 2;
      break;

    case yourPoint === dealerPoint:
      winner = 3;
      break

    default:
      winner = 0;
  };
}