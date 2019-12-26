class Spawner {
    constructor(config, spawnLocations, addObject, deleteObject) {
        this.id = config.id;
        // Tiempo entre spawns
        this.spawnInterval = config.spawnInterval;
        // Cuantas gameObjects maximo puede crear en cada ocacion
        this.limit = config.limit;
        // Indica si se usará para crear un chest o un mob
        this.objectType = config.spawnerType;
        // Donde va a aparecer
        this.spawnLocations = spawnLocations;
        /* Estas 2 nos permitiran comunicarnos entre el GameManager y el Spawner
        Porque el GameManager también sigue los chest y mobs creados y estos tienen 
        que estar actualizado en los 2 */
        // Funcion externa para añadir objetos
        this.addObject = addObject;
        // Funcion externa para eliminar objetos
        this.deleteObject = deleteObject;

        this.objectsCreated = [];

        this.start();
    }

    // Creará un intervalo que servirá para crear los objetos
    start() {
        this.interval = setInterval(() => {
            if(this.objectsCreated.length < this.limit) {
                this.spawnObject();
            }
        }, this.spawnInterval);
    }

    spawnObject() {
        if (this.objectType === SpawnerType.CHEST) {
            this.spawnChest();
        } else if (this.objectType === SpawnerType.MONSTER) {
            this.spawnMonster();
        }
    }

    spawnChest() {
        const location = this.pickRandomLocation();
        const chest = new ChestModel(
            location[0],
            location[1],
            randomNumber(10, 20),
            this.id,
            randomNumber(0, 20),
            randomNumber(3, 5),
            1
        );
        this.objectsCreated.push(chest);
        this.addObject(chest.id, chest);
    }

    spawnMonster() {
        const location = this.pickRandomLocation();
        const monster = new MonsterModel(location[0], location[1], randomNumber(10, 20), this.id);
        this.objectsCreated.push(monster);
        this.addObject(monster.id, monster);
    }

    pickRandomLocation() {
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        /* El '.some' en un arreglo mapea objeto por objeto y cuando uno retorna 'true' se detiene */
        const invalidLocation = this.objectsCreated.some(obj => {
            if (obj.x === location[0] && obj.y === location[1]) {
                return true;
            }
            return false;
        });

        if(invalidLocation) {
            return this.pickRandomLocation;
        }
        return location;
    }

    removeObject(id) {
        this.objectsCreated = this.objectsCreated.filter(obj => obj.id !== id);
        this.deleteObject(id);
    }
}