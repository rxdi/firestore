import { CollectionReference, Firestore, Query } from '@google-cloud/firestore';

export class GenericFirebaseModel<T> {
  private collection: CollectionReference;
  constructor(firestore: Firestore, collectionName: string) {
    this.collection = firestore.collection(collectionName);
  }

  async createDocument(payload: T, doc?: string): Promise<T> {
    let ref = this.collection.doc();
    if (doc) {
      ref = this.getDocumentRef(doc);
    }
    payload['id'] = ref.id;
    const document = await ref.set(payload);
    return {
      writeTime: document.writeTime,
      ...payload
    };
  }

  getDocumentRef(doc: string) {
    return this.collection.doc(doc);
  }

  async getDocument(doc: string): Promise<T> {
    return (await this.getDocumentRef(doc).get()).data() as any;
  }

  deleteDocument(doc: string) {
    return this.getDocumentRef(doc).delete();
  }

  async updateDocument(doc: string, payload: T) {
    await this.getDocumentRef(doc).update(payload);
    return this.getDocument(doc);
  }

  async findDocuments(where?: T): Promise<T[]> {
    if (!where) {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(doc => doc.data()) as any;
    }
    let query: Query;
    Object.keys(where).forEach(k => {
      if (!query) {
        query = this.collection.where(k, '==', where[k]);
      }
      query.where(k, '==', where[k]);
    });
    return (await query.get()).docs.map(doc => doc.data()) as any;
  }

  async findDocument(payload: T) {
    const docs = await this.findDocuments(payload);
    if (docs.length > 1) {
      throw new Error('More than one documents found for this query');
    }
    if (docs.length) {
      return docs[0];
    }
    return null;
  }
}
