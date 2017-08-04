
function UniqueIdManager() {
    this.listeners = {};
    this.uniqueIdInfos = {};

    this.globalListeners = [];
//var uniqueIdListener = {
//    uniqueIdAdded: function(owner, namespace, id) {
//    },
//    uniqueIdChanged: function(owner, namespace, oldId, newId) {
//    },
//    uniqueIdRemoved: function(owner, namespace, id) {
//    }
//}

}

UniqueIdManager.prototype.addGlobalUniqueIdListener = function(listener) {
    this.globalListeners.push(listener);
};


UniqueIdManager.prototype.addUniqueIdListener = function(namespace, listener) {
    var listenerArr = this.listeners[namespace];
    if (!listenerArr) {
        listenerArr = [];
        this.listeners[namespace] = listenerArr;
    }
    listenerArr.push(listener);
};

UniqueIdManager.prototype.removeUniqueIdListener = function(namespace, listener) {
    var listenerArr = this.listeners[namespace];
    if (listenerArr) {
        arrayDelete(listenerArr, listener);
    }
};


UniqueIdManager.prototype.uniqueIdAvailable = function(owner, namespace, testId) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        return true;
    }
    var existingOwner = idInfos.get(testId);
    if (existingOwner === owner) {
        return true;
    }
    if (typeof existingOwner === 'undefined') {
        return true;
    }
    return false;
};


UniqueIdManager.prototype.uniqueIdExists = function(owner, namespace, testId) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        return false;
    }
    var existingOwner = idInfos.get(testId);
    if (existingOwner) {
        return true;
    }
    return false;
};


UniqueIdManager.prototype.getNextUniqueId = function(namespace, prefix) {
    var counter = 1;
    var idInfos = this.uniqueIdInfos[namespace];
    while (true) {
        var testId = prefix + "" + counter;
        if (!idInfos || typeof idInfos.get(testId) === 'undefined') {
            return testId;
        }
        counter++;
    }
};

UniqueIdManager.prototype.getUniqueIds = function(namespace) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        return [];
    } else {
        return idInfos.listKeys();
    }
};

UniqueIdManager.prototype.getListeners = function(namespace) {
    var arr = this.listeners[namespace];
    return arr ? arr : [];
};

UniqueIdManager.prototype.addUniqueId = function(owner, namespace, newId) {
    //    logit("Adding unique id " + newId + " ns: " + namespace + "<br />");

    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        idInfos = new Map(true);
        this.uniqueIdInfos[namespace] = idInfos;
    }
    if (typeof idInfos.get(newId) === 'undefined') {
        idInfos.put(newId, owner);
        //        logit("addUniqueId() called in uid manager. Listeners: " + this.getListeners(namespace) + "<br />");
        $.each(this.getListeners(namespace), function(key, value) {
            //            logit("Calling listener for id added in uid manager<br />");
            value.uniqueIdAdded(owner, namespace, newId);
        });
        for (var i=0; i<this.globalListeners.length; i++) {
            this.globalListeners[i].uniqueIdAdded(owner, namespace, newId);
        }
    } else {
        logit("id already existed in addUniqueId() " + namespace + " " + newId + "<br />");
    }
};

UniqueIdManager.prototype.changeUniqueId = function(owner, namespace, oldId, newId) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (idInfos) {
        var oldOwner = idInfos.get(oldId);
        //        if (oldOwner == owner) {
        idInfos.remove(oldId);
        idInfos.put(newId, owner);
        $.each(this.getListeners(namespace), function(key, value) {
            value.uniqueIdChanged(owner, namespace, oldId, newId);
        });
        //        } else {
        //            logit("old owner not the same as new owner in changeUniqueId() " + namespace + " " + oldId + " " + newId + "<br />");
        //        }
    } else {
        logit("could not find any ids for namespace " + namespace + " in changeUniqueId()<br />");
    }
    for (var i=0; i<this.globalListeners.length; i++) {
        this.globalListeners[i].uniqueIdChanged(owner, namespace, oldId, newId);
    }

};

UniqueIdManager.prototype.removeUniqueId = function(namespace, id) {

    var idInfos = this.uniqueIdInfos[namespace];
    if (idInfos) {
        var owner = idInfos.get(id);
        if (typeof owner === 'undefined') {
            logit("owner not exist in removeUniqueId() " + namespace + " " + id + "<br />");
        } else {
            idInfos.remove(id);
            $.each(this.getListeners(namespace), function(key, value) {
                value.uniqueIdRemoved(owner, namespace, id);
            });
        }
    } else {
        logit("could not find any ids for namespace " + namespace + " in removeUniqueId()<br />");
    }

    for (var i=0; i<this.globalListeners.length; i++) {
        this.globalListeners[i].uniqueIdRemoved(owner, namespace, id);
    }

};

