import mind from "./areas/mind";
import presence from "./areas/presence";
import social from "./areas/social";
import communication from "./areas/communication";
import body from "./areas/body";

// Add a new area file under ./areas and list it here to add a new life area.
export const DEFAULT_DATA = {
  areas: [mind, presence, social, communication, body],
  journal: [],
  shares: [],
  coachInsights: [],
};
