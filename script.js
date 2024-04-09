Counter = {
    PlayingState: null,
    IsStoped: true,
    Score: 0,
    TimeRemaining: 0, 
    FirstNumber: 0,
    SecondNumber: 0,
    CorrectAnswer: 0,
    CorrectPosition: 0,
    WrongAnswer: 0,
    Operations: ['*', '+', '-', '/'],
    CurrentOperation: null,
    
    AddContentToElement: function (selector, content) {
        document.querySelector(selector).innerHTML = content;
    },
    ChangeStyle: function (selector, property, value) {
        document.querySelector(selector).setAttribute(property, value);
    },
    Initialize: function (timeRemaining) {
        this.TimeRemaining = timeRemaining;
    },
    GenerateRandomNumber: function (multiplier) {
        return Math.round(Math.random()) + 1;
    },
    Refresh: function (selector, data) {
        document.querySelector(selector).innerText = (data < 10 ? "0" : "") + data;
    },
    LoopThroughElements: function () {
        var answers = [this.CorrectAnswer];

        for (var index = 1; index < 5; index++) {
            this.ChangeStyle("ul#choices > li:nth-of-type(" + index + ")", "style", "height:auto;");

            if (index !== this.CorrectPosition) {
                do {
                    this.WrongAnswer = Math.floor(Math.random() * 100) + Math.floor(Math.random() * 50);
                } while (answers.indexOf(this.WrongAnswer) > -1);

                this.AddContentToElement("ul#choices > li:nth-of-type(" + index + ")", this.WrongAnswer);
                answers.push(this.WrongAnswer);
            }
        }
    },
    Launch: function () {
        this.IsStoped = false;
        this.Action();
        this.ChangeStyle("aside#time-remaining", "style", "visibility:visible;");
        this.ChangeStyle("#game-over", "style", "display:none;");
        this.ChangeStyle("ul#choices", "style", "pointer-events:initial; opacity:1;");
        this.ChangeStyle("button#start-reset", "style", "visibility:hidden;");
        this.AddContentToElement("button#start-reset", "Перезагрузить игру");
        this.Refresh("aside#time-remaining > span", this.TimeRemaining);
        this.GenerateQuestionAndAnswers();
    },

    GenerateQuestionAndAnswers: function () {
        this.FirstNumber = Math.floor(Math.random() * 100);
        this.SecondNumber = Math.floor(Math.random() * 45);
        this.CurrentOperation = this.Operations[this.GenerateRandomNumber(this.Operations.length)];

        switch (this.CurrentOperation) {
            case '*':
                this.CorrectAnswer = this.FirstNumber * this.SecondNumber;
                break;
            case '+':
                this.CorrectAnswer = this.FirstNumber + this.SecondNumber;
                break;
            case '-':
                this.CorrectAnswer = this.FirstNumber - this.SecondNumber;
                break;
            case '/':
                this.CorrectAnswer = Math.round(this.FirstNumber / this.SecondNumber);
                this.SecondNumber = this.FirstNumber;
                break;
    };

    this.CorrectPosition = this.GenerateRandomNumber(3);
        this.ChangeStyle("section#question", "style", "height:auto;");
        this.AddContentToElement("section#question", this.FirstNumber + this.CurrentOperation + this.SecondNumber);
        this.AddContentToElement("ul#choices > li:nth-of-type(" + this.CorrectPosition + ")", this.CorrectAnswer);
        this.LoopThroughElements();
    },

    EventListener: function (event) {
        var userAnswer = Number(event.currentTarget.innerText);
        var isCorrectAnswer;

        switch (this.CurrentOperation) {
            case '*':
                isCorrectAnswer = userAnswer === this.FirstNumber * this.SecondNumber;
                break;
            case '+':
                isCorrectAnswer = userAnswer === this.FirstNumber + this.SecondNumber;
                break;
            case '-':
                isCorrectAnswer = userAnswer === this.FirstNumber - this.SecondNumber;
                break;
            case '/':
                isCorrectAnswer = userAnswer === Math.round(this.FirstNumber / this.SecondNumber);
                break;
        }
    },
    Action: function () {
        Counter.PlayingState = setInterval(function () {
            Counter.TimeRemaining--;

            if (Counter.TimeRemaining <= 50) {
                Counter.ChangeStyle("button#start-reset", "style", "visibility:visible;");
            }

            if (Counter.TimeRemaining < 1) {
                Counter.Stop();

            } else {
                Counter.Refresh("aside#time-remaining > span", Counter.TimeRemaining);
            }
        }, 1000);
    },
    EventListener: function (event) {
        if (Number(event.currentTarget.innerText) === Number(Counter.CorrectAnswer)) {
            Counter.Score++;
            Counter.Refresh("aside#score > span", Counter.Score);
            Counter.GenerateQuestionAndAnswers();
            Counter.ChangeStyle("p#message", "style", "visibility:visible; background-color:rgba(181, 235, 36, 0.8);");
            Counter.AddContentToElement("p#message", "Верно");
        } else {
            if (Counter.Score >= 1) {
                Counter.Score -= 1;
                Counter.Refresh("aside#score > span", Counter.Score);
            }

            Counter.ChangeStyle("p#message", "style", "visibility:visible; background-color:#CD8D7A;");
            Counter.AddContentToElement("p#message", "Неверно");
        }

        setTimeout(function () {
            Counter.ChangeStyle("p#message", "style", "visibility:hidden;");
        }, 1000);
    },
    CheckClickOnRightAnswer: function () {
        for (var index = 1; index < 5; index++) {
            document.querySelector("ul#choices > li:nth-of-type(" + index + ")").removeEventListener("click", this.EventListener, false);
            document.querySelector("ul#choices > li:nth-of-type(" + index + ")").addEventListener("click", this.EventListener);
        }
    },
    Stop: function () {
        this.IsStoped = true;
        clearInterval(this.PlayingState);
        this.ChangeStyle("ul#choices", "style", "pointer-events:none; opacity:0.4;");
        this.ChangeStyle("aside#time-remaining", "style", "visibility:hidden;");
        this.ChangeStyle("div#game-over", "style", "display:block;");
        this.AddContentToElement("button#start-reset", "Начать игру");
        this.AddContentToElement("div#game-over > p:last-of-type > span", this.Score);
        this.AddContentToElement("aside#score > span", this.Score = "0");
        
    }

};

//устанавливаемое время (60 секунд)
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("start-reset").addEventListener("click", function () {
        Counter.Initialize(60);
        Counter.IsStoped ? Counter.Launch(): Counter.Stop();
        Counter.CheckClickOnRightAnswer();
     });
 });

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("hide-header").style.top = "0";
  } else {
    document.getElementById("hide-header").style.top = "-80px";
  }
  prevScrollpos = currentScrollPos;
}

(function($) {

	var	$window = $(window),
		$body = $("body"),
		$wrapper = $("#wrapper");

		$window.on("load", function() {
			window.setTimeout(function() {
				$body.removeClass("is-preload");
			}, 100);
		});

	//плавная прокрутка страницы
		$(".smooth-scroll").scrolly();
		$(".smooth-scroll-middle").scrolly({ anchor: "middle" });

		$wrapper.children()
			.scrollex({
				top:		"30vh",
				bottom:		"30vh",
				initialize:	function() {
					$(this).addClass("is-inactive");
				},
				terminate:	function() {
					$(this).removeClass("is-inactive");
				},
				enter:		function() {
					$(this).removeClass("is-inactive");
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass("onscroll-bidirectional"))
						$this.addClass("is-inactive");

				}
			});

})(jQuery);