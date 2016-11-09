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
            topSearchedSkillsCount: 10,
            topSkillsWeeksPeriod: 2
        },
        interests: {
            minimumLenghtLookup: 2,
            suggestionsNumber: 5,
            minimumInterestLength: 3
        },
        preselectedFilter: {
            "Quality Assurance": "Technology",
            "Prototype Studio": "Technology",
            "Technology": "Technology",
            "Visual Design": "Design"
        }
    }

    return ENV;
};