var portraitRatio = 0.71428571428;
var landscapeRatio = 1.4;

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
                coordinate: false,
                reinforce: false
            },
            upgrades: {
                astromech: 'A',
                bombs: 'B',
                cannon: 'C',
                elite: 'E',
                illicit: 'I',
                missile: 'M',
                torpedo: 'P',
                system: 'S',
                turret: 'U',
                salvaged: 'V',
                crew: 'W',
                tech: 'X',
                title: 't',
                used: ''
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
                gradient: true,
                landscape: false
            },
            layoutSettings: {
                xOffset: 50,
                yOffset: 50,
                xSize: 50,
                ySize: 50,
                zoom: 100.00,
                xRatio: 1,
                yRatio: 1,
            },
            originalImage: "",
            renderedImage: "",
            ship: "Ship",
            pilotname: "Name of your Pilot",
            cardtext: "Rules here!"
        },
        statsVisible: true,
        customVisible: false,
        rendered: false
    },
    watch: {
        "card.actions": {
            handler: function (newVal, oldVal) {
                this.renderPreview();
            },
            deep: true
        },
        "statsVisible": {
            handler: function (newVal, oldVal) {
                this.renderManualImage();
            }
        },
        "card.stats": {
            handler: function (newVal, oldVal) {
                this.renderPreview();
            },
            deep: true
        },
        "card.ship": {
            handler: function () {
                this.renderPreview();
            }
        },
        "card.pilotname": {
            handler: function () {
                this.renderPreview()
            }
        },
        "card.cardtext": {
            handler: function () {
                this.renderPreview();
            }
        },
        "card.imageSettings.gradient": {
            handler: function () {
                this.renderPreview();
            }
        },
        "card.imageSettings.imageSize": {
            handler: function (newVal) {
                if (newVal == "manual") {
                    this.card.renderedImage = "";
                } else {
                    var node = document.getElementById('pilot');
                    node.style.backgroundSize = "cover";
                    this._createCanvas();
                }
            }
        },
        "card.layoutSettings": {
            handler: function () {
                this.card.renderedImage = "";
                this.rendered = false;
            },
            deep: true
        },
        "card.imageSettings": {
            handler: function () {
                if (this.card.imageSettings.imageSize === 'manual') {
                    if (this.rendered) {
                        this.renderPreview();
                    } else {
                        this.renderManualImage();
                    }
                } else {
                    this.renderPreview();
                }
            },
            deep: true
        },
        "card.layoutSettings.zoom": {
            handler: function () {
                if (this.card.imageSettings.landscape) {
                    if (this.card.layoutSettings.xRatio > this.card.layoutSettings.yRatio) {
                        this.card.layoutSettings.xSize = this.card.layoutSettings.zoom;
                        this.card.layoutSettings.ySize = this.card.layoutSettings.zoom * landscapeRatio * this.card.layoutSettings.yRatio;
                    } else {
                        this.card.layoutSettings.ySize = this.card.layoutSettings.zoom * landscapeRatio;
                        this.card.layoutSettings.xSize = this.card.layoutSettings.zoom * this.card.layoutSettings.xRatio;
                    }
                } else {
                    if (this.card.layoutSettings.xRatio > this.card.layoutSettings.yRatio) {
                        this.card.layoutSettings.xSize = this.card.layoutSettings.zoom;
                        this.card.layoutSettings.ySize = this.card.layoutSettings.zoom * portraitRatio * this.card.layoutSettings.yRatio;
                    } else {
                        this.card.layoutSettings.ySize = this.card.layoutSettings.zoom * portraitRatio;
                        this.card.layoutSettings.xSize = this.card.layoutSettings.zoom * this.card.layoutSettings.xRatio;
                    }
                }

            }
        }
    },
    computed: {
        manualImageVisible: function () {
            return !this.rendered && this.card.imageSettings.imageSize == "manual";
        },
    },
    methods: {
        addUpgrade: function(upgrade){
            this.card.upgrades.used += upgrade;
            this.renderPreview();
        },
        removeUpgrade: function(upgrade){
			var pos = this.card.upgrades.used.lastIndexOf(upgrade);
            this.card.upgrades.used = this.card.upgrades.used.substring(0,pos) + this.card.upgrades.used.substring(pos+1)
            this.renderPreview();
        },
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
            var render = $('#render');
            if (this.card.imageSettings.landscape) {
                render.css("height", "50%");
                var width = document.getElementById('render').clientHeight * landscapeRatio + "px";
                render.css("width", width);

            } else {
                render.css("height", "70%");
                var width = document.getElementById('render').clientHeight * portraitRatio + "px";
                render.css("width", width);
            }

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
        renderManualImage: function () {
            if (this.rendered) {
                return;
            }
            var that = this;
            var manualImage = document.getElementById('manualImage');
            if (manualImage) {
                pilot.setAttribute("style", manualImage.style.cssText);
                this.rendered = true;
                this._createCanvas();
            }
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
                var image = new Image();
                image.onload = function (event) {
                    this.card.layoutSettings.xRatio = event.target.width / event.target.height;
                    this.card.layoutSettings.yRatio = event.target.height / event.target.width;
                    if (event.target.height > event.target.width) {
                        this.card.layoutSettings.ySize = 100 * portraitRatio;
                        this.card.layoutSettings.xSize = this.card.layoutSettings.xRatio * 100;
                    } else {
                        this.card.layoutSettings.xSize = 100;
                        this.card.layoutSettings.ySize = this.card.layoutSettings.yRatio * 100 * portraitRatio;
                    }
                    this.renderPreview();
                }.bind(this);
                image.src = reader.result;
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