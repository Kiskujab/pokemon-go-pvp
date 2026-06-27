import { mount, goMenu } from "./mount";
import RaidScreen from "../components/raid/RaidScreen";

mount(<RaidScreen onExit={goMenu} />);
