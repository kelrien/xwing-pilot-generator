var app = new Vue({
    el: '#main',
    data: {
        card: {
            actions: {
                focus: false,
                targetlock: false,
                barrelroll: false,
                boost: false,
                arc: false,
                cloak: false,
                evade: false,
                slam: false,
            },
            stats: {
                pilotskill: "1",
                attack: "1",
                defense: "1",
                shields: "1",
                hull: "1"
            },
            file: "",
            originalImage: "",
            renderedImage: "",
            ship: "Ship",
            pilotname: "Name of your Pilot",
            cardtext: "Rules here!"
        },
        statsVisible: true
    },
    watch: {
        card: {
            handler: function (newVal, oldVal) {
                this.renderPreview();
            },
            deep: true
        }
    },
    methods: {
        renderPreview: function () {
            var that = this;
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    that._createCanvas();
                }, 250);
            } else {
                clearInterval(this.timer);
                this.timer = setTimeout(() => {
                    that._createCanvas();
                }, 250);
            }
        },
        resizePreview: function () {
            var magicRatio = 0.79357142857;
            var width = document.getElementById('render').clientHeight * magicRatio + "px";
            $('#render').css("width", width);
        },
        _createCanvas: function () {
            var that = this;
            var node = document.getElementById('pilot');
            domtoimage.toPng(node)
                .then(function (dataUrl) {
                    $('#render').css("background-image", 'url(' + dataUrl + ')');
                    that.resizePreview();
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
        },
        readImage: function (event) {
            var reader = new FileReader();
            var file = event.target.files[0];
            reader.addEventListener("load", function () {
                $(".pilot")
                    .css("background-image", "url(" + reader.result + ")");
                this.$data.card.originalImage = reader.result;
            }.bind(this), false);

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }
})