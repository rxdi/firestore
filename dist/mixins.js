"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class GenericFirebaseModel {
    constructor(firestore, collectionName) {
        this.collection = firestore.collection(collectionName);
    }
    createDocument(payload, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            let ref = this.collection.doc();
            if (doc) {
                ref = this.getDocumentRef(doc);
            }
            payload['id'] = ref.id;
            const document = yield ref.set(payload);
            return Object.assign({ writeTime: document.writeTime }, payload);
        });
    }
    getDocumentRef(doc) {
        return this.collection.doc(doc);
    }
    getDocument(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getDocumentRef(doc).get()).data();
        });
    }
    deleteDocument(doc) {
        return this.getDocumentRef(doc).delete();
    }
    updateDocument(doc, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getDocumentRef(doc).update(payload);
            return this.getDocument(doc);
        });
    }
    findDocuments(where) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!where) {
                const snapshot = yield this.collection.get();
                return snapshot.docs.map(doc => doc.data());
            }
            let query;
            Object.keys(where).forEach(k => {
                if (!query) {
                    query = this.collection.where(k, '==', where[k]);
                }
                query.where(k, '==', where[k]);
            });
            return (yield query.get()).docs.map(doc => doc.data());
        });
    }
    findDocument(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.findDocuments(payload);
            if (docs.length > 1) {
                throw new Error('More than one documents found for this query');
            }
            if (docs.length) {
                return docs[0];
            }
            return null;
        });
    }
}
exports.GenericFirebaseModel = GenericFirebaseModel;
