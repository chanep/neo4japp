module.exports = function() {
	var ENV = {
    	baseServicesURL: 'https://skillsearch.ny.rga.com:4435/api/',
    	knowledgeLevels: [
    		{level: 1, desc: 'Heavy Supervision'},
    		{level: 2, desc: 'Light Supervision'},
    		{level: 3, desc: 'No Supervision'},
    		{level: 4, desc: 'Can teach / manage others'},
    	],
        search: {
            pillsLimit: 100,
            resultsLimit: 1000
        },
        resourceManagerHome: {
            topSearchedSkillsCount: 10,
            topSkillsWeeksPeriod: 2
        },
        interests: {
            minimumLenghtLookup: 2,
            suggestionsNumber: 5,
            minimumInterestLength: 3,
            maximumInterestLength: 25
        },
        clients: {
            minimumLenghtLookup: 2,
            suggestionsNumber: 5,
            minimumInterestLength: 3,
            maximumInterestLength: 25
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
