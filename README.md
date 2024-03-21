# IPFS Cluster test

## Using Quickstart guide
- following this [guide](https://ipfscluster.io/documentation/quickstart/)

### Set up
- ``docker-compose up`` in root folder of repo
- open new terminal and execute the ``commands`` listed below

### Commands
- ``./ipfs-cluster-ctl/ipfs-cluster-ctl peers ls`` --> show information about the peers in the cluster
- ``./ipfs-cluster-ctl/ipfs-cluster-ctl add somefile`` --> add a file to the cluster
- ``./ipfs-cluster-ctl/ipfs-cluster-ctl pin add /ipns/ipfscluster.io`` --> pin the cluster website
- ``./ipfs-cluster-ctl/ipfs-cluster-ctl status <cid>`` --> use the CID shown above to see the status in every peer
- ``./ipfs-cluster-ctl/ipfs-cluster-ctl pin ls <cid>`` --> inspect the pin information

### End tests
- ``docker-compose kill`` --> end manual testing



## Using ipfs-cluster-service
- follow this guide to start a collaborative cluster: [guide](https://ipfscluster.io/documentation/collaborative/setup/)

### Commands
- ``./ipfs-cluster-service/ipfs-cluster-service init --consensus crdt`` --> init cluster


## Workflow
1. leader inits own cluster using [Quickstart](#using-quickstart-guide)
2. leader inits collaborative cluster for shared storage (see [here](https://ipfscluster.io/documentation/collaborative/setup/)):
    1. run ``./ipfs-cluster-service/ipfs-cluster-service init --consensus crdt``
    2. create configuration template for followers
    3. distribute confiuigration template


