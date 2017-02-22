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
            imageSettings: {
                statFrame: true,
                psFrame: true,
                statIcons: true,
                imageSize: "auto",
                gradient: true
            },
            layoutSettings: {
                xOffset: 50,
                yOffset: 50,
                xSize: 50,
                ySize: 50
            },
            file: "",
            originalImage: "",
            renderedImage: "",
            ship: "Ship",
            pilotname: "Name of your Pilot",
            cardtext: "Rules here!"
        },
        statsVisible: true,
        customVisible: false
    },
    // MAKE THE PREVIEW IMAGE A DIFFERENT FROM THE RENDERPREVIEW AND SWAP THEM ON THE RENDER BUTTON CLICK
    watch: {
        "card.actions": {
            handler: function (newVal, oldVal) {
                this.renderPreview();
            },
            deep: true
        },
        "card.stats": {
            handler: function (newVal, oldVal) {
                this.renderPreview();
            },
            deep: true
        },
        "card.ship": {
            handler: function(){
                this.renderPreview();
            }
        },
        "card.pilotname": {
            handler: function(){
                this.renderPreview()
            }
        },
        "card.cardtext": {
            handler: function(){
                this.renderPreview();
            }
        },
        "card.imageSettings.gradient": {
            handler: function(){
                this.renderPreview();
            }
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
        saveImage: function () {
            var ipc = require('electron').ipcRenderer;
            var imageData = $('#render').css('background-image').split(',')[1];
            ipc.send('save', imageData);
        },
        _createCanvas: function () {
            var that = this;
            var node = document.getElementById('pilot');
            domtoimage.toPng(node)
                .then((dataUrl) => {
                    // $('#render').css("background-image", 'url(' + dataUrl + ')');
                    this.$data.card.renderedImage = dataUrl;
                    that.resizePreview();
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
        },
        renderManualImage: function(){
            var that = this;
            var node = document.getElementById('manualImage');
            domtoimage.toPng(node)
                .then((dataUrl) => {
                    // $('#render').css("background-image", 'url(' + dataUrl + ')');
                    this.$data.card.renderedImage = dataUrl;
                    that.resizePreview();
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
        },
        readImage: function (event) {
            var reader = new FileReader();
            var file = event.target.files[0];
            if (file) {
                reader.readAsDataURL(file);
            }
            reader.addEventListener("load", function () {
                $(".pilot")
                    .css("background-image", "url(" + reader.result + ")");
                this.$data.card.originalImage = reader.result;
                this.renderPreview();
            }.bind(this), false);
        }
    },
    mounted: function () {
        this._createCanvas();
        window.addEventListener('resize', (event) => {
            this.resizePreview();
        })
    }
})