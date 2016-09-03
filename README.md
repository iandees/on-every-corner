# On Every Corner
Find road intersections (aka [taco truck locations](http://www.nytimes.com/2016/09/03/us/politics/taco-trucks-on-every-corner-trump-supporters-anti-immigration-warning.html)) in OSM data.

## Running

Assuming an EC2 Ubuntu 14.04 machine:

1. [Install node](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) and git

    ```bash
    sudo apt-get install git
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

1. Clone this repo

    ```bash
    git clone https://github.com/iandees/on-every-corner.git
    ```

1. Install dependencies

    ```bash
    cd on-every-corner
    npm install
    ```

1. Download the [OSM QA Tiles](https://osmlab.github.io/osm-qa-tiles/) extract for your area of interest

    ```bash
    wget https://s3.amazonaws.com/mapbox/osm-qa-tiles/latest.country/united_states_of_america.mbtiles.gz
    gzip -d united_states_of_america.mbtiles.gz
    ```

1. **Optionally** modify `index.js` to comment out or change the `bbox` parameter to restrict the area of interest.

1. Run the script. It will write to `stdout`, so if you want to save line-delimited GeoJSON features to a file, you'll have to redirect the output. Alternatively, you can pipe it straight to `tippecanoe` to generate data to map in something like Mapbox Studio.

    ```bash
    node index.js > intersections.geojson
    ```
