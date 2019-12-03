class UiButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, hoverKey, text, targetCallback) {
        super(scene, x, y);
        this.scene = scene; // The scene this container will be added to
        this.x = x; // The x position of the container
        this.y = y; // The y position of the container
        this.key = key; // The background image of the button
        this.hoverKey = hoverKey; // The image at hover button
        this.text = text; // Text of the button
        this.targetCallback = targetCallback; // Callback of the button
        
        // Create the Ui Button
        this.createButton();
        // Add this container to our Phaser Scene
        this.scene.add.existing(this);
    }
    
    createButton() {
        this.button = this.scene.add.image(0, 0, 'button1'); // las imagenes no se pueden animar
        // Con el "setInteractive" podemos darle funciones de interactividad al boton en este caso como las de abajo de 'pointerdown', 'pointerover', etc.
        this.button.setInteractive();
        // Scale button
        this.button.setScale(1.4)
        
        // Create the button text
        this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '26px', fill: '#fff' });
        // Esta linea nos ayuda a alinear dentro de un objeto otro objeto, en este caso el texto del boton dentro del boton
        Phaser.Display.Align.In.Center(this.buttonText, this.button);
        
        // Add the 2 game objects to the container
        this.add(this.button);
        this.add(this.buttonText);
        
        
        this.button.on('pointerdown', () => {
            this.targetCallback();
        });
        
        this.button.on('pointerover', () => {
            this.button.setTexture(this.hoverKey);
        });
        
        this.button.on('pointerout', () => {
            this.button.setTexture(this.key);
        });
    }
}
