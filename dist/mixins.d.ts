import { Firestore } from '@google-cloud/firestore';
export declare class GenericFirebaseModel<T> {
    private collection;
    constructor(firestore: Firestore, collectionName: string);
    createDocument(payload: T, doc?: string): Promise<T>;
    getDocumentRef(doc: string): FirebaseFirestore.DocumentReference;
    getDocument(doc: string): Promise<T>;
    deleteDocument(doc: string): Promise<FirebaseFirestore.WriteResult>;
    updateDocument(doc: string, payload: T): Promise<T>;
    findDocuments(where?: T): Promise<T[]>;
    findDocument(payload: T): Promise<T>;
}
