// Gestion des collections

import {getConfig} from '../config/config.js'
import {Candle} from '../core.js'

export default class cData {
    /**
     *
     */
    constructor() {
        var self = this;
        document.onreadystatechange = function () {
            const config = getConfig().base;
            firebase.initializeApp(config);
            self.db = firebase.firestore();
            self.db.enablePersistence()
                .catch(err => {
                    if (err.code === 'failed-precondition') {
                        // Multiple tabs open, persistence can only be enabled
                        // in one tab at a a time.
                        // ...
                    } else if (err.code === 'unimplemented') {
                        // The current browser does not support all of the
                        // features required to enable persistence
                        // ...
                    } else {
                        console.log(err)
                    }
                });
            self.initDocs();
        };
    }

    /**
     *
     * @param name
     * @param callback
     */
    getDoc(name, callback) {
        if (Candle.functions.type(name, {'type': 'string'}) && Candle.functions.type(callback, {'type': 'function'})) {
            const result = [];
            this.db.collection(name).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        result.push(doc.data());
                    });
                    callback(result);
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        }
    }

    /**
     *
     */
    initDocs() {
        var esSetItem = localStorage.setItem;

        localStorage.setItem = function() {
            var event = new Event('dataStored');
            document.dispatchEvent(event);
            esSetItem.apply(this, arguments);
        };

        const self = this;
        getConfig().data.forEach(function (el) {
            self.getDoc(el.collection, function (data) {
                window.localStorage.setItem("CandleData_" + el.collection, JSON.stringify(data));
            });
        });
    }
}

