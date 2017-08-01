import ReactGA from 'react-ga';
import ENV from '../../config';

const debug = process.env.NODE_ENV === 'dev';

const startGoogleAnalytics = () => {
  // ReactGA.initialize(ENV().googleAnalyticsIdentifier, {
  //   debug
  // });
  // if (debug) {
  //   ReactGA.ga('set', 'sendHitTask', null);
  // }
  // logPageView();
};

const hashToPath = path => {
  const cutoff = path.lastIndexOf("_");
  if (cutoff < 0) return path;
  return path.substring(0, cutoff);
}
/**
* Keeps track of which pages are visited. 
*/
const logPageView = () => {
  // const pagePath = hashToPath(location.pathname + location.search  + location.hash);
  // ReactGA.set({ page: pagePath });
  // ReactGA.pageview(pagePath);
}


const gaEvent = (category, action, label) => {
  // let args = {category: category, action: action};
  // if (label) args.label = label;

  // ReactGA.event( args );
}

/**
* Log which employee type interacts with the navigation menu and in what way
* Category: Menu
* Action: Expand, or the click text
* Label: one of [Employee, "Searcher", "Approver", or "Resourcemanager"]
* Utilizes BasePage's GetCurrentUserType() function
*/
const gaDashboardMenu = (clickText, employeeType) => {
  gaEvent("Menu", (clickText) ? clickText : "Expand", employeeType);
}

/**
* Log when a user edits their interests, industries, or past clients.
* Category: Characteristics
* Action: one of ["Interest", "Industry", "PastClient"]
* Label: one of [Employee, "Searcher", "Approver", or "Resourcemanager"]
*/
const gaDashboardCharacteristics = (category, employeeType) => {//checked
  gaEvent("Characteristics", category, employeeType);
}

/**
* Log when a user goes to add/remove skills 
* Category: Skill Edit
* Action: the number of skills that the given employee already has
* Label: one of [Employee, "Searcher", "Approver", or "Resourcemanager"]
*/
const gaDashboardSkillEdit = (nSkills, employeeType) => { ///CHECKED
  gaEvent('Skill Edit', nSkills, employeeType);
}

/**
* Log when a user opens a single skill to select their proficiency level
*/
const gaAddSkillSkill = (clickText, employeeType) => {
  gaEvent('Skill', clickText, employeeType);
}

/**
* Log when a user filters all of the skills
*/
const gaAddSkillsFilter = (clickText, employeeType) => {
  gaEvent('Filter', clickText, employeeType);
}

/**
* Log when a manager expands an employee result in their team listing
// not tested!
*/
const gaTeamEmployee = (location, nSkills) => {
  gaEvent('Employee', 'Expand', location + ": " + nSkills);
}
/**
* Log when a manager verifies their employee's skill
// not tested!
*/
const gaVerifyViewSkill = () => {
  gaEvent('Skill', 'Verify');
}

/*
* Log when a user clicks on a location bubble in Resource hotspot
*/
const gaSearchLocationSearch = location => {
  gaEvent("LocationSearch", location);
}
/*
* Log when a user clicks on a skill term in "Top Searched Skills" in Resource hotspot
*/
const gaSearchSkillSearch = clickText => {
  gaEvent("SkillSearch", clickText);
}

/*
* Log when a user expands an employee result in a skill search
*/
const gaEmployeeViewEmployeeSearch = (employeeName, nSearchedSkills) => {
  gaEvent("EmployeeSearch", employeeName, nSearchedSkills);
}

/*
* Log when a user filters employee result in a skill search
*/
const gaEmployeeViewFilter = (locationText, nSearchedSkills) => {
  gaEvent("Filter", locationText, nSearchedSkills);
}

/**
* The only dashboardName is "Compliance",
* and the optional dashboardText possibilities are "Active Users" and "Inactive Users"
*/
const gaDashboardViewDashboard = (dashboardName, dashboardText) => {
  gaEvent("Dashboard", dashboardName, dashboardText);
} 


export {
  startGoogleAnalytics as default,
  logPageView,
  gaDashboardMenu,
  gaDashboardCharacteristics, gaDashboardSkillEdit,
  gaAddSkillSkill, gaAddSkillsFilter,
  gaTeamEmployee,
  gaVerifyViewSkill,
  gaSearchLocationSearch, gaSearchSkillSearch,
  gaEmployeeViewEmployeeSearch,gaEmployeeViewFilter,
  gaDashboardViewDashboard
};