import { library } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from "@fortawesome/vue-fontawesome";
//Solid
import {
  faHome, faCube, faCopy, faUsers, faRankingStar, faCircleInfo, faServer, faSignal,
  faGamepad, faCircle, faStar, faThumbsUp, faPlus, faCheck, faSpinner
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faHome, faCube, faCopy, faUsers, faRankingStar, faCircleInfo, faServer, faSignal,
  faGamepad, faCircle, faStar, faThumbsUp, faPlus, faCheck, faSpinner
);

import {
  faThumbsUp as farThumbsUp
} from "@fortawesome/free-regular-svg-icons";
library.add(
  farThumbsUp
);

export { FontAwesomeIcon, FontAwesomeLayers };
