class Chest extends Phaser.Physics.Arcade.Image {
    // Cunado se tiene una clase que extiende el "Phaser game object class"
    // El Update ya no se llama automaticamente.
    // Y si queremos que haya una funcionb que se llame automaticamente tenemos que correrlo manualmente
    constructor(scene, x, y, key, frame, coins, id) {
        super(scene, x, y, key, frame);
        // Scene donde el objeto será añadido
        this.scene = scene;
        // Cantidad de coins que da el chest da
        this.coins = coins;
        // Usaremos el Id para avisart el GameManager cuando haya sido tomado y pueda ser eliminado
        this.id = id;
        
        // Activar las pisicas
        this.scene.physics.world.enable(this);
    
        // Add the player to our existing scene 
        // Sin esta linea el personaje se crearia pero no estaría unido a la esena actual
        this.scene.add.existing(this);
        // Scale the chest game object
        this.setScale(2);
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