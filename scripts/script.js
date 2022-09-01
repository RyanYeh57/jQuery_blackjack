let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;

$(document).ready(function(){
  initCards();
  initButton();
});

function initCards() {
  $('.card div').html('☠') //jQuery也可以把集合轉換
};

function newGame(){
  let deck = shuffle(builtDeck())
  yourDeck.push(deal(deck));
  dealerDeck.push(deal(deck));
  yourDeck.push(deal(deck));
  console.log(yourDeck)
  renderGameTable()
}

function deal(deck){
  return deck.shift();
}

function initButton(){
  $('#action-new-game').click((evt) =>{
    evt.preventDefault();
    newGame()
  });
};

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
  yourPoint += calcCardPoint(yourDeck);
  dealerPoint += calcCardPoint(dealerDeck);
  
  $('.your-cards h1').html(`你: ${yourPoint} 點`)
  $('.dealer-cards h1').html(`莊家: ${dealerPoint} 點`)
};

function calcCardPoint(deck) {
  let point = 0;

  deck.forEach(card =>{
    point += card.cardPoint();
  });
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