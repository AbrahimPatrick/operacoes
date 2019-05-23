// ARITHMETIC GAME
const arithmetic_game = {

    // ATTRIBUTES
    random: 0,
    target: 10,
    max_number: 9,
    board: [],
    gamble: [],
    turn: {
        turn_index: 0,
        first_value: 0,
        symbols: {
            options: ['+', '-'],
            option_index: 0
        },
        last_value: 0,
    },
    wrong_question: 0,
    right_question: 0,
    points: 0,
    total_turns: 0,
    container_element: null,
    container_element_gamble: null,
    container_element_ball: null,
    gameover: false,
    modal_delay: 500,

    // FUNCTIONS
    random_integer(value) {
        this.random = Math.random() * value;
        return this.random.toFixed();
    },
    mount_board() {
        var i;
        for (i = 0; i < 16; i++) {
            this.board[i] = this.random_integer(this.max_number);
        }
    },
    init(container) {
        this.container_element = container;
    },

    initGamble(container) {
        this.container_element_gamble = container;
    },

    initBall(container) {
        this.container_element_ball = container;
    },

    calc() {
        var desc = this.desc();
        if (parseInt(this.turn.symbols.option_index) === 0) {
            var right_response = parseInt(desc[0]) + parseInt(desc[1]);
        } else {
            var right_response = parseInt(desc[0]) - parseInt(desc[1]);
        }
        return right_response;
    },

    desc() {
        var first_value = 0;
        var last_value = 0;
        if (parseInt(this.first_value) < parseInt(this.last_value)) {
            first_value = this.last_value;
            last_value = this.first_value;
        } else {
            first_value = this.first_value;
            last_value = this.last_value;
        }
        return [first_value, last_value];
    },

    gamble_play() {
        if (this.turn.turn_index === 1) {
            $(".gamble").removeClass("bg_turn_start");
            $(".gamble").addClass("bg_turn_loading");

            var count = 1;
            var stop_interval = setInterval(function () {
                if (count % 2 === 0) {
                    arithmetic_game.turn.symbols.option_index = 0;
                    $(".dice").html('<img src="img/plus.png" alt="" class="img-fluid">');
                } else {
                    arithmetic_game.turn.symbols.option_index = 1;
                    $(".dice").html('<img src="img/minus.png" alt="" class="img-fluid">');
                }
                arithmetic_game.drawGamble(arithmetic_game.turn.symbols.options[arithmetic_game.turn.symbols.option_index]);
                count++;
                if (count === 11) {
                    clearInterval(stop_interval);
                    $(".gamble").removeClass("bg_turn_loading");
                    $(".gamble").addClass("bg_turn_done");
                    $(".game").removeClass("text-disabled");
                    arithmetic_game.turn.symbols.option_index = arithmetic_game.random_integer(1);
                    arithmetic_game.drawGamble(arithmetic_game.turn.symbols.options[arithmetic_game.turn.symbols.option_index]);
                    if (parseInt(arithmetic_game.turn.symbols.option_index) === 0) {
                        arithmetic_game.turn.symbols.option_index = 0;
                        $(".dice").html('<img src="img/plus.png" alt="" class="img-fluid">');
                    } else {
                        arithmetic_game.turn.symbols.option_index = 1;
                        $(".dice").html('<img src="img/minus.png" alt="" class="img-fluid">');
                    }
                    arithmetic_game.turn.turn_index++;
                }
            }, 300);
        }
    },

    response_play() {
        $('#modalCenter').modal('hide');
        var response_value = $("#response").val();
        var right_response = this.calc();
        if (parseInt(response_value) === parseInt(right_response)) {
            $modal_header = 'Certa Resposta!';
            this.right_question++;
            this.points += parseInt(response_value);
        } else {
            this.wrong_question++;
            $modal_header = 'Que pena! Não foi desta vez.';
        }

        this.check_winning();
    },

    make_play(position, element) {
        if (this.gameover || this.board[position] === '') return false;

        if (this.turn.turn_index === 0) {
            this.first_value = element;
            this.turn.turn_index++;
            this.board[position] = '';
            $(".gamble").addClass("bg_turn_start");
            $(".game").addClass("text-disabled");
            this.draw();
            this.drawGamble('Pronto!');
            this.drawBall();

        } else if (this.turn.turn_index === 2) {
            this.last_value = element;
            var desc = this.desc();
            var modal_header = 'Realize a operação';
            var modal_body = '<div class="form-group row d-flex justify-content-center">\n' +
                                    '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" style="margin-right: 0; padding-right: 0;">' +
                '                    <label for="response" class="col-form-label">' + desc[0] + ' ' + this.turn.symbols.options[this.turn.symbols.option_index] + ' ' + desc[1] + ' = </label>\n' +
                '                    </div>'+
                '                    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style="margin-left: 0; padding-left: 0;">\n' +
                '                        <input type="number" id="response" name="response" class="form-control-lg" style="width: 150px" />\n' +
                '                    </div>\n' +
                '                </div>';
            var modal_footer = '<button type="button" class="btn" onclick="arithmetic_game.response_play()">Enviar Resposta</button>';

            $("#modalCenterTitle").html(modal_header);
            $("#modalCenterBody").html(modal_body);
            $("#modalCenterFooter").html(modal_footer);

            $("#modalCenter").modal("show");
        }
        return true;
    },

    check_winning() {
        if (this.points >= this.target) {
            this.total_turns++;
            var modal_header = '<img src="img/gif/gru.gif" class="img-fluid" alt="Imagem do Malvado Favorito Comemorando">';
            var modal_body = 'Fim de Jogo! Parabéns, você alcançou o número de pontos. <br><hr>' +
                'Acertos: '+ this.right_question + '. <br>' +
                'Erros: '+ this.wrong_question + '. <br>' +
                'Pontos: '+ this.points+'. <br>' +
                'Turnos: '+ this.total_turns + '. <br>' +
                'Alvo: ' + this.target + '.'
                + "<br><hr>Você concluiu o jogo em " + this.total_turns + ' turnos.';
            var modal_footer = '<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="arithmetic_game.alert_game_start()">Continuar</button>';
            setTimeout(function () {
                $('#modalGameOver').modal('show')
            }, parseInt(this.modal_delay));
            $("#modalGameOverTitle").html(modal_header);
            $("#modalGameOverBody").html(modal_body);
            $("#modalGameOverFooter").html(modal_footer);

            this.game_is_over();
        } else {
            this.total_turns++;
            var modal_body = "Pontos: " + this.points + ". Turno: " + this.total_turns + ". Meta: " + this.target + ".";
            var modal_footer = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Continuar</button>';

            setTimeout(function () {
                $('#modalCenter').modal('show')
            }, parseInt(this.modal_delay));
            $("#modalCenterTitle").html($modal_header);
            $("#modalCenterBody").html(modal_body);
            $("#modalCenterFooter").html(modal_footer);
            this.new_turn();
        }
        return -1;
    },

    game_is_over() {
        this.gameover = true;
        console.log('GAME OVER');
        this.points = 0;
        this.total_turns = 0;
        this.restart();
    },

    is_game_over() {
        return !this.board.includes('');
    },

    start() {
        this.mount_board();
        this.turn.turn_index = 0;
        this.draw();
        this.drawGamble('Dado');
        this.drawBall();
        console.log("Jogo começou! Alcance o total de " + this.target + " pontos no menor número de turnos possiveis.");
        this.gameover = false;
        $(".gamble").removeClass("bg_turn_loading");
        $(".gamble").removeClass("bg_turn_done");
        $(".gamble").removeClass("bg_turn_start");
        $(".game").removeClass("text-disabled");
        $("#ball").draggable({revert:true});
    },

    new_turn() {
        this.mount_board();
        this.turn.turn_index = 0;
        this.draw();
        this.drawGamble('Dado');
        this.drawBall();
        this.gameover = false;
        $(".gamble").removeClass("bg_turn_loading");
        $(".gamble").removeClass("bg_turn_done");
        $(".gamble").removeClass("bg_turn_start");
        $(".game").removeClass("text-disabled");
    },

    restart() {
        if (this.is_game_over() || this.gameover) {
            this.start();
            console.log('this game has been restarted!')
        } else if (confirm('Are you sure you want to restart this game?')) {
            this.start();
            console.log('this game has been restarted!')
        }
    },

    instructions() {
        var modal_header = 'Guia do Jogo das Operações';

        var modal_body = 'Coloque as instruções aqui';
        var modal_footer = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Quero Jogar!</button>';

        $("#modalLongTitle").html(modal_header);
        $("#modalLongBody").html(modal_body);
        $("#modalLongFooter").html(modal_footer);

        $("#modalLong").modal("show");
    },

    scoreboard() {
        var resultado = parseInt(this.target) - parseInt(this.points);
        var modal_header = 'Placar';

        var modal_body = 'Acertos: '+ this.right_question + '. <br>' +
                         'Erros: '+ this.wrong_question + '. <br>' +
                         'Pontos: '+ this.points+'. <br>' +
                         'Turnos: '+ this.total_turns + '. <br>' +
                         'Faltam: '+ resultado + '. <br>' +
                         'Alvo: ' + this.target + '.';
        var modal_footer = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>';

        $("#modalCenterTitle").html(modal_header);
        $("#modalCenterBody").html(modal_body);
        $("#modalCenterFooter").html(modal_footer);

        $("#modalCenter").modal("show");
    },

    alert_game_start() {
        var modal_header = "Novo jogo!";
        var modal_body = "Alcance o total de " + this.target + " pontos no menor número de turnos possiveis.";
        var modal_footer = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Continuar</button>';
        setTimeout(function () {
            $('#modalCenter').modal('show')
        }, parseInt(this.modal_delay));
        $("#modalCenterTitle").html(modal_header);
        $("#modalCenterBody").html(modal_body);
        $("#modalCenterFooter").html(modal_footer);
    },

    pote_bulk(element) {
        var percentage = (element * 100) / this.max_number;
        var image = "img/empty_pote.png";
        if (percentage > 0 && percentage <= 35) {
            image = "img/pote_2.png";
        } else if (percentage > 35 && percentage <= 65) {
            image = "img/pote_3.png";
        } else if (percentage > 65) {
            image = "img/pote_5.png";
        }
        return image;
    },

    draw() {
        this.container_element.innerHTML = this.board.map((element, index) =>
            // $image = this.pote_bulk(element);
            `<div class=""><img src="${this.pote_bulk(element)}" alt="" class="potes img-fluid"><p class="number_pote droppable"><input type="hidden" name="index" class="index" value="${index}"><input type="hidden" name="element" class="element" value="${element}">${element}</p></div>`).reduce((content, current) => content + current);
    },

    drawGamble(symbol) {
        this.container_element_gamble.innerHTML = '<div><i class="fas fa-dice-d6"></i></div>';
    },

    drawBall() {
        this.container_element_ball.innerHTML = '<div id="ball"><img src="img/ball.svg"></div>';
    },
};