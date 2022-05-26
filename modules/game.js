var game = {
    score: 0,
    clickPower: 1,
    totalScore: 0,
    totalClicks: 0,
    version: 0.200,
  
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
