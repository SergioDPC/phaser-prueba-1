class GameManager {
    constructor(scene, mapData) {
        // Scene a la que pertenece
        this.scene = scene;
        // Array of layers that has the game data we need
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};
        // Lugares donde puede aparecer el jugador
        this.playerLocations = [];
        // Lugares donde puede aparecer un cofre
        this.chestLocations = {};
        // Lugares donde puede aparecer un mob
        this.monsterLocations = {};
    }

    setup() {
        this.parseMapData();
        this.setupEventListener();
        this.setupSpawners();
        this.spawnPlayer();
    }

    parseMapData() {
        /* Conseguiremos todas las ubicaciones donde puede aparecer algo como:
            - el player
            - los chest
            - los mobs
        */
        // console.log(this.mapData);
        this.mapData.forEach(layer => {
            switch (true) {
                case (layer.name === 'player_locations'):
                    layer.objects.forEach(obj => {
                        this.playerLocations.push([obj.x, obj.y]);
                    });
                    break;
            
                case (layer.name === 'chest_locations'):
                    layer.objects.forEach(obj => {
                        if (this.chestLocations[obj.properties.spawner]) {
                            this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
                        } else {
                            this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
                        }
                    });
                    break;

                case (layer.name === 'monster_locations'):
                    layer.objects.forEach(obj => {
                        if (this.monsterLocations[obj.properties.spawner]) {
                            this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
                        } else {
                            this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
                        }
                    });
                    break;
            }
        });
        // console.log(this.playerLocations);
        // console.log(this.chestLocations);
        // console.log(this.monsterLocations);
    }

    setupEventListener() {
        this.scene.events.on('pickUpChest', chestId => {
            // Udate the spawner
            if(this.chests[chestId]) {
                this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
            }
        });

        this.scene.events.on('destroyEnemy', enemyId => {
            // Udate the spawner
            if(this.monsters[enemyId]) {
                this.spawners[this.monsters[enemyId].spawnerId].removeObject(enemyId);
            }
        });
    }

    setupSpawners() {
        const config = {
            spawnInterval: 3000,
            limit: 3,
            spawnerType: SpawnerType.CHEST,
            id: ''
        };
        let spawner;
        // Create chest spawners
        Object.keys(this.chestLocations).forEach(key => {
            config.id = `chest-${key}`;
            spawner = new Spawner(
                config,
                this.chestLocations[key],
                this.addChest.bind(this),
                this.deleteChest.bind(this)
            );

            this.spawners[spawner.id] = spawner;
        });

        // Create monster spawner
        Object.keys(this.monsterLocations).forEach(key => {
            config.id = `monster-${key}`;
            config.spawnerType = SpawnerType.MONSTER;
            spawner = new Spawner(
                config,
                this.monsterLocations[key],
                this.addMonster.bind(this),
                this.deleteMonstrer.bind(this)
            );

            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const location = this.playerLocations[Math.floor(Math.random() * this.playerLocations.length)];
        this.scene.events.emit('spawnPlayer', location);
    }

    addChest(chestId, chest) {
        this.chests[chestId] = chest;
        this.scene.events.emit('chestSpawned', chest);
    }

    deleteChest(chestId) {
        delete this.chests[chestId];
    }

    addMonster(monsterId, monster) {
        this.monsters[monsterId] = monster;
        this.scene.events.emit('monsterSpawned', monster);
    }

    deleteMonstrer(monsterId) {
        delete this.monsters[monsterId];
    }
}