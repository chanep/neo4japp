'use strict'
const _ = require('lodash');
const db = require('../data-access/db');

module.exports = {
    resetDb: function(partition){
        let session = db.session();
        let cmd = `
            MATCH (n:${partition})
            OPTIONAL MATCH (n:${partition})-[r]-()
            DELETE n,r
            RETURN count(n) as deletedNodesCount`;
        return session.run(cmd)
            .then(result => {
                session.close();
                return result;
            });
    }
}