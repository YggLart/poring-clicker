var game = {
  score: 0,
  clickPower: 1,
  totalScore: 0,
  totalClicks: 0,
  version: 0.000,

  addToScore: function(amount) {
    this.score += amount;
    this.totalScore += amount;
    display.updateScore();
  },

  getScorePerSecond: function() {
    var scorePerSecond = 0;
    for (i = 0; i < building.name.length; i++) {
      scorePerSecond += building.income[i] * building.count[i];
    }
    return scorePerSecond;
  }
};

var display = {
  updateScore: function() {
    scoreAmount.innerHTML = Math.round(game.score);
    scoresPerSecond.innerHTML = game.getScorePerSecond();
    document.title = Math.round(game.score) + " essences | Poring Clicker"
  },

  updateShop: function() {
    document.getElementById("buildingContainer").innerHTML = "";
    for (i = 0; i < building.name.length; i++) {
      document.getElementById("buildingContainer").innerHTML += '<div onclick="building.purchase(' + i + ')" class="building"><img class="m-image" src="images/monster/' + building.image[i] + '" alt=""><div class="monster"><h3 class="m-name">' + building.name[i] + '</h3><div class="m-cost"><img src="images/item/card.gif" alt=""> <span>' + building.cost[i] + '</span></div></div><h4>' + building.count[i] + '</h4></div>'
    }
  },

  updateUpgrade: function() {
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

  updateAchievement: function() {
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
    "Poring",
    "Drops",
    "Poporing",
    "Marin",
    "Ghostring"
  ],
  image: [
    "poring.gif",
    "drops.gif",
    "poporing.gif",
    "marin.gif",
    "ghostring.gif"
  ],
  staticImage: [
    "poring-static.gif",
    "drops-static.gif",
    "poporing-static.gif",
    "marin-static.gif",
    "ghostring-static.gif"
  ],
  count: [0, 0, 0, 0, 0],
  income: [
    0.1,
    1,
    8,
    47,
    260
  ],
  cost: [
    15,
    100,
    1100,
    12000,
    130000,
  ],

  purchase: function(index) {
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
  purchase: function(index) {
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

  earn: function(index) {
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
    buildingCost: building.cost,

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

  let elementFadingInterval = window.setInterval(function() {
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
  let movementInterval = window.setInterval(function() {
    position.y--;
    element.style.top = position.y + "px";
  }, 10);

  // fade out the element
  fadeOut(element, 3000, 0, function() {
    element.remove();
  });
}

// autoclicker cheat -----------
// setInterval(function() {
//   bigCard.click();
// }, 25)


setInterval(function() {
  display.updateScore();
  display.updateUpgrade();
}, 10000)

setInterval(oneSecondUpdates, 1000) // essence per second
setInterval(saveGame, 30000) // save game every 30s

document.getElementById("bigCard").addEventListener("click", function() {
  game.totalClicks++;
  game.addToScore(game.clickPower);
  floatNumberOnClick(event);
}, false)

window.onload = function() {
  loadGame();
  display.updateScore();
  display.updateShop();
  display.updateUpgrade();
}

document.addEventListener("keydown", function(event) { // ctrl+s = save game
  if (event.ctrlKey && event.which == 83) {
    event.preventDefault();
    saveGame();
  }
});
