export interface ObjectStorageBrowserClient {
    uploadFile(file: File, objectKey: string): Promise<void>;
}

export class MinioBrowserClient implements ObjectStorageBrowserClient {
    private endpoint: string;
    private bucketName: string;

    constructor() {
        // Use standard local MinIO if not configured via Vite env
        this.endpoint = (import.meta as any).env?.VITE_MINIO_ENDPOINT || "http://127.0.0.1:9000";
        this.bucketName = (import.meta as any).env?.VITE_OBJECT_STORE_BUCKET || "vhl";
    }

    async uploadFile(file: File, objectKey: string): Promise<void> {
        try {
            // Direct PUT request to MinIO. 
            // This relies on the bucket having an anonymous upload policy for the path (configured in docker-compose.yml).
            const url = `${this.endpoint}/${this.bucketName}/${objectKey}`;
            
            console.log(`[MinioBrowserClient] Uploading ${file.name} to ${url}`);
            
            const response = await fetch(url, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type || "application/zip",
                },
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => "");
                throw new Error(`Failed to upload: ${response.status} ${response.statusText} ${errorText}`);
            }

            console.log(`[MinioBrowserClient] Successfully uploaded ${file.name} to ${objectKey}`);
        } catch (err: any) {
            console.error(`[MinioBrowserClient] Upload failed for ${file.name}: ${err.message}`);
            throw err;
        }
    }
}

let _browserClient: ObjectStorageBrowserClient | null = null;

export function getBrowserStorageClient(): ObjectStorageBrowserClient {
    if (!_browserClient) {
        _browserClient = new MinioBrowserClient();
    }
    return _browserClient;
}

export async function computeFileHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}
