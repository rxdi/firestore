# Firebase firestore reactive database mixins

- TypeSafe, Reactive
- Firebase cloud function and AWS Lambda compatability

#### Install
```bash
npm i @rxdi/firestore
```

#### Initialize firebase module
```typescript

import { Module } from '@rxdi/core';
import { FirebaseModule } from '@rxdi/firestore';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

@Module({
  imports: [
    FirebaseModule.forRoot({
      projectId: 'your-firebase-project-id',
      credential: process.env.IS_NOT_LAMBDA
        ? admin.credential.applicationDefault()
        : functions.config().firebase
    }),
  ],
})
export class AppModule {}
```

#### Set environment variable `GOOGLE_APPLICATION_CREDENTIALS` representing your Firebase configuration

> More info can be found here https://firebase.google.com/docs/admin/setup

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
```

```json
{
    "type": "service_account",
    "project_id": "",
    "private_key_id": "",
    "private_key": "-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n",
    "client_email": "",
    "client_id": "",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eb9yl%40xx-xx-xx.iam.gserviceaccount.com"
  }
```

When executing `admin.credential.applicationDefault()` firebase will get path from `GOOGLE_APPLICATION_CREDENTIALS` and try to read and load the credentials.



#### Define your reactive firestore collections


```typescript
import { Injectable, Inject } from '@rxdi/core';
import { GenericFirebaseModel, Firestore } from '@rxdi/firebase';

interface IUserType {
  id: string;
  displayName: string;
  email: string;
}

@Injectable()
export class UserCollection extends GenericFirebaseModel<IUserType> {
  constructor(@Inject(Firestore) firestore: Firestore) {
    super(firestore, 'users');
  }
}

```



#### Import it inside some module for example `models.module.ts`


```typescript
import { Module } from '@rxdi/core';
import { UserCollection } from './models/user';

@Module({
  providers: [UserCollection]
})
export class ModelsModule {}

```


#### import `ModelsModule` it inside AppModule

```typescript
import { Module } from '@rxdi/core';
import { FirebaseModule } from '@rxdi/firestore';
import { ModelsModule } from '../database/models.module';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

@Module({
  imports: [
    FirebaseModule.forRoot({
      projectId: 'your-firebase-project-id',
      credential: process.env.IS_NOT_LAMBDA
        ? admin.credential.applicationDefault()
        : functions.config().firebase
    }),
    ModelsModule
  ],
})
export class AppModule {}

```


#### Use created mixins


```typescript
import { Injectable } from '@rxdi/core';
import { UserCollection } from '../models/user';

@Injectable()
export class UserCollectionService {
  constructor(
    private userCollection: UserCollection
  ) {}
}

```

#### Mixins provide the following methods

```typescript
export declare class GenericFirebaseModel<T> {
    createDocument(payload: T, doc?: string): Promise<T>;
    getDocumentRef(doc: string): FirebaseFirestore.DocumentReference;
    getDocument(doc: string): Promise<T>;
    deleteDocument(doc: string): Promise<FirebaseFirestore.WriteResult>;
    updateDocument(doc: string, payload: T): Promise<T>;
    findDocuments(where?: T): Promise<T[]>;
    findDocument(payload: T): Promise<T>;
}
```