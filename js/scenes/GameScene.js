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
        console.log('create 1');
        this.createMap();
        this.createAudio();
        this.createGroups();
        // this.createWalls(); se paso al createGameManager
        // this.createPlayer(); se paso al createGameManager
        // this.addCollisions();       
        this.createInput();

        this.createGameManager();
    }
    
    createAudio() {
        // Si quicieramos que el sonido se loopeara tendriamos que 
        // pasarle un segundo parametro de config para decirle que va en 
        // loop el sonido ('goldSound', {loop:true}), tambien se le
        // puede pasar "volume" al que se le da un valor entre el 0 y el 
        // para indicar que tan fuerte queremos que suene. {volume: 0.2}
        this.goldPickupAudio = this.sound.add('goldSound');
    }
    
    createPlayer(location) {
        this.player = new Player(this, location[0] * 2, location[1] * 2, 'characters', 0);
    }
    
    createGroups() {
        console.log('createGroups 2');
        // Create a chest group
        // Sirve para crear un grupo de objetos que tendrán la misma funcionalidad como se ve en la fn "addCollision" donde se le agrega la funcionalidad de recolectarlos
        this.chests = this.physics.add.group();
        // Create a monster group
        this.monsters = this.physics.add.group();
        
    }
    
    spawnChest(chestObject) {
        // Buscara en el arreglo de objetos a ver si hay algun objeto desactivado y lo regresa
        // Esto para no estar creando un objeto nuevo cada vez que 
        // tomamos un cofre sino de reutilizar los inactivos una y otra vez. (más eficiente)
        let chest = this.chests.getFirstDead();
        if(!chest) {
            chest = new Chest(
                this,
                chestObject.x * 2,
                chestObject.y * 2,
                'items',
                0,
                chestObject.gold,
                chestObject.id
            );
            this.chests.add(chest);
        } else {
            chest.coins = chestObject.gold;
            chest.id = chestObject.id;
            chest.setPosition(chestObject.x * 2, chestObject.y * 2);
            chest.makeActive();
        }
        
    }

    spawnMonster(monsterObject) {
        // RODO: needs to be implemented
        let monster = this.monsters.getFirstDead();
        if(!monster) {
            monster = new Monster(
                this,
                monsterObject.x * 2,
                monsterObject.y * 2,
                'monsters',
                monsterObject.frame,
                monsterObject.id,
                monsterObject.health,
                monsterObject.maxHealth
            );
            this.monsters.add(monster);
        } else {
            monster.id = monsterObject.id;
            monster.health = monsterObject.health;
            monster.maxhealth = monsterObject.maxhealth;
            monster.setTexture('monsters', monsterObject.frame);
            monster.setPosition(monsterObject.x * 2, monsterObject.y * 2);
            monster.makeActive();
        }
    }
    
    // createWalls() {
    //     this.wall = this.physics.add.image(500, 100, 'button1');
    //     this.wall.setImmovable(); // Si se pone que sea inmovibble ya no se podra empuyjar al tocarlo
    // }
    
    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    addCollisions() {
        console.log('addCollisions 4');
        // Un collider es un objeto con el que se puede chocar
        // Le decimos al personaje que choke con nuestra capa de blokes
        this.physics.add.collider(this.player, this.map.blockedLayer);
        // Un overlap es un objeto que lanza una función al pasar por encima
        this.physics.add.overlap(
            this.player,
            // Al agregar el grupo de "chests" todos los que se creen en ese grupo, tendran esta funcionalidad
            this.chests,
            this.collectChest,
            null,
            this
        );
        
        // Funciones para los mobs
        this.physics.add.collider(this.monsters, this.map.blockedLayer);
        this.physics.add.overlap(
            this.player,
            this.monsters,
            this.enemyOverlap,
            null,
            this
        );
    }

    enemyOverlap(player, enemy) {
        // console.log(enemy);
        enemy.makeActive();
        this.events.emit('destroyEnemy', enemy.id);
    }
    
    collectChest (player, chest) {
        console.log('collectChest');
        
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
        
        this.events.emit('pickUpChest', chest.id);
    }
    
    update() {
        // Revisamos si el jugador ya existe antes de poder moverse o mandará error
        if (this.player) {
            this.player.update(this.cursors);
        }
    }

    createMap() {
        // Create the map
        this.map = new Map(this, 'map', 'background', 'background', 'blocked');
    }

    createGameManager() {
        console.log('createGameManager 3');
        this.events.on('spawnPlayer', location => {
            this.createPlayer(location);
            this.addCollisions();
        });

        this.events.on('chestSpawned', chest => this.spawnChest(chest) );

        this.events.on('monsterSpawned', monster => this.spawnMonster(monster) );

        /* Creamos el game manager y le pasamos la scene y los objetos creados el Tiled */
        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }
}