var pilotcard, originalImage;
var ipc = require('electron').ipcRenderer;
// multiply this with the height of an image to get the correct aspect ratio for a card
var magicRatio = 0.79357142857;

var tokens = {
    "focus": "f",
    "targetlock": "l",
    "barrelroll": "r",
    "cloak": "k",
    "boost": "b",
    "evade": "e",
    "arc": "R",
    "slam": "s"
}

function saveImage() {
    var imageData = $('#render').css('background-image').split(',')[1];
    ipc.send('save', imageData);
}

$(function () {

    $(window).resize(function () {
        var elem = $('#render')
        elem.width(elem.height() * magicRatio);
    });

    $('.statsbutton').click(function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $('.settingsbutton').removeClass("active");
            $('.settings').css("display", "none");
            $('.stats').css("display", "block");
        }
    });

    $('.settingsbutton').click(function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $('.statsbutton').removeClass("active");
            $('.stats').css("display", "none");
            $('.settings').css("display", "block");
        }
    });

    pilotcard = $('#pilot');
    exportPng();

    $('input').change(function () {
        redraw(this);
    });
    $('#name, textarea').change(function () {
        redraw(this);
    });
});

function redraw(item) {
    item = $(item);
    switch (item.attr("name")) {
        case "gradient":
            var grad = "linear-gradient( rgba(0,0,0,0) 0%,  rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 90%)";
            var noGrad = "linear-gradient( rgba(0,0,0,0) 0%,rgba(0,0,0,0.0) 100%)";
            var gradient = item[0].checked ? grad : noGrad;
            $("." + item.attr("name")).css("background", gradient);
            exportPng();
            break;

        case "focus":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.focus;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().toString().replace(tokens.focus, ""));
            }
            exportPng();
            break;

        case "targetlock":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.targetlock;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().replace(tokens.targetlock, ""));
            }
            exportPng();
            break;

        case "cloak":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.cloak;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().replace(tokens.cloak, ""));
            }
            exportPng();
            break;

        case "arc":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.arc;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().replace(tokens.arc, ""));
            }
            exportPng();
            break;

        case "evade":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.evade;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().replace(tokens.evade, ""));
            }
            exportPng();
            break;

        case "barrelroll":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.barrelroll;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().replace(tokens.barrelroll, ""));
            }
            exportPng();
            break;

        case "slam":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.slam;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().replace(tokens.slam, ""));
            }
            exportPng();
            break;

        case "boost":
            if (item[0].checked) {
                var bar = $('#iconbar').html() + tokens.boost;
                $('#iconbar').html(bar.split("").sort().join(""));
            } else {
                $('#iconbar').html($('#iconbar').html().replace(tokens.boost, ""));
            }
            exportPng();
            break;

        case "psbox":
            $("." + item.attr("name")).html(item.val());
            exportPng();
            break;

        case "pilot":
            var reader = new FileReader();
            var file = item[0].files[0];

            reader.addEventListener("load", function () {
                $("." + item.attr("name"))
                    .css("background-image", "url(" + reader.result + ")");
                originalImage = reader.result;
                exportPng();
            }.bind(this), false);

            if (file) {
                reader.readAsDataURL(file);
            }
            break;

        case "imagesize":
            if (item.val() === "manual") {
                $('#render').css("background-size", "100% 100%")
                    .css("background-image", "url(" + originalImage + ")");
            } else {
                $('#pilot').css("background", "url(" + originalImage + ") no-repeat center center")
                    .css("background-size", "cover");
                $('#render').css("background-size", "cover")
                    .css("background-image", "none")
                    .css("background-color", "black");
                exportPng();
            }
            break;

        case "psframe":
            var background = item[0].checked ? "rgba(0, 0, 0, 0.65)" : "transparent";
            $('.psbox').css("background-color", background);
            exportPng();
            break;

        case "statframe":
            var background = item[0].checked ? "rgba(0, 0, 0, 0.65)" : "transparent";
            $('.statscontainer').css("background-color", background);
            exportPng();
            break;

        case "staticons":{
            var stats = $('.statscontainer')
            item[0].checked ? stats.removeClass("none") : stats.addClass("none");
            exportPng();
            break;
        }

        default:
            $("." + item.attr("name")).html(item.val());
            exportPng();
    }
}

function exportPng() {
    var node = document.getElementById('pilot');
    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var width = $('#render').height() * magicRatio + "px"
            $('#render').css("background-image", 'url(' + dataUrl + ')')
                .css("width", width);
        })
        .catch(function (error) {
            error('oops, something went wrong!', error);
        });
}