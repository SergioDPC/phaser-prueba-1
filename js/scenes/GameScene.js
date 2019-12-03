class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.score = 0;
    }
    
    init() { // Este se lanza despues de que se ha iniciado la ecena
        // Cuando usamos el metodo "launch" en vez del "start" Phaser
        // Lanza la ecena en paralelo en vez de apagar la anterior e iniciar la nueva.
        this.scene.launch('Ui');
    }
    
    create() {
        this.createAudio();
        this.createChests();
        this.createWalls();
        this.createPlayer();
        this.addCollisions();       
        this.createInput();
    }
    
    createAudio() {
        // Si quicieramos que el sonido se loopeara tendriamos que 
        // pasarle un segundo parametro de config para decirle que va en 
        // loop el sonido ('goldSound', {loop:true}), tambien se le
        // puede pasar "volume" al que se le da un valor entre el 0 y el 
        // para indicar que tan fuerte queremos que suene. {volume: 0.2}
        this.goldPickupAudio = this.sound.add('goldSound');
    }
    
    createPlayer() {
        this.player = new Player(this, 32, 32, 'characters', 0);
    }
    
    createChests() {
        // Create a chest group
        // Sirve para crear un grupo de objetois que tendrán la misma funcionalidad como se ve en la fn "addCollision" donde se le agrega la funcionalidad de recolectarlos
        this.chests = this.physics.add.group();
        // Create Chest positions arrays
        this.chestPositions= [[100, 100], [200, 200], [300, 300], [292, 124]]
        this.maxNumberOfChests = 3;
        for(let i = 0; i < this.maxNumberOfChests; i += 1) {
            // Span a chest
            this.spawnChest();
        }
        
    }
    
    spawnChest() {
        const location = this.chestPositions[
            Math.floor(Math.random() * this.chestPositions.length)
        ];
        // Buscara en el arreglo de objetos a ver si hay algun objeto desactivado y lo regresa
        // Esto para no estar creando un objeto nuevo cada vez que 
        // tomamos un cofre sino de reutilizar los inactivos una y otra vez. (más eficiente)
        let chest = this.chests.getFirstDead();
        if(!chest) {
            const chest = new Chest(
                this, location[0], location[1], 'items', 0
            );
            this.chests.add(chest);
        } else {
            chest.setPosition(location[0], location[1]);
            chest.makeActive();
        }
        
    }
    
    createWalls() {
        this.wall = this.physics.add.image(500, 100, 'button1');
        this.wall.setImmovable(); // Si se pone que sea inmovibble ya no se podra empuyjar al tocarlo
    }
    
    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    addCollisions() {
        // Un collider es un objeto con el que se puede chocar
        this.physics.add.collider(this.player, this.wall);
        // Un overlap es un objeto que lanza una función al pasar por encima
        this.physics.add.overlap(
            this.player,
            // Al agregar el grupo de "chests" todos los que se creen en ese grupo, tendran esta funcionalidad
            this.chests,
            this.collectChest,
            null,
            this
        );
    }
    
    collectChest (player, chest) {
        // Emite el sonido de recolección del tesoro
        this.goldPickupAudio.play();
        // Update score
        this.score += chest.coins;
        // actualiza el score en el UI
        this.events.emit('updateScore', this.score);
        // Destruye el objeto del cofre
        /* chest.destroy(); */
        // Inactivamos el cofre en ves de destruirlo
        chest.makeInactive();
        // Spawn a new chest
        this.spawnChest();
    }
    
    update() {
        this.player.update(this.cursors);
    }
}