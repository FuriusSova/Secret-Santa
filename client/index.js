window.onload = async function () {
    let response = await request('/api/getuser');
    let arrUsers = await response.json();
    if (arrUsers.length != 0) {
        $('#createPairs').hide();
        $('input[type=submit]').hide();
        $('#restartGame').css("display", "");
        arrUsers.forEach(async (element) => {
            $('.dropdown-menu').append(`<li id="users">${element.name} ${element.surname}</li>`);
        });
        $('.container_drop').css("display", "");
        $('.dropdown .dropdown-menu li').click(async function () {
            if ($(".receiverData")) {
                $(".receiverData").remove();
            }
            $(this).parents('.dropdown').find('span').text($(this).text());
            let santaData = {};
            let text = $(this).text();
            santaData.nameSanta = text.slice(0, text.indexOf(" "));
            santaData.surnameSanta = text.slice(text.indexOf(" ") + 1);
            const receiverData = await request('/api/getreceiver', 'POST', santaData);
            let data = await receiverData.json();
            $(".msg").append(`<p class="receiverData">Your receiver : ${data.name} ${data.surname}</p><p class="receiverData">His wish : <br> ${data.wish.replace(/, /g, "<br>")}`);
        });
    }
}

$(document).on('submit', 'form', function (e) {
    e.preventDefault();
});

/*Dropdown Menu*/
$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
/*End Dropdown Menu*/

$('textarea').on('keypress', function (event) {
    let text = $('textarea').val();
    let lines = text.split("\n");
    let currentLine = this.value.substr(0, this.selectionStart).split("\n").length;
    if (event.keyCode == 13) {
        if (lines.length >= $(this).attr('rows')) {
            return false;
        }
    }
    else {
        if (lines[currentLine - 1].length >= $(this).attr('cols')) {
            return false;
        }
    }
});

$('input[type=submit]').on('click', async (event) => {
    if ($('#createPairs').css("display") == "none") {
        $('#createPairs').show();
    }
    if ($(".container_drop").css("display") != "none") {
        location.reload();
    }
    let regExp = /^[а-яА-ЯёЁіІїЇєЄa-zA-Z]+$/;
    if (!regExp.test($('#form_name').val()) || !regExp.test($('#form_lastname').val()) || $('#form_message').val() == "") {
        alert("Wrong data");
    } else {
        let user = {
            name: $('#form_name').val().replace(/\s+/g, ''),
            surname: $('#form_lastname').val().replace(/\s+/g, ''),
            wish: $('#form_message').val().replace(/\n+|\r+/g, ', ')
        }

        //console.log($('#form_message').val().replace(/\n|\r/g, '--'));

        await request('/api/adduser', 'POST', user);

        $('#form_name').val("")
        $('#form_lastname').val("")
        $('#form_message').val("")
    }
    return false;
});

$('#createPairs').on('click', async (event) => {
    let response = await request('/api/getuser');
    let arrUsers = await response.json();
    if (arrUsers.length <= 3) {
        alert("You need more members")
        return false;
    } else if (arrUsers.length >= 500) {
        alert("There are too many members, please roload the page to start again")
        return false;
    }
    $('#createPairs').hide(2000);
    $('input[type=submit]').hide(2000);
    $('#restartGame').css("display", "");
    let santa_pairs = {
        santaData: {},
        receiverData: {}
    };
    let size = arrUsers.length;
    let usersId = [];
    arrUsers.forEach(async (element) => {
        $('.dropdown-menu').append(`<li id="users">${element.name} ${element.surname}</li>`);
        santa_pairs = {
            santaData: {},
            receiverData: {}
        };
        santa_pairs.santaData.santa_name = element.name.replace(/\s+/g, '');
        santa_pairs.santaData.santa_surname = element.surname.replace(/\s+/g, '');
        santa_pairs.santaData.santa_id = element.id;

        while (!santa_pairs.receiverData.receiver_name) {
            for (let i = 0; i < arrUsers.length; i++) {
                integer = random(1, size);
                if (arrUsers[i].id == element.id) {
                    continue;
                }
                if (arrUsers[i].id == integer && !usersId.includes(arrUsers[i].id)) {
                    santa_pairs.receiverData.receiver_name = arrUsers[i].name.replace(/\s+/g, '');
                    santa_pairs.receiverData.receiver_surname = arrUsers[i].surname.replace(/\s+/g, '');
                    santa_pairs.receiverData.receiver_wish = arrUsers[i].wish;
                    usersId.push(arrUsers[i].id)
                    break;
                };
            };
        }

        await request('/api/setpairs', 'POST', santa_pairs);
    });
    $('.container_drop').css("display", "");
    $('.dropdown .dropdown-menu li').click(async function () {
        if ($(".receiverData")) {
            $(".receiverData").remove();
        }
        $(this).parents('.dropdown').find('span').text($(this).text());
        let santaData = {};
        let text = $(this).text();
        santaData.nameSanta = text.slice(0, text.indexOf(" "));
        santaData.surnameSanta = text.slice(text.indexOf(" ") + 1);
        const receiverData = await request('/api/getreceiver', 'POST', santaData);
        let data = await receiverData.json();
        $(".msg").append(`<p class="receiverData">Your receiver : ${data.name} ${data.surname}</p><p class="receiverData">His wish : <br> ${data.wish.replace(/, /g, "<br>")}`);
    });
    return false;
});

$('#restartGame').on('click', async (event) => {
    let res = await request('/api/restart');
    location.reload();
});

const request = async (url, method = 'GET', data = null) => {
    let body;
    if (data) {
        body = JSON.stringify(data)
    }

    let response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body
    });
    return response;
}

function random(min, max) {
    let rand = Math.random();
    let rand1 = (rand * (max - min + 1)) + min;
    let rand2 = Math.floor(rand1);
    return rand2;
}