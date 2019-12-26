class Monster extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame, id, health, maxHealth) {
        super(scene, x, y, key, frame);
        this.scene= scene;
        this.x = x;
        this.y = y;
        this.key  = key;
        this.id = id;
        this.health = health;
        this.maxHealth = maxHealth;

        // Activar las pisicas
        this.scene.physics.world.enable(this);
        
        // Set immovable if another object collides with our monster (default True)
        this.setImmovable(false);
        
        // Scale our monster
        this.setScale(2);
        // Evita que el mob deje la pantalla
        this.setCollideWorldBounds(true);
        // Add the mob to our existing scene 
        // Sin esta linea el mob se crearia pero no estaría unido a la esena actual
        this.scene.add.existing(this);
    }

    makeActive() {
        // Hace activo el objeto
        this.setActive(true);
        // Hace visible el objeto
        this.setVisible(true);
        // Permite las coliciones con el objeto
        this.body.checkCollision.none = false;
    }
    
    makeInactive() {
        // Inactiva el objeto
        this.setActive(false);
        // Hace invicible el objeto
        this.setVisible(false);
        // Desactiva las coliciones con el objeto
        this.body.checkCollision.none = true;
    }
}