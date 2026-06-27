import { mount, goMenu } from "./mount";
import PvpFlow from "../components/PvpFlow";

mount(<PvpFlow onExit={goMenu} />);
