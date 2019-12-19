var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ 
        // Cuando se pasa un arreglo de ecenas, Phaser corre solo la primera.
        BootScene,
        TitleScene,
        GameScene,
        UiScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
        debug: true,
            gravity: {
                y: 0
            }
        }
    },
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);
