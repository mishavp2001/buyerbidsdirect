type FileWithKey = {
    file: File;
    key: string;
  };
  
 export const processFile = async ({ file }: { file: File }): Promise<FileWithKey> => {
    // Extract the file extension
    const fileExtension = file.name.split('.').pop() || '';
  
    // Read the file as an ArrayBuffer and compute its SHA-1 hash
    const fileBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-1', fileBuffer);
  
    // Convert the hash buffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  
    // Construct the key using the hash and file extension
    return { file, key: `${hashHex}.${fileExtension}` };
  };
  