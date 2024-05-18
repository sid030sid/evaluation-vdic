# IPFS Cluster test

## Testing Verifiable Decentralized IPFS Cluster for off-chain storage with trustworth data permanency
In this repom, we test the...
1. read performance in VDICs depending on file size and number of nodes (vs. web3 storage vs. own node)
2. write performance in VDICs depending on file size and number of nodes (vs. web3 storage vs. own node)
3. average latency in VDICs depending on file size and number of node (latency = time needed for a file to fully replicate in VDIC)

NOTE: 
- number of nodes: {3, 5, 10, 15, 20}
- file size (in KB): {1, 10, 100, 1000, 10000}

## Perform tests
1. test pinning services:
    - open terminal and move to folder `test-suite-pinning-service`
    - to test moralis pinning service coded in `moralis-pinning-service.js`, run command `node moralis-write-test.js` and then run `node moralis-read-test.js`. These two commands resepctively populates the csv file `moralis-write-performance-measurements.csv` and `moralis-read-performance-measurements.csv`.
    - to test pinata pinning service coded in `pinata-pinning-service.js`, run command `node pinata-write-test.js` and then run `node pinata-read-test.js`. These two commands resepctively populates the csv file `pinata-write-performance-measurements.csv` and `pinata-read-performance-measurements.csv`.

2. test VDICs:
    - start running docker composition that runs IPFS Cluster with desired number of nodes (See folder `ipfs-clusters`)
    - move to folder: `vdic-gateway` in terminal
    - run gateway by entering in terminal ``npm start``
    - open another terminal and move to `vdic-gateway` folder and run command `node vdic-write-test.js <numberOfNodes>` to test writing data to VDIC
        - note 1: the number of nodes inputted must match the number of nodes of the ipfs cluster you are currently running in docker
        - note 2: re-running this command leads to the deletion of the measurements of the previous run
    - run command `node vdic-read-test.js <numberOfNodes>` to test reading of data in VDIC (do this after having performed write test)
        - note 1: the number of nodes inputted must match the number of nodes of the ipfs cluster you are currently running in docker
        - note 2: re-running this command leads to the deletion of the measurements of the previous run

### Set up
- run ``docker-compose up`` in terminal while being located in subfolder of folder `ipfs-clusters` (do this for each subfolder) 
    - note 1: in case you want to remove all files from an ipfs cluster: delete the compose folder in this repo, delete the docker folder and then re-run docker-compose up
    - note 2: we followed this [guide](https://ipfscluster.io/documentation/quickstart/) for implementing ipfs clusters in docker
- move with terminal to folder `vdic-gateway` and run `npm install`
- move with terminal to folder `test-suite-pinning-service` and run `npm install`

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
- go to ``C:\Users\sidla\.ipfs-cluster`` to see all IPFS cluster configurations and persistent data 



## Workflow (without VCs)
1. leader inits own cluster using [Quickstart](#using-quickstart-guide)
2. leader inits collaborative cluster for shared storage (see [guide](https://ipfscluster.io/documentation/collaborative/setup/)):
    1. run ``./ipfs-cluster-service/ipfs-cluster-service init --consensus crdt``, which leads to:
        - new identity written to ``C:\Users\sidla\.ipfs-cluster\identity.json``
        - new empty peerstore written to ``C:\Users\sidla\.ipfs-cluster\peerstore``
    2. go to file ``C:\Users\sidla\.ipfs-cluster\service.json`` and set value of attribute ``consensus.crdt.trusted_peers`` to an array of the IDs of leader's peers --> with default value of ``*`` the cluster is open to everyone. The ``secret`` in ``service.json`` is only used for the other consensus methodology which is not recommended by IPFS Cluster. The ``secret`` is not relevant for the chosen consensus methodology of ``crdt``.
    3. create configuration template for followers
    4. distribute configuration template to selected cluster members
3. cluster members use template and ``ipfs-cluster-follow`` to join cluster

## Questions?
- How to onboard new peers with OID4VC?
- How to autorize write and read requests using OID4VP? --> the leader can just do it using ipfs-cluster-service and members can do it by using ipfs-cluster-follow --> how one can add authentication layer - adapt code of ipfs-cluster-follow, change 

## Possible solutions:
1. VC embedded in each cluster node
    - provide service which anyone can use to create an ipfs node, which is digitally represented by a DID
2. Rewrite IPFS cluster: [this code](https://github.com/ipfs-cluster/ipfs-cluster/blob/master/consensus/crdt/) need to be adapted for different authentication method
    - 
