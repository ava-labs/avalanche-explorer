let network_id: number = 0;

export default class Network {
    id: number; // used for FE unique key
    protocol: string;
    ip: string;
    port: number;
    networkId: number;
    name: string;
    
    chainId:string;
    url: string;
    
    explorerUrl:    string | undefined;

    constructor(
        name: string, 
        url: string, 
        networkId: number, 
        chainId: string, 
        explorerUrl?: string
    ) {
        this.protocol = "http";
        this.ip="localhost";
        this.port = 9650;

        this.id = network_id++; 
        this.name = name;
        this.networkId = networkId;
        this.chainId = chainId;
        
        this.url = url;
        this.updateURL(url);
                
        this.explorerUrl = explorerUrl;
    }

    public updateURL(url: string): void {
        // parse the url 
        let split: string[] = url.split('://');
        
        // parse protocol
        this.protocol = split[0];

        // parse port
        if (split[1].includes(':')){
            // if the URL contains a port setting
            let urlSplit: string[] = split[1].split(':');
            let ip: string = urlSplit[0];
            let port: string = urlSplit[1];
            this.ip = ip;
            this.port = parseInt(port);
        } else {
            this.ip = split[1];
            if (this.protocol === 'http'){
                this.port = 80;
            } else {
                this.port = 443;
            }
        }
    }
    public getFullURL(): string {
        return `${this.protocol}://${this.ip}:${this.port}`;
    }
}
