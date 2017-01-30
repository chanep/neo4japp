module.exports = function() {
	var ENV = {
    	baseServicesURL: 'https://skillsearch2-qa.ny.rga.com:5005/api/',
    	knowledgeLevels: [
    		{level: 1, desc: 'Heavy Supervision'},
    		{level: 2, desc: 'Light Supervision'},
    		{level: 3, desc: 'No Supervision'},
    		{level: 4, desc: 'Can teach / manage others'},
    	],
        search: {
            pillsLimit: 100,
            resultsLimit: 20
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