module.exports = function() {
	var ENV = {
    	baseServicesURL: 'http://localhost:15005/api/',
    	knowledgeLevels: [
    		{level: 1, desc: 'Heavy Survision'},
    		{level: 2, desc: 'Light Survision'},
    		{level: 3, desc: 'No Survision'},
    		{level: 4, desc: 'Can teach / manage others'},
    	]
    }

    return ENV;
};