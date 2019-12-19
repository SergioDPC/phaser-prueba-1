class Player extends Phaser.Physics.Arcade.Image {
    // Cunado se tiene una clase que extiende el "Phaser game object class"
    // El Update ya no se llama automaticamente.
    // Y si queremos que haya una funcionb que se llame automaticamente tenemos que correrlo manualmente
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        // Scene al que el jugador será añadido
        this.scene = scene;
        // Velocidad a la que se mueve el personaje
        this.velocity = 160;
        
        // Activar las pisicas
        this.scene.physics.world.enable(this);
        
        // Set immovable if another object collides with our player (default True)
        this.setImmovable(false);
        
        // Scale our player
        this.setScale(2);
        // Evita que el jugador deje la pantalla
        this.setCollideWorldBounds(true);
        // Add the player to our existing scene 
        // Sin esta linea el personaje se crearia pero no estaría unido a la esena actual
        this.scene.add.existing(this);
        // Have the camera follow the player
        this.scene.cameras.main.startFollow(this);
    }
    
    update(cursors) {
        switch(true) {
            case (cursors.left.isDown):
                this.body.setVelocityX(-this.velocity);
                break;
            case (cursors.right.isDown):
                this.body.setVelocityX(this.velocity);
                break;
            default:
                this.body.setVelocityX(0);
        }

        switch(true) {
            case (cursors.up.isDown):
                this.body.setVelocityY(-this.velocity);
                break;
            case (cursors.down.isDown):
                this.body.setVelocityY(this.velocity);
                break;
            default:
                this.body.setVelocityY(0);
        } 
    }
}