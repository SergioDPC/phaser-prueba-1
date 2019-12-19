class UiScene extends Phaser.Scene {
    constructor() {
        super('Ui');
    }
    
    init() {
        // Grab a reference to the game scene
        this.gameScene = this.scene.get('Game');
    }

    
    create() {
        this.setupUiElements();
        this.setupEvents();
    }
    
    setupUiElements() {
        // Create the score text dame object
        this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });
        // Create coin icon
        this.coinIcon = this.add.image(15,15, 'items', 3);
    }
    
    setupEvents() {
        // Listen for the updateScore event from the game scene
        // Agarramos es que tomamos una referencia de la scene 'Game'
        // Y cuando esta scene lanza un evento lo escucho con esto y
        // Puedo lanzar una función
        this.gameScene.events.on('updateScore', score => {
            this.scoreText.setText(`Coins: ${score}`);
        });
    }
    
}