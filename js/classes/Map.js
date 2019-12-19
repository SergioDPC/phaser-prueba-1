class Map {
    constructor(scene, key, tileSetName, bgLayerName, blockedLayerName) {
        // The scene this map belongs to
        this.scene = scene;
        // Tiled JSON file key name (nombre que le damos)
        this.key = key;
        // Tiled Tilset image key name
        this.tileSetName = tileSetName;
        // The name of the layer created in Tiled for the map background
        this.bgLayerName = bgLayerName;
        // The name of the layer created in Tiled for the blocked areas
        this.blockedLayerName = blockedLayerName;
        
        this.createMap();
    }

    createMap() {
        // Create the Tile map. We pass the name we wanted to give it (key is the name)
        this.map = this.scene.make.tilemap({ key: this.key });

        // Add the tileset image to the map
        this.tiles = this.map.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2);
        
        // Create the backgroun layer
        this.backgroundLayer = this.map.createStaticLayer(this.bgLayerName, this.tiles, 0, 0);
        this.backgroundLayer.setScale(2);
        
        // Create blocked layer
        this.blockedLayer = this.map.createStaticLayer(this.blockedLayerName, this.tiles, 0, 0);
        this.blockedLayer.setScale(2);
        // Todos los que cuadros que tengan [-1] seran barreras
        this.blockedLayer.setCollisionByExclusion([-1]);

        // Update de world limit bounds
        // La razon de porque lo escallamos * 2 es porque hicimos la escala * 2
        this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
        this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

        // Limit the camera to the size of the map
        this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);
    }
}