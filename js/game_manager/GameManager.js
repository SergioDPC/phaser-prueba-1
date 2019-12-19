class GameManager {
    constructor(scene, mapData) {
        // Scene a la que pertenece
        this.scene = scene;
        // Array of layers that has the game data we need
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
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

    }

    setupSpawners() {

    }

    spawnPlayer() {
        const location = this.playerLocations[Math.floor(Math.random() * this.playerLocations.length)];
        console.log(location);
        this.scene.events.emit('spawnPlayer', location);
    }
}