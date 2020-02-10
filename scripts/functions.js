class MixOrMatch {
    constructor(cards) {
        this.cardsArray = cards;
        this.points = document.getElementById('points');
        this.moves = document.getElementById('moves');
    }

    startGame() {
        this.totalPoints = 0;
        this.totalClicks = 0;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.shuffleCards(this.cardsArray);
            this.busy = false;
        }, 500);
        this.hideCards();
        this.points.innerText = this.totalPoints;
        this.moves.innerText = this.totalClicks;

        $('.card').removeClass('d-none');
    }

    victory() {
        document.getElementById('totalPoints').innerHTML = this.points.innerText;
        document.getElementById('totalMoves').innerHTML = this.moves.innerText;
        document.getElementById('popupVictory').classList.add('visible');
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.totalClicks++;
            this.moves.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');

        this.totalPoints++;
        this.points.innerText = this.totalPoints;

        setTimeout(() => {
            card1.classList.add('d-none');
            card2.classList.add('d-none');
        }, 2000);

        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }

    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(cards);

    game.startGame();

    $('.btnStart').click(function () {
        if (!$('.card.visible.matched').is(":visible")) {
            document.querySelector('.overlay').classList.remove('visible');
            game.startGame();
        }
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

$(function () {

    $(window).on('load hashchange', function (e) {

        if (e.type == 'load') {
            var fullOnloadUrl = $(location).attr('href');
            var parts = fullOnloadUrl.split('/index.html');
        } else {
            var origEvent = e.originalEvent;
            var parts = origEvent.newURL.split('/index.html');
        }
        var hashVal = parts[parts.length - 1];

        $('.pageView').addClass('d-none');

        $('#cntHeader .active').removeClass('active');

        var btnActiveHeader = $('#cntHeader a[href="' + hashVal + '"]');
        btnActiveHeader.addClass('active');

        switch (hashVal) {
            case '#default':
                $('#homePage').removeClass('d-none');
                break;
            case '#home':
                $('#homePage').removeClass('d-none');
                break;
            case '#game':
                $('#gamePage').removeClass('d-none');
                break;
            case '#instructions':
                $('#instructionsPage').removeClass('d-none');
                break;
            case '#about':
                $('#aboutPage').removeClass('d-none');
                break;
            default:
                $('#homePage').removeClass('d-none');

        }
    });

    $('#cntHeader a').click(function () {
        $('#cntHeader .active').removeClass('active');
        $(this).addClass('active');
    });

    $('#cntFooter a').click(function () {
        $('#cntHeader .active').removeClass('active');
        $('#cntHeader a[href="' + $(this).attr('href') + '"]').addClass('active');
    });


    $('#popupVictory').click(function () {
        $(this).removeClass("visible");
    });

    $('#popupVictory .popup').click(function (e) {
        $(this).removeClass("visible");
        e.stopPropagation();
    });

});