class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    
    preload() {
        this.loadImages();
        this.loadSpritesheets();
        this.loadAudio();
        this.loadTileMap();
    }
    
    loadImages() {
        this.load.image('button1', 'assets/images/ui/blue_button01.png');
        this.load.image('button2', 'assets/images/ui/blue_button02.png');
        // Load the Tile map image
        this.load.image('background', 'assets/level/background-extruded.png');
    }
    
    loadSpritesheets() {
        this.load.spritesheet('items', 'assets/images/items.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('characters', 'assets/images/characters.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('monsters', 'assets/images/monsters.png', {
            frameWidth: 32, frameHeight: 32
        });
    }
    
    loadAudio() {
        // Al cargar un audio se le pasa un arreglo del mismo sonido en diferentes formatos y Faser elije el adecuado para cada navegador.
        this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
    }

    loadTileMap() {
        // Map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map','assets/level/large_level.json');
    }
    
    create() {
        this.scene.start('Game');
        // this.scene.start('Title');
    }
    
}