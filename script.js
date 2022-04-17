import { createPopper } from '@popperjs/core';

var game = {
  score: 0,
  clickPower: 1,
  totalScore: 0,
  totalClicks: 0,
  version: 0.000,

  addToScore: function (amount) {
    this.score += amount;
    this.totalScore += amount;
    display.updateScore();
  },

  getScorePerSecond: function () {
    var scorePerSecond = 0;
    for (i = 0; i < building.name.length; i++) {
      scorePerSecond += building.income[i] * building.count[i];
    }
    return scorePerSecond;
  }
};

var display = {
  updateScore: function () {
    scoreAmount.innerHTML = Math.round(game.score);
    scoresPerSecond.innerHTML = Math.round(game.getScorePerSecond());
    document.title = Math.round(game.score) + " essences | Poring Clicker"
  },

  updateShop: function () {
    document.getElementById("buildingContainer").innerHTML = "";
    for (i = 0; i < building.name.length; i++) {
      let bScorePerSecond = Math.round((building.income[i] * building.count[i]) * building.level[i])
      let bScorePerMinute = Math.round(((building.income[i] * building.count[i]) * building.level[i]) * 60);
      let bScorePerHour = Math.round((((building.income[i] * building.count[i]) * building.level[i]) * 60) * 60);

      if (building.count[i] == 0) {
        bScorePerSecond = building.income[i];
        bScorePerMinute = building.income[i] * 60;
        bScorePerHour = (building.income[i] * 60) * 60;
        document.getElementById("buildingContainer").innerHTML += '<div id="' + building.name[i] + 'Container" class="box inactive" style="top: ' + building.positionY[i] + 'px; left: ' + building.positionX[i] + 'px;"> <div id="' + building.name[i] + 'Container-header" class="header"> <div class="name"> <div class="circle-button empty"></div>' + building.name[i] + ' </div><div class="flex header-right"> <div class="circle-button minimize"></div><div class="circle-button cross"></div></div></div><div class="flex col no-wrap"> <div class="flex row builder-info"> <div class="builder-box-image"><img src="images/builder/' + building.image[i] + '" alt=""></div><div class="flex col"> <div class="flex a-center j-between builder-units"> <p><span>' + building.count[i] + '</span> units</p><p>Lvl <span>' + building.level[i] + '</span></p></div><div class="flex a-center builder-per-second"> <img src="images/item/card.gif" class="m-1"> <div class="flex col"> <p><span>' + bScorePerSecond + '</span> /per second</p><p><span>' + bScorePerMinute + '</span> /per minute</p><p><span>' + bScorePerHour + '</span> /per hour</p></div></div><div class="flex a-center j-between builder-total"> <p><span id="' + building.name[i] + 'TotalIncome">' + Math.round(building.totalIncome[i]) + '</span> made in total</p></div></div></div><div class="flex j-around a-center builder-buy-upgrade"> <button onclick="building.purchase(' + i + ')">buy</button> <button onclick="building.levelUp(' + i + ')" class="inactive" disabled>level up</button> </div></div></div>'
      } else {
        document.getElementById("buildingContainer").innerHTML += '<div id="' + building.name[i] + 'Container" class="box" style="top: ' + building.positionY[i] + 'px; left: ' + building.positionX[i] + 'px;"> <div id="' + building.name[i] + 'Container-header" class="header"> <div class="name"> <div class="circle-button empty"></div>' + building.name[i] + ' </div><div class="flex header-right"> <div class="circle-button minimize"></div><div class="circle-button cross"></div></div></div><div class="flex col no-wrap"> <div class="flex row builder-info"> <div class="builder-box-image"><img src="images/builder/' + building.image[i] + '" alt=""></div><div class="flex col"> <div class="flex a-center j-between builder-units"> <p><span>' + building.count[i] + '</span> units</p><p>Lvl <span>' + building.level[i] + '</span></p></div><div class="flex a-center builder-per-second"> <img src="images/item/card.gif" class="m-1"> <div class="flex col"> <p><span>' + bScorePerSecond + '</span> /per second</p><p><span>' + bScorePerMinute + '</span> /per minute</p><p><span>' + bScorePerHour + '</span> /per hour</p></div></div><div class="flex a-center j-between builder-total"> <p><span id="' + building.name[i] + 'TotalIncome">' + Math.round(building.totalIncome[i]) + '</span> made in total</p></div></div></div><div class="flex j-around a-center builder-buy-upgrade"> <button onclick="building.purchase(' + i + ')">buy</button> <button onclick="building.levelUp(' + i + ')">level up</button> </div></div></div>'
      }
    }
    for (i = 0; i < building.name.length; i++) {
      dragElement(document.getElementById(building.name[i] + "Container"));
    }
  },

  updateTotalIncome: function () {
    for (i = 0; i < building.name.length; i++) {
      if (building.count[i] >= 1) {
        building.totalIncome[i] += (building.income[i] * building.count[i]) * building.level[i];
        document.getElementById(building.name[i] + 'TotalIncome').innerHTML = Math.round(building.totalIncome[i]);
      }
    }
  },

  updateUpgrade: function () {
    document.getElementById("upgradeContainer").innerHTML = "";
    for (i = 0; i < upgrade.name.length; i++) {
      if (!upgrade.purchased[i]) {
        if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
          document.getElementById("upgradeContainer").innerHTML += '<div title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ') essence" onclick="upgrade.purchase(' + i + ')"><img src="' + upgrade.image[i] + '" alt="Upgrade"></div>'
        } else if (upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]) {
          document.getElementById("upgradeContainer").innerHTML += '<div title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ') essence" onclick="upgrade.purchase(' + i + ')"><img src="' + upgrade.image[i] + '" alt="Upgrade"></div>'
        }
      }
    }
  },

  updateAchievement: function () {
    document.getElementById("achievementContainer").innerHTML = "";
    for (i = 0; i < achievement.name.length; i++) {
      if (achievement.awarded[i]) {
        document.getElementById("achievementContainer").innerHTML += '<div title="' + achievement.name[i] + ' &#10; ' + achievement.description[i] + '"><img src="' + achievement.image[i] + '" alt="achievement"></div>'
      }
    }
  },
};

var building = {
  name: [
    "poring",
    "drops",
    "poporing",
    "marin",
    "ghostring"
  ],
  sprite: [
    "poring.gif",
    "drops.gif",
    "poporing.gif",
    "marin.gif",
    "ghostring.gif"
  ],
  staticSprite: [
    "poring-static.gif",
    "drops-static.gif",
    "poporing-static.gif",
    "marin-static.gif",
    "ghostring-static.gif"
  ],
  image: [
    "poring.webp",
    "drops.webp",
    "poporing.webp",
    "marin.png",
    "ghostring.png"
  ],
  count: [0, 0, 0, 0, 0],
  countPlaceholder: [1, 1, 1, 1, 1],
  level: [1, 1, 1, 1, 1],
  income: [
    0.1,
    1,
    8,
    47,
    260
  ],
  totalIncome: [0, 0, 0, 0, 0],
  cost: [
    15,
    100,
    1100,
    12000,
    130000,
  ],
  levelUpCost: [
    150,
    1000,
    11000,
    120000,
    1300000,
  ],

  purchase: function (index) {
    if (game.score >= this.cost[index]) {
      game.score -= this.cost[index];
      this.count[index]++;
      this.cost[index] = Math.round(this.cost[index] * 1.15);

      display.updateScore();
      display.updateShop();
      display.updateUpgrade();
      display.updateAchievement();
    }
  },

  levelUp: function (index) {
    if (game.score >= this.cost[index]) {
      game.score -= this.levelUpCost[index];
      this.level[index]++;
      this.income[index] * this.level;
      this.levelUpCost[index] = Math.round(this.levelUpCost[index] * 1.50);


      display.updateScore();
      display.updateShop();
      display.updateUpgrade();
      display.updateAchievement();
    }
  },
  positionX: [
    400,
    450,
    500,
    550,
    600,
  ],
  positionY: [
    150,
    200,
    250,
    300,
    350,
  ],
};

var upgrade = {
  name: [
    "Upgrade 1",
    "Upgrade 2"
  ],
  description: [
    "Descrição do Upgrade 1",
    "Descrição do Upgrade 2"
  ],
  image: [
    "images/item/apple.gif",
    "images/item/jellopy.gif"
  ],
  type: [
    "building",
    "click"
  ],
  cost: [
    300,
    300
  ],
  buildingIndex: [
    0,
    0,

  ],
  requirement: [
    1,
    100
  ],
  bonus: [
    2,
    2,
  ],
  purchased: [false, false],
  purchase: function (index) {
    if (!this.purchased[index] && game.score >= this.cost[index]) {
      if (this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
        game.score -= this.cost[index];
        building.income[this.buildingIndex[index]] *= this.bonus[index];
        this.purchased[index] = true;

        display.updateUpgrade();
        display.updateScore();

      } else if (this.type[index] == "click" && game.totalClicks >= this.requirement[index]) {
        game.score -= this.cost[index];
        game.clickPower *= this.bonus[index];
        this.purchased[index] = true;

        display.updateUpgrade();
        display.updateScore();
      }
    }
  },
};

var achievement = {
  name: [
    "building Achievement 1",
    "score Achievement 2",
    "click Achievement 3",
  ],
  description: [
    "Buy 1 Poring",
    "Gather an Essence",
    "Click the Card",
  ],
  image: [
    "images/item/apple.gif",
    "images/item/card.gif",
    "images/item/card.gif",
  ],
  type: [
    "building",
    "score",
    "click",
  ],
  requirement: [
    1,
    1,
    1,
  ],
  objectIndex: [
    0,
    -1,
    -1,
  ],
  awarded: [false, false, false, ],

  earn: function (index) {
    this.awarded[index] = true;
  },
};

// dom
const bigCard = document.getElementById("bigCard");
const scoreAmount = document.getElementById("scoreAmount");
const scoresPerSecond = document.getElementById("scoresPerSecond")



// functions
function oneSecondUpdates() {
  for (i = 0; i < achievement.name.length; i++) {
    if (achievement.type[i] == "score" && game.totalScore >= achievement.requirement[i]) achievement.earn(i);
    else if (achievement.type[i] == "click" && game.totalClicks >= achievement.requirement[i]) achievement.earn(i);
    else if (achievement.type[i] == "building" && building.count[achievement.objectIndex[i]] >= achievement.requirement[i]) achievement.earn(i);
  }

  game.score += game.getScorePerSecond();
  game.totalScore += game.getScorePerSecond();

  display.updateScore();
  display.updateAchievement();
  display.updateTotalIncome();
}

function loadGame() {
  var gameSave = JSON.parse(localStorage.getItem("gameSave"));
  if (localStorage.getItem("gameSave") !== null) {
    if (typeof gameSave.score !== "undefined") game.score = gameSave.score;
    if (typeof gameSave.clickPower !== "undefined") game.clickPower = gameSave.clickPower;
    if (typeof gameSave.totalScore !== "undefined") game.totalScore = gameSave.totalScore;
    if (typeof gameSave.totalClicks !== "undefined") game.totalClicks = gameSave.totalClicks;
    if (typeof gameSave.version !== "undefined") game.version = gameSave.version;

    if (typeof gameSave.buildingCount !== "undefined") {
      for (i = 0; i < gameSave.buildingCount.length; i++) {
        building.count[i] = gameSave.buildingCount[i];
      }
    }
    if (typeof gameSave.buildingIncome !== "undefined") {
      for (i = 0; i < gameSave.buildingIncome.length; i++) {
        building.income[i] = gameSave.buildingIncome[i];
      }
    }
    if (typeof gameSave.buildingCost !== "undefined") {
      for (i = 0; i < gameSave.buildingCost.length; i++) {
        building.cost[i] = gameSave.buildingCost[i];
      }
    }
    if (typeof gameSave.boxPositionX !== "undefined") {
      for (i = 0; i < gameSave.boxPositionX.length; i++) {
        building.positionX[i] = gameSave.boxPositionX[i];
      }
    }
    if (typeof gameSave.boxPositionY !== "undefined") {
      for (i = 0; i < gameSave.boxPositionY.length; i++) {
        building.positionY[i] = gameSave.boxPositionY[i];
      }
    }
    if (typeof gameSave.buildingTotalIncome !== "undefined") {
      for (i = 0; i < gameSave.buildingTotalIncome.length; i++) {
        building.totalIncome[i] = gameSave.buildingTotalIncome[i];
      }
    }
    if (typeof gameSave.upgradePurchased !== "undefined") {
      for (i = 0; i < gameSave.upgradePurchased.length; i++) {
        upgrade.purchased[i] = gameSave.upgradePurchased[i];
      }
    }
  }
}

function saveGame() {
  var gameSave = {
    score: game.score,
    clickPower: game.clickPower,
    totalScore: game.totalScore,
    totalClicks: game.totalClicks,
    version: game.version,

    buildingCount: building.count,
    buildingIncome: building.income,
    buildingTotalIncome: building.totalIncome,
    buildingCost: building.cost,
    boxPositionX: building.positionX,
    boxPositionY: building.positionY,

    upgradePurchased: upgrade.purchased,

  }
  localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function resetGame() {
  if (confirm("Are you sure you want to reset your Save?")) {
    if (confirm("There's no way back, reset now?")) {
      var gameSave = {}
      localStorage.setItem("gameSave", JSON.stringify(gameSave));
      location.reload();
    }
  }
}

function fadeOut(element, duration, finalOpacity, callback) {
  let opacity = 1;

  let elementFadingInterval = window.setInterval(function () {
    opacity -= 50 / duration;

    if (opacity <= finalOpacity) {
      clearInterval(elementFadingInterval);
      callback();
    }

    element.style.opacity = opacity;
  }, 50)
}

function floatNumberOnClick(event) {
  // grab clicker
  let clicker = document.getElementById("bigCard");

  // grab the position from mouse
  let clickerOffset = clicker.getBoundingClientRect();
  let position = {
    x: event.pageX - clickerOffset.left,
    y: event.pageY - clickerOffset.top
  }

  // create number
  let element = document.createElement("div");
  element.textContent = "+" + game.clickPower;
  element.classList.add("number");
  element.style.left = position.x + "px";
  element.style.top = position.y + "px";

  // add number to clicker
  clicker.appendChild(element);

  // rise the element
  let movementInterval = window.setInterval(function () {
    position.y--;
    element.style.top = position.y + "px";
  }, 10);

  // fade out the element
  fadeOut(element, 3000, 0, function () {
    element.remove();
  });
}

// autoclicker cheat -----------
// setInterval(function() {
//   bigCard.click();
// }, 25)


setInterval(function () {
  display.updateScore();
  display.updateUpgrade();
}, 10000)

setInterval(oneSecondUpdates, 1000) // essence per second
setInterval(saveGame, 30000) // save game every 30s

document.getElementById("bigCard").addEventListener("click", function () {
  game.totalClicks++;
  game.addToScore(game.clickPower);
  floatNumberOnClick(event);
}, false)

window.onload = function () {
  loadGame();
  display.updateScore();
  display.updateShop();
  display.updateUpgrade();
}

document.addEventListener("keydown", function (event) { // ctrl+s = save game
  if (event.ctrlKey && event.which == 83) {
    event.preventDefault();
    saveGame();
  }
});

// Make the DIV element draggable:
dragElement(document.getElementById("mainStats"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    // save new position to var
    for (i = 0; i < building.name.length; i++) {
      if (elmnt.id == building.name[i] + "Container") {
        building.positionY[i] = elmnt.offsetTop - pos2;
        building.positionX[i] = elmnt.offsetLeft - pos1;
      }
    }
  }



  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}