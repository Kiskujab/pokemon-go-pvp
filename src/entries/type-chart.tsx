import { mount, goMenu } from "./mount";
import TypeExplorer from "../components/types/TypeExplorer";

mount(<TypeExplorer onExit={goMenu} />);
