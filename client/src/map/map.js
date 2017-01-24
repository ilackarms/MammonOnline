var Map = function(game, name, diabloStyle, debugMode){
    var mapData = game.cache.getJSON(name);
    //initialize map
    var map = new Array(mapData.layers.length);
    for (var l = 0; l < mapData.layers.length; l++){
        map[l] = new Array(mapData.width);
        for (var x = 0; x < mapData.width; x++) {
            map[l][x] = new Array(mapData.height);
        }
    }
    for (l = 0; l < mapData.layers.length; l++){
        var i = 0;
        for (var y = 0; y < mapData.height; y++) {
            for (var x = 0; x < mapData.width; x++) {
                map[l][x][y] = {
                    img: mapData.layers[l].data[i],
                    visible: mapData.layers[l].visible
                };
                i++;
            }
        }
    }

    this._name = name;
    this._map = map;
    this._jsonData = mapData;
    this._game = game;
    this._diabloStyle = diabloStyle;
    this._tilesets = mapData.tilesets;
    this._initialized = false;
    this._debugMode = debugMode;
};

Map.prototype._findTileset = function (i) {
    //find the right tileset
    var tileset;
    for (var t = 0; t < this._tilesets.length; t++) {
        //(dont forget to adjust for the -1)
        if (i < this._tilesets[t].firstgid-1) {
            break;
        }
        //keep picking tilesets until
        //the first tileset whose starting index
        //is after our own
        tileset = this._tilesets[t];
    }
    return tileset;
};

//call after loading of images is complete
Map.prototype._init = function () {
    //link each tileset to its image in the cache
    for (var i = 0; i < this._tilesets.length; i++) {
        this._tilesets[i].image = this._game.cache.getImage(this._tilesets[i].name);
    }

    //get highest index of tile image used by this map
    var tilecount = 0;
    for (var i = 0; i < this._jsonData.layers.length; i++) {
        for (var j = 0; j < this._jsonData.layers[i].data.length; j++) {
            if (tilecount < this._jsonData.layers[i].data[j]) {
                tilecount = this._jsonData.layers[i].data[j];
            }
        }
    }

    //split tileset up into individual bmds
    var lowerTileImages = new Array(tilecount);
    var upperTileImages = new Array(tilecount);
    for (i = 0; i < tilecount; i++){
        var tileset = this._findTileset(i);

        var width = tileset.tilewidth,
            height = tileset.tileheight;
        //local index into this tileset
        var localindex = i - (tileset.firstgid-1);
        var x0 = (localindex % tileset.columns) * (width + tileset.spacing),
            y0 = (Math.floor(localindex / tileset.columns)) * (height + tileset.spacing);
        var lowerBMD = this._game.make.bitmapData(width, height);
        lowerBMD.context.drawImage(tileset.image, x0, y0, width, height, 0, 0, width, height);
        if (this._debugMode) {
            lowerBMD.context.strokeStyle = "#FF0000";
            lowerBMD.context.beginPath();
            lowerBMD.context.moveTo(0, height-32);
            lowerBMD.context.lineTo(64, height-64);
            lowerBMD.context.lineTo(128, height-32);
            lowerBMD.context.lineTo(64, height-0);
            lowerBMD.context.lineTo(0, height-32);
            lowerBMD.context.stroke();
            lowerBMD.context.closePath();
        }
        lowerTileImages[i] = {
            bmd: lowerBMD,
            tileset: tileset
        };

        var upperBMD = this._game.make.bitmapData(width, height);
        upperBMD.context.save();
        upperBMD.context.beginPath();
        upperBMD.context.moveTo(0, 0);
        //the minuses are amanual adjustment because
        //some tiles go over the strict diamond shape
        upperBMD.context.lineTo(0, height - 1/2 * this._jsonData.tileheight - 4);
        upperBMD.context.lineTo(this._jsonData.tilewidth/2, height - this._jsonData.tileheight - 8);
        upperBMD.context.lineTo(this._jsonData.tilewidth, height - 1/2 * this._jsonData.tileheight -4);
        upperBMD.context.lineTo(this._jsonData.tilewidth, 0);
        upperBMD.context.lineTo(0, 0);
        upperBMD.context.clip();
        upperBMD.context.drawImage(tileset.image, x0, y0, width, height, 0, 0, width, height);
        upperBMD.context.closePath();
        upperBMD.context.restore();
        //only add upper bmd if it contains visible pixels
        // (otherwise it only has a lower portion)
        if (isVisible(upperBMD.context, width, height)) {
            upperTileImages[i] = {
                bmd: upperBMD,
                tileset: tileset
            };
        }
        // console.log(i, "=", x0, ",", y0);
    }

    this._lowerTiles = lowerTileImages;
    this._upperTiles = upperTileImages;
};

Map.prototype.draw = function (offsetX, offsetY, lower) {
    if (!this._initialized) {
        this._init();
    }

    var start = 0;
    for (var l = start; l < this._map.length; l++) {
        var layer = this._map[l];
        for (var x = 0; x < layer.length; x++) {
            var column = layer[x];
            for (var y = 0; y < column.length; y++) {
                if (!column[y].visible && !this._debugMode) {
                    continue;
                }
                var tile = column[y].img - 1; //the strange way Tiled stores tile index
                if (tile < 0) {
                    continue;
                }
                var tileset = this._findTileset(tile);
                var width = this._jsonData.tilewidth;
                var height = this._jsonData.tileheight;

                var screenX = (x - y) * width / 2,
                    screenY = (x + y) * height / 2;

                var sourceTile;
                if (lower) {
                    sourceTile = this._lowerTiles[tile];
                } else {
                    sourceTile = this._upperTiles[tile];
                    //the upper part of this tile has notihng visible to it
                    if (!sourceTile) {
                        continue;
                    }
                }

                var finalBMD = this._game.make.bitmapData(tileset.tilewidth, tileset.tileheight);
                finalBMD.copy(sourceTile.bmd, 0, 0);

                //for larger than regular tile size
                //gotta make sure we draw the tile at the right spot
                var shiftX = finalBMD.width - width,
                    shiftY = finalBMD.height - height;

                // if (Scene.Properties.DEBUG_MODE && lower) {
                if (this._debugMode) {
                    finalBMD.context.font = "15px Georgia";
                    finalBMD.context.fillStyle = "white";
                    finalBMD.context.fillText(x + "," + y, width/2, height * 2/6 + shiftY);
                }
                this._game.add.image(screenX + offsetX - shiftX, screenY + offsetY - height * 14/16 - shiftY, finalBMD);
                console.log(".");
            }
        }
    }
};

function isVisible(context, width, height) {
    var imgData = context.getImageData(0, 0, width, height).data;
    for (var i = 3; i < imgData.length; i+=4) {
        if (imgData[i] !== 0) {
            return true;
        }
    }
    return false;
}

module.exports = {Map: Map};