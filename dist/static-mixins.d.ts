import { GenericFirebaseModel } from './mixins';
export declare class StaticMethods {
    static model: GenericFirebaseModel<any>;
    static setStaticSelf<T>(self: GenericFirebaseModel<T>): void;
    static create<T>(payload: T, doc?: string): Promise<T>;
    static getCollectionRef(): FirebaseFirestore.CollectionReference;
    static getFirestoreRef(): FirebaseFirestore.Firestore;
    static getRef(doc: string): FirebaseFirestore.DocumentReference;
    static get<T>(doc: string): Promise<T>;
    static delete(doc: string): Promise<FirebaseFirestore.WriteResult>;
    static update<T>(doc: string, payload: T): Promise<any>;
    static findAll<T>(where?: T): Promise<T[]>;
    static find<T>(payload: T): Promise<any>;
}
