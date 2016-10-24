module.exports = function() {
	var ENV = {
    	baseServicesURL: 'http://skillsearch2-qa:5005/api/',
    	knowledgeLevels: [
    		{level: 1, desc: 'Heavy Supervision'},
    		{level: 2, desc: 'Light Supervision'},
    		{level: 3, desc: 'No Supervision'},
    		{level: 4, desc: 'Can teach / manage others'},
    	],
        resourceManagerHome: {
            topSearchedSkillsCount: 10
        }
    }

    return ENV;
};